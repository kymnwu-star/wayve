'use server'

import { supabase } from '@/utils/supabase'

export async function createProduct(formData: FormData) {
  const title = formData.get('title') as string;
  const competitorUrl = formData.get('competitorUrl') as string;
  const competitorPrice = formData.get('competitorPrice') as string;
  const wayvePrice = formData.get('wayvePrice') as string;

  try {
    const { error } = await supabase.from('products').insert([{
      title,
      competitor_url: competitorUrl,
      competitor_price: parseInt(competitorPrice, 10),
      wayve_price: parseInt(wayvePrice, 10),
    }]);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Supabase API Error (Create Product):', error);
    return { success: false, error: '상품 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' };
  }
}
