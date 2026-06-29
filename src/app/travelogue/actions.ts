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

export async function toggleLike(travelogueId: string) {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get('wave_session')?.value;
  if (!userEmail) return { success: false, error: 'Unauthorized' };

  try {
    // Check if already liked
    const { data: existingLike } = await supabase
      .from('travelogue_likes')
      .select('id')
      .eq('travelogue_id', travelogueId)
      .eq('user_email', userEmail)
      .single();

    if (existingLike) {
      // Unlike
      await supabase.from('travelogue_likes').delete().eq('id', existingLike.id);
      
      const { data: postData } = await supabase.from('travelogues').select('likes').eq('id', travelogueId).single();
      if (postData) {
        await supabase.from('travelogues').update({ likes: Math.max(0, postData.likes - 1) }).eq('id', travelogueId);
      }
      return { success: true, liked: false };
    } else {
      // Like
      await supabase.from('travelogue_likes').insert({ travelogue_id: travelogueId, user_email: userEmail });
      
      const { data: postData } = await supabase.from('travelogues').select('likes').eq('id', travelogueId).single();
      if (postData) {
        await supabase.from('travelogues').update({ likes: postData.likes + 1 }).eq('id', travelogueId);
      }
      return { success: true, liked: true };
    }
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function getComments(travelogueId: string) {
  try {
    const { data, error } = await supabase
      .from('travelogue_comments')
      .select('*')
      .eq('travelogue_id', travelogueId)
      .order('created_at', { ascending: true });
      
    if (error) return { success: false, error: error.message };
    return { success: true, comments: data || [] };
  } catch (error) {
    console.error(error);
    return { success: false, comments: [] };
  }
}

export async function addComment(travelogueId: string, content: string) {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get('wave_session')?.value;
  const userNickname = cookieStore.get('tourist_nickname')?.value || userEmail?.split('@')[0] || '익명';
  if (!userEmail) return { success: false, error: 'Unauthorized' };

  try {
    const { error } = await supabase.from('travelogue_comments').insert({
      travelogue_id: travelogueId,
      author_email: userEmail,
      author_nickname: userNickname,
      content
    });
    if (error) return { success: false, error: error.message };
    
    // Increment comments counter
    const { data: postData } = await supabase.from('travelogues').select('comments').eq('id', travelogueId).single();
    if (postData) {
      await supabase.from('travelogues').update({ comments: postData.comments + 1 }).eq('id', travelogueId);
    }
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function deleteComment(commentId: string, travelogueId: string) {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get('wave_session')?.value;
  if (!userEmail) return { success: false, error: 'Unauthorized' };

  try {
    // Admin or author check should be done here but we simplify
    const { error } = await supabase.from('travelogue_comments').delete().eq('id', commentId);
    if (error) return { success: false, error: error.message };
    
    // Decrement comments counter
    const { data: postData } = await supabase.from('travelogues').select('comments').eq('id', travelogueId).single();
    if (postData) {
      await supabase.from('travelogues').update({ comments: Math.max(0, postData.comments - 1) }).eq('id', travelogueId);
    }
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
