'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'

function getGoogleSheet() {
  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, serviceAccountAuth);
}

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
    const doc = getGoogleSheet();
    await doc.loadInfo();
    
    // Tours 시트 찾기, 없으면 생성
    let sheet = doc.sheetsByTitle['Tours'];
    if (!sheet) {
      sheet = await doc.addSheet({ title: 'Tours' });
      await sheet.setHeaderRow(['Title', 'Description', 'Price', 'Duration', 'MaxCapacity', 'Category', 'ImageUrl', 'CreatedAt', 'CreatedBy']);
    }

    // 데이터 추가
    await sheet.addRow({
      Title: title,
      Description: description,
      Price: price,
      Duration: duration,
      MaxCapacity: maxCapacity,
      Category: category,
      ImageUrl: imageUrl,
      CreatedAt: new Date().toISOString(),
      CreatedBy: session.value // 등록자 이메일
    });

    redirectUrl = `/admin/tours/new?message=${encodeURIComponent('투어 상품이 성공적으로 등록되었습니다!')}`;
  } catch (error) {
    console.error('Google Sheets API Error (Tours):', error);
    redirectUrl = `/admin/tours/new?message=${encodeURIComponent('투어 등록에 실패했습니다. 관리자에게 문의하세요.')}`;
  }

  revalidatePath('/admin/tours/new');
  redirect(redirectUrl);
}
