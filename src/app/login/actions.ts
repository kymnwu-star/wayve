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
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
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

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const gender = formData.get('gender') as string || '';
  const country = formData.get('country') as string || '';
  const travelType = formData.get('travelType') as string || '';

  let redirectUrl = '';

  try {
    const doc = getGoogleSheet();
    await doc.loadInfo();
    let sheet = doc.sheetsByIndex[0];
    
    try {
      await sheet.setHeaderRow(['Email', 'Password', 'Gender', 'Country', 'TravelType', 'CreatedAt']);
    } catch (e) {}

    const rows = await sheet.getRows();
    const existingUser = rows.find(row => row.get('Email') === email);

    if (existingUser) {
      redirectUrl = `/login?message=${encodeURIComponent('이미 가입된 이메일입니다.')}`;
    } else {
      await sheet.addRow({
        Email: email,
        Password: password,
        Gender: gender,
        Country: country,
        TravelType: travelType,
        CreatedAt: new Date().toISOString()
      });
      redirectUrl = `/login?message=${encodeURIComponent('회원가입 완료! 구글 시트를 확인해 보세요.')}`;
    }
  } catch (error) {
    console.error('Google Sheets API Error:', error);
    redirectUrl = `/login?message=${encodeURIComponent('백엔드 연결 실패: 구글 클라우드에서 Sheets API를 사용 설정해주세요.')}`;
  }

  redirect(redirectUrl);
}
