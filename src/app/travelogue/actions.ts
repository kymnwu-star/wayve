'use server'

import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'

// 서비스 계정 인증 초기화 (actions.ts 재사용 방식)
function getGoogleSheet() {
  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/^"|"$/g, ''),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, serviceAccountAuth);
}

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const author = formData.get('author') as string;
  const region = formData.get('region') as string;
  const content = formData.get('content') as string;

  try {
    const doc = getGoogleSheet();
    await doc.loadInfo();
    
    // 'Travelogue' 탭 찾기, 없으면 생성
    let sheet = doc.sheetsByTitle['Travelogue'];
    if (!sheet) {
      sheet = await doc.addSheet({ headerValues: ['Region', 'Title', 'Author', 'Content', 'CreatedAt'], title: 'Travelogue' });
    } else {
      try {
        await sheet.setHeaderRow(['Region', 'Title', 'Author', 'Content', 'CreatedAt']);
      } catch (e) {}
    }

    await sheet.addRow({
      Region: region,
      Title: title,
      Author: author,
      Content: content,
      CreatedAt: new Date().toISOString()
    });

    return { success: true };
  } catch (error) {
    console.error('Google Sheets API Error (Travelogue):', error);
    return { success: false, error: '백엔드 시스템 오류가 발생했습니다.' };
  }
}
