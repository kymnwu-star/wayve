'use server'

import { supabase } from '@/utils/supabase'

export async function createReservation(formData: FormData) {
  const guestName = formData.get('guestName') as string;
  const phone = formData.get('phone') as string;
  const dates = formData.get('dates') as string;
  const specialRequests = formData.get('specialRequests') as string;
  const accommodationName = formData.get('accommodationName') as string;

  try {
    const { error } = await supabase.from('reservations').insert([{
      guest_name: guestName,
      phone,
      dates,
      special_requests: specialRequests,
      accommodation_name: accommodationName,
    }]);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Supabase API Error (Create Reservation):', error);
    return { success: false, error: '예약 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' };
  }
}
