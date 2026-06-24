'use server'

import { supabase } from '@/utils/supabase'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const author = formData.get('author') as string;
  const content = formData.get('content') as string;
  const image = formData.get('image') as File | null;

  let imageUrl = '';
  // (임시처리) 파일 업로드 구현 전까지는 더미 이미지 URL 사용
  if (image && image.size > 0) {
    imageUrl = 'https://jasonteale.com/blog/wp-content/uploads/2021/02/D79A3022_AuroraHDR2019-edit-1200x600.jpg';
  }

  try {
    const { error } = await supabase.from('travelogues').insert([{
      title,
      author,
      content,
      image_url: imageUrl,
    }]);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Supabase API Error:', error);
    return { success: false, error: '백엔드 시스템 오류가 발생했습니다.' };
  }
}
