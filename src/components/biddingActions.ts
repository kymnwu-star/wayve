'use server';

import { supabase } from '@/utils/supabase';
import { revalidatePath } from 'next/cache';

export async function submitBid(formData: FormData) {
  const tourIdStr = formData.get('tourId') as string;
  const date = formData.get('date') as string;
  const timeSlot = formData.get('timeSlot') as string;
  const bidPrice = parseInt(formData.get('bidPrice') as string, 10);
  
  // (임시) 로그인 유저가 없으므로 임의의 user_id 할당
  const userId = 'user_dummy_123';
  
  // dummy-로 시작하는 투어는 ID를 null로 넣거나(스키마 구조상) 숫자만 남깁니다.
  // 여기서는 bigint references tours(id) 이므로 dummy ID면 에러가 날 수 있습니다.
  // 에러를 피하기 위해 tour_id를 널 허용으로 바꿨다고 가정하거나, 그냥 넣습니다.
  let tourId: number | null = null;
  let tourPrice = 0;
  
  if (!tourIdStr.startsWith('dummy-')) {
    tourId = parseInt(tourIdStr, 10);
    // 투어의 정가(판매자 지정 가격) 조회
    const { data: tourData } = await supabase
      .from('tours')
      .select('price')
      .eq('id', tourId)
      .single();
      
    if (tourData) {
      tourPrice = tourData.price;
    }
  }

  // 판매자가 정한 가격보다 입찰가가 높거나 같으면 바로 승인 (accepted)
  const initialStatus = (tourPrice > 0 && bidPrice >= tourPrice) ? 'accepted' : 'pending';

  const { error } = await supabase.from('bidding_requests').insert([{
    tour_id: tourId,
    user_id: userId,
    bid_date: date,
    bid_time: timeSlot,
    bid_price: bidPrice,
    status: initialStatus
  }]);

  if (error) {
    console.error('Bidding Insert Error:', error);
    return { success: false, message: '입찰 신청 중 오류가 발생했습니다.' };
  }

  revalidatePath('/mypage/bids');
  revalidatePath('/partner/dashboard');
  
  return { success: true };
}
