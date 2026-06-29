'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { supabase } from '@/utils/supabase'

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  let redirectUrl = '';
  
  try {
    let userRole = '';
    let foundUser = null;

    // 1. 관광객 테이블 확인
    const { data: tourists } = await supabase
      .from('tourists')
      .select('*')
      .eq('email', email)
      .eq('password', password);
    
    if (tourists && tourists.length > 0) {
      foundUser = tourists[0];
      userRole = 'Tourist';
    }

    // 2. 파트너 테이블 확인
    if (!foundUser) {
      const { data: partners } = await supabase
        .from('partners')
        .select('*')
        .eq('email', email)
        .eq('password', password);
      
      if (partners && partners.length > 0) {
        foundUser = partners[0];
        userRole = 'Partner';
      }
    }

    // 3. 관리자 테이블 확인
    if (!foundUser) {
      const { data: admins } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .eq('password', password);
      
      if (admins && admins.length > 0) {
        foundUser = admins[0];
        userRole = 'Admin';
      }
    }

    if (foundUser) {
      const cookieStore = await cookies();
      cookieStore.set('wave_session', email, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      cookieStore.set('wave_role', userRole, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      if (foundUser.nickname) {
        cookieStore.set('wave_nickname', foundUser.nickname, {
          httpOnly: false, // Make accessible to client if needed, or pass via server
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7
        });
      }
      
      if (userRole === 'Partner') {
        redirectUrl = '/partner/dashboard';
      } else {
        redirectUrl = '/?login=success';
      }
    } else {
      redirectUrl = `/login?message=${encodeURIComponent('이메일 또는 비밀번호가 올바르지 않습니다.')}`;
    }
  } catch (error) {
    console.error('Supabase API Error (Login):', error);
    redirectUrl = `/login?message=${encodeURIComponent('백엔드 시스템 오류가 발생했습니다.')}`;
  }

  if (redirectUrl.startsWith('/?')) {
    revalidatePath('/', 'layout');
  }
  redirect(redirectUrl);
}

export async function signupTourist(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const nickname = formData.get('nickname') as string || '';
  const gender = formData.get('gender') as string || '';
  const country = formData.get('country') as string || '';
  const travelType = formData.get('travelType') as string || '';

  let redirectUrl = '';
  try {
    const { data: existingUser } = await supabase
      .from('tourists')
      .select('email')
      .eq('email', email);

    if (existingUser && existingUser.length > 0) {
      redirectUrl = `/login?message=${encodeURIComponent('이미 가입된 이메일입니다.')}`;
    } else {
      await supabase.from('tourists').insert([{
        email,
        password,
        nickname,
        gender,
        country,
        travel_type: travelType,
      }]);
      redirectUrl = `/login?message=${encodeURIComponent('관광객 회원가입 완료! 로그인해주세요.')}`;
    }
  } catch (error) {
    console.error('Supabase API Error (Tourist Signup):', error);
    redirectUrl = `/login?message=${encodeURIComponent('백엔드 시스템 오류가 발생했습니다.')}`;
  }
  redirect(redirectUrl);
}

export async function signupBusiness(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const companyName = formData.get('companyName') as string || '';
  const businessNumber = formData.get('businessNumber') as string || '';
  const businessAddress = formData.get('businessAddress') as string || '';
  const representativeName = formData.get('representativeName') as string || '';
  const industry = formData.get('industry') as string || '';
  const liabilityAgreed = formData.get('liabilityAgreed') === 'on' ? 'Yes' : 'No';

  let redirectUrl = '';
  try {
    const { data: existingUser } = await supabase
      .from('partners')
      .select('email')
      .eq('email', email);

    if (existingUser && existingUser.length > 0) {
      redirectUrl = `/login?message=${encodeURIComponent('이미 가입된 이메일입니다.')}`;
    } else {
      await supabase.from('partners').insert([{
        email,
        password,
        company_name: companyName,
        business_number: businessNumber,
        business_address: businessAddress,
        representative_name: representativeName,
        industry,
        liability_agreed: liabilityAgreed,
      }]);
      redirectUrl = `/login?message=${encodeURIComponent('기업 회원가입 완료! 로그인해주세요.')}`;
    }
  } catch (error) {
    console.error('Supabase API Error (Business Signup):', error);
    redirectUrl = `/login?message=${encodeURIComponent('백엔드 시스템 오류가 발생했습니다.')}`;
  }
  redirect(redirectUrl);
}

export async function signupAdmin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const adminCode = formData.get('adminCode') as string;

  const expectedAdminCode = process.env.WAYVE_ADMIN_SECRET || '123456';

  let redirectUrl = '';
  if (adminCode !== expectedAdminCode) {
    redirectUrl = `/signup/admin?message=${encodeURIComponent('관리자 코드가 일치하지 않습니다.')}`;
    redirect(redirectUrl);
  }

  try {
    const { data: existingUser } = await supabase
      .from('admins')
      .select('email')
      .eq('email', email);

    if (existingUser && existingUser.length > 0) {
      redirectUrl = `/login?message=${encodeURIComponent('이미 가입된 이메일입니다.')}`;
    } else {
      await supabase.from('admins').insert([{
        email,
        password,
      }]);
      redirectUrl = `/login?message=${encodeURIComponent('관리자 회원가입 완료! 로그인해주세요.')}`;
    }
  } catch (error) {
    console.error('Supabase API Error (Admin Signup):', error);
    redirectUrl = `/login?message=${encodeURIComponent('백엔드 시스템 오류가 발생했습니다.')}`;
  }
  redirect(redirectUrl);
}
