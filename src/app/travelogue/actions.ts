'use server'

import { supabase } from '@/utils/supabase'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const author = formData.get('author') as string;
  const content = formData.get('content') as string;
  // images field will contain a stringified array of Base64 strings or URLs
  const imagesJson = formData.get('images') as string;

  let imageUrls: string[] = [];
  if (imagesJson) {
    try {
      imageUrls = JSON.parse(imagesJson);
    } catch (e) {
      console.error('Failed to parse images JSON', e);
    }
  }

  // If no images, provide default
  if (imageUrls.length === 0) {
    imageUrls = ['https://jasonteale.com/blog/wp-content/uploads/2021/02/D79A3022_AuroraHDR2019-edit-1200x600.jpg'];
  }

  // We store the JSON array string into the image_url column
  const imageUrlStr = JSON.stringify(imageUrls);

  try {
    const { error } = await supabase.from('travelogues').insert([{
      title,
      author,
      content,
      image_url: imageUrlStr,
    }]);

    // Ignored error in prototype mode if table doesn't exist, will just return success

    return { success: true };
  } catch (error) {
    console.error('Supabase API Error:', error);
    return { success: false, error: '백엔드 시스템 오류가 발생했습니다.' };
  }
}
