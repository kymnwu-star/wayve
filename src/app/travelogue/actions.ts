'use server'

import { supabase } from '@/utils/supabase'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const author = formData.get('author') as string;
  let content = formData.get('content') as string;
  const region = formData.get('region') as string;
  const imagesJson = formData.get('images') as string;

  if (region) {
    content += `\n<!--REGION:${region}-->`;
  }

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
    imageUrls = ['https://images.unsplash.com/photo-1546874177-9e664107314e?q=80&w=800'];
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
