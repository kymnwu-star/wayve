'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { supabase } from '@/utils/supabase'

export async function createTour(formData: FormData) {
  // 1. 로그인 여부 확인
  const cookieStore = await cookies();
  const session = cookieStore.get('wave_session');
  
  if (!session?.value) {
    redirect('/login?message=' + encodeURIComponent('로그인이 필요한 서비스입니다.'));
  }

  // 2. 폼 데이터 추출
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const price = formData.get('price') as string;
  const duration = formData.get('duration') as string;
  const maxCapacity = formData.get('maxCapacity') as string;
  const category = formData.get('category') as string;
  const imageUrl = formData.get('imageUrl') as string;

  let redirectUrl = '';

  try {
    // 3. Supabase products 테이블에 임시 삽입
    // (투어 테이블을 따로 안 만들었으므로 products에 우회 저장)
    const { error } = await supabase.from('products').insert([{
      title,
      competitor_url: imageUrl || 'ADMIN_TOUR',
      competitor_price: parseInt(price, 10),
      wayve_price: parseInt(price, 10),
    }]);

    if (error) throw error;

    redirectUrl = `/admin/tours/new?message=${encodeURIComponent('투어 상품이 성공적으로 등록되었습니다!')}`;
  } catch (error) {
    console.error('Supabase API Error (Tours):', error);
    redirectUrl = `/admin/tours/new?message=${encodeURIComponent('투어 등록에 실패했습니다. 관리자에게 문의하세요.')}`;
  }

  revalidatePath('/admin/tours/new');
  redirect(redirectUrl);
}
