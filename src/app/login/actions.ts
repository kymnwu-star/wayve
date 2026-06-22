'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'

// 서비스 계정 인증 초기화
function getGoogleSheet() {
  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/^"|"$/g, ''),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, serviceAccountAuth);
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  let redirectUrl = '';
  
  try {
    const doc = getGoogleSheet();
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    const user = rows.find(row => row.get('Email') === email && row.get('Password') === password);

    if (user) {
      const cookieStore = await cookies()
      cookieStore.set('wave_session', email, { maxAge: 60 * 60 * 24 })
      redirectUrl = '/?login=success';
    } else {
      redirectUrl = `/login?message=${encodeURIComponent('이메일 또는 비밀번호가 올바르지 않습니다.')}`;
    }
  } catch (error) {
    console.error('Google Sheets API Error:', error);
    redirectUrl = `/login?message=${encodeURIComponent('백엔드 시스템 오류가 발생했습니다.')}`;
  }

  if (redirectUrl.startsWith('/?')) {
    revalidatePath('/', 'layout');
  }
  redirect(redirectUrl);
}

async function initSheetAndCheckEmail(sheet: any, email: string) {
  try {
    await sheet.setHeaderRow(['Role', 'Email', 'Password', 'Gender', 'Country', 'TravelType', 'CompanyName', 'BusinessNumber', 'BusinessAddress', 'RepresentativeName', 'Industry', 'LiabilityAgreed', 'CreatedAt']);
  } catch (e) {}

  const rows = await sheet.getRows();
  const existingUser = rows.find((row: any) => row.get('Email') === email);
  return { rows, existingUser };
}

export async function signupTourist(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const gender = formData.get('gender') as string || '';
  const country = formData.get('country') as string || '';
  const travelType = formData.get('travelType') as string || '';

  let redirectUrl = '';
  try {
    const doc = getGoogleSheet();
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    
    const { existingUser } = await initSheetAndCheckEmail(sheet, email);
    if (existingUser) {
      redirectUrl = `/login?message=${encodeURIComponent('이미 가입된 이메일입니다.')}`;
    } else {
      await sheet.addRow({
        Role: 'Tourist',
        Email: email,
        Password: password,
        Gender: gender,
        Country: country,
        TravelType: travelType,
        CreatedAt: new Date().toISOString()
      });
      redirectUrl = `/login?message=${encodeURIComponent('관광객 회원가입 완료! 로그인해주세요.')}`;
    }
  } catch (error) {
    console.error('Google Sheets API Error:', error);
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
    const doc = getGoogleSheet();
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    
    const { existingUser } = await initSheetAndCheckEmail(sheet, email);
    if (existingUser) {
      redirectUrl = `/login?message=${encodeURIComponent('이미 가입된 이메일입니다.')}`;
    } else {
      await sheet.addRow({
        Role: 'Business',
        Email: email,
        Password: password,
        CompanyName: companyName,
        BusinessNumber: businessNumber,
        BusinessAddress: businessAddress,
        RepresentativeName: representativeName,
        Industry: industry,
        LiabilityAgreed: liabilityAgreed,
        CreatedAt: new Date().toISOString()
      });
      redirectUrl = `/login?message=${encodeURIComponent('기업 회원가입 완료! 로그인해주세요.')}`;
    }
  } catch (error) {
    console.error('Google Sheets API Error:', error);
    redirectUrl = `/login?message=${encodeURIComponent('백엔드 시스템 오류가 발생했습니다.')}`;
  }
  redirect(redirectUrl);
}

export async function signupAdmin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const adminCode = formData.get('adminCode') as string;

  // 관리자 비밀코드 검증 (환경변수 또는 하드코딩)
  const expectedAdminCode = process.env.WAYVE_ADMIN_SECRET || '123456';

  let redirectUrl = '';
  if (adminCode !== expectedAdminCode) {
    redirectUrl = `/signup/admin?message=${encodeURIComponent('관리자 코드가 일치하지 않습니다.')}`;
    redirect(redirectUrl);
  }

  try {
    const doc = getGoogleSheet();
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    
    const { existingUser } = await initSheetAndCheckEmail(sheet, email);
    if (existingUser) {
      redirectUrl = `/login?message=${encodeURIComponent('이미 가입된 이메일입니다.')}`;
    } else {
      await sheet.addRow({
        Role: 'Admin',
        Email: email,
        Password: password,
        CreatedAt: new Date().toISOString()
      });
      redirectUrl = `/login?message=${encodeURIComponent('관리자 회원가입 완료! 로그인해주세요.')}`;
    }
  } catch (error) {
    console.error('Google Sheets API Error:', error);
    redirectUrl = `/login?message=${encodeURIComponent('백엔드 시스템 오류가 발생했습니다.')}`;
  }
  redirect(redirectUrl);
}
