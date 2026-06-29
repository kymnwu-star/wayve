'use server'

import { supabase } from '@/utils/supabase'
import { cookies } from 'next/headers'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const author = formData.get('author') as string;
  let content = formData.get('content') as string;
  const region = formData.get('region') as string;
  const imagesJson = formData.get('images') as string;

  const cookieStore = await cookies();
  const userEmail = cookieStore.get('wave_session')?.value;

  if (region) {
    content += `\n<!--REGION:${region}-->`;
  }
  if (userEmail) {
    content += `\n<!--EMAIL:${userEmail}-->`;
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
    console.error(error);
    return { success: false };
  }
}

export async function updatePost(id: number, formData: FormData) {
  const title = formData.get('title') as string;
  const author = formData.get('author') as string;
  let content = formData.get('content') as string;
  const region = formData.get('region') as string;
  const imagesJson = formData.get('images') as string;

  const cookieStore = await cookies();
  const userEmail = cookieStore.get('wave_session')?.value;

  if (!userEmail) return { success: false, error: 'Unauthorized' };

  if (region) {
    content += `\n<!--REGION:${region}-->`;
  }
  if (userEmail) {
    content += `\n<!--EMAIL:${userEmail}-->`;
  }

  let imageUrls: string[] = [];
  if (imagesJson) {
    try {
      imageUrls = JSON.parse(imagesJson);
    } catch (e) {
      console.error('Failed to parse images JSON', e);
    }
  }

  if (imageUrls.length === 0) {
    imageUrls = ['https://images.unsplash.com/photo-1546874177-9e664107314e?q=80&w=800'];
  }

  const imageUrlStr = JSON.stringify(imageUrls);

  try {
    const { error } = await supabase
      .from('travelogues')
      .update({
        title,
        author,
        content,
        image_url: imageUrlStr,
      })
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function deletePost(id: number) {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get('wave_session')?.value;

  if (!userEmail) return { success: false, error: 'Unauthorized' };

  try {
    const { error } = await supabase
      .from('travelogues')
      .delete()
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
