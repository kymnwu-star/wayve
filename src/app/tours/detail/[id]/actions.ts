'use server'

import { supabase } from '@/utils/supabase';
import { cookies } from 'next/headers';

export async function getTourReviews(tourId: string) {
  try {
    const { data, error } = await supabase
      .from('tour_reviews')
      .select('*')
      .eq('tour_id', tourId)
      .order('created_at', { ascending: false });

    if (error) return { success: false, error: error.message };
    return { success: true, reviews: data || [] };
  } catch (error) {
    console.error(error);
    return { success: false, reviews: [] };
  }
}

export async function addTourReview(tourId: string, rating: number, content: string) {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get('wave_session')?.value;
  const userNickname = cookieStore.get('tourist_nickname')?.value || userEmail?.split('@')[0] || '익명';
  
  if (!userEmail) {
    return { success: false, error: 'Unauthorized' };
  }

  if (rating < 1 || rating > 5) {
    return { success: false, error: 'Invalid rating' };
  }

  try {
    const { error } = await supabase.from('tour_reviews').insert({
      tour_id: tourId,
      user_email: userEmail,
      user_nickname: userNickname,
      rating,
      content
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Internal Server Error' };
  }
}

export async function deleteTourReview(reviewId: number, authorEmail: string) {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get('wave_session')?.value;

  if (!userEmail || (userEmail !== authorEmail && userEmail !== 'admin@admin.com')) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const { error } = await supabase.from('tour_reviews').delete().eq('id', reviewId);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Internal Server Error' };
  }
}
