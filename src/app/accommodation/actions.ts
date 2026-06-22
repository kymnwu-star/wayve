'use server'

import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'

function getGoogleSheet() {
  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/^"|"$/g, ''),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, serviceAccountAuth);
}

export async function createReservation(formData: FormData) {
  const accommodationName = formData.get('accommodationName') as string;
  const guestName = formData.get('guestName') as string;
  const phone = formData.get('phone') as string;
  const dates = formData.get('dates') as string;
  const specialRequests = formData.get('specialRequests') as string;

  try {
    const doc = getGoogleSheet();
    await doc.loadInfo();
    
    // 'Reservations' 탭 찾기, 없으면 생성
    let sheet = doc.sheetsByTitle['Reservations'];
    if (!sheet) {
      sheet = await doc.addSheet({ headerValues: ['Accommodation', 'GuestName', 'Phone', 'Dates', 'Requests', 'CreatedAt'], title: 'Reservations' });
    } else {
      try {
        await sheet.setHeaderRow(['Accommodation', 'GuestName', 'Phone', 'Dates', 'Requests', 'CreatedAt']);
      } catch (e) {}
    }

    await sheet.addRow({
      Accommodation: accommodationName,
      GuestName: guestName,
      Phone: phone,
      Dates: dates,
      Requests: specialRequests,
      CreatedAt: new Date().toISOString()
    });

    return { success: true };
  } catch (error) {
    console.error('Google Sheets API Error (Reservations):', error);
    return { success: false, error: '백엔드 시스템 오류가 발생했습니다.' };
  }
}
