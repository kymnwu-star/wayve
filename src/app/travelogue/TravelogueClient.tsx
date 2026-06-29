'use client';

import { useState, useTransition, useEffect } from 'react';
import Image from 'next/image';
import { createPost, updatePost, deletePost, toggleLike, getComments, addComment, deleteComment } from './actions';
import { supabase } from '@/utils/supabase';
import styles from './page.module.css';

export default function TravelogueClient({ currentUserEmail, currentUserNickname }: { currentUserEmail: string | null, currentUserNickname: string | null }) {
  const [activeTab, setActiveTab] = useState<'부산' | '부산 외'>('부산');
  const [posts, setPosts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [isPending, startTransition] = useTransition();
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentsData, setCommentsData] = useState<Record<string, any[]>>({});
  const [commentInput, setCommentInput] = useState('');
  const MAX_IMAGES = 9;

  const toggleExpand = (id: string) => {
    setExpandedPosts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredPosts = posts.filter(post => post.region === activeTab);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase.from('travelogues').select('*').order('created_at', { ascending: false });
        if (data && !error) {
          const dbPosts = data.map((dbPost: any) => {
            let parsedImages = [];
            try {
              parsedImages = JSON.parse(dbPost.image_url);
            } catch (e) {
              parsedImages = [dbPost.image_url];
            }
            if (!Array.isArray(parsedImages) || parsedImages.length === 0) {
              parsedImages = ['https://images.unsplash.com/photo-1546874177-9e664107314e?q=80&w=800'];
            }

            let cleanContent = dbPost.content || '';
            let parsedRegion = '부산';
            let parsedEmail = '';

            if (cleanContent.includes('<!--REGION:')) {
              const match = cleanContent.match(/<!--REGION:(.*)-->/);
              if (match) {
                parsedRegion = match[1];
                cleanContent = cleanContent.replace(/<!--REGION:.*-->/, '').trim();
              }
            }

            if (cleanContent.includes('<!--EMAIL:')) {
              const match = cleanContent.match(/<!--EMAIL:(.*)-->/);
              if (match) {
                parsedEmail = match[1];
                cleanContent = cleanContent.replace(/<!--EMAIL:.*-->/, '').trim();
              }
            }

            return {
              id: dbPost.id,
              region: parsedRegion,
              authorEmail: parsedEmail,
              author: dbPost.author || 'Anonymous',
              title: dbPost.title || 'Untitled',
              avatarLetter: (dbPost.author || 'A').charAt(0).toUpperCase(),
              time: new Date(dbPost.created_at).toLocaleDateString(),
              imageUrl: parsedImages[0],
              imageUrls: parsedImages,
              content: cleanContent,
              likes: dbPost.likes_count || 0,
              comments: dbPost.comments_count || 0
            };
          });

          setPosts(dbPosts);

          if (currentUserEmail) {
            const { data: likesData } = await supabase.from('travelogue_likes').select('travelogue_id').eq('user_email', currentUserEmail);
            if (likesData) {
              const likesMap: Record<string, boolean> = {};
              likesData.forEach((l: any) => likesMap[l.travelogue_id] = true);
              setLikedPosts(likesMap);
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchPosts();
  }, [currentUserEmail]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (previewImages.length + files.length > MAX_IMAGES) {
      alert(`사진은 최대 ${MAX_IMAGES}장까지 첨부할 수 있습니다.`);
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height && width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          } else if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          setPreviewImages(prev => [...prev, compressedBase64]);
        };
      };
      reader.readAsDataURL(file);
    });
    
    // reset input
    e.target.value = '';
  };

  const removePreview = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleWriteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    formData.append('images', JSON.stringify(previewImages));

    startTransition(async () => {
      let res;
      if (editingPost) {
        res = await updatePost(editingPost.id, formData);
      } else {
        res = await createPost(formData);
      }

      if (res.success) {
        window.location.reload();
      } else {
        alert('저장에 실패했습니다.');
      }
    });
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setPreviewImages(post.imageUrls || []);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('정말로 이 글을 삭제하시겠습니까?')) {
      startTransition(async () => {
        const res = await deletePost(id);
        if (res.success) {
          setPosts(prev => prev.filter(p => p.id !== id));
        } else {
          alert('삭제 실패: ' + res.error);
        }
      });
    }
  };

  const handleLike = async (post: any) => {
    if (!currentUserEmail) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    const isLiked = likedPosts[post.id];
    setLikedPosts(prev => ({ ...prev, [post.id]: !isLiked }));
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes: p.likes + (isLiked ? -1 : 1) } : p));

    const res = await toggleLike(post.id);
    if (!res.success) {
      setLikedPosts(prev => ({ ...prev, [post.id]: isLiked }));
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes: p.likes + (isLiked ? 1 : -1) } : p));
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  const handleToggleComments = async (post: any) => {
    if (activeCommentPostId === post.id) {
      setActiveCommentPostId(null);
      return;
    }
    setActiveCommentPostId(post.id);
    if (!commentsData[post.id]) {
      const res = await getComments(post.id);
      if (res.success) {
        setCommentsData(prev => ({ ...prev, [post.id]: res.comments }));
      }
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!currentUserEmail) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!commentInput.trim()) return;

    const content = commentInput;
    setCommentInput('');

    const res = await addComment(postId, content);
    if (res.success) {
      const updatedComments = await getComments(postId);
      if (updatedComments.success) {
        setCommentsData(prev => ({ ...prev, [postId]: updatedComments.comments }));
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
      }
    } else {
      alert('댓글 등록에 실패했습니다.');
      setCommentInput(content);
    }
  };

  const handleCommentDelete = async (commentId: string, postId: string) => {
    if (confirm('댓글을 삭제하시겠습니까?')) {
      const res = await deleteComment(commentId, postId);
      if (res.success) {
        setCommentsData(prev => ({ ...prev, [postId]: prev[postId].filter(c => c.id !== commentId) }));
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments - 1 } : p));
      } else {
        alert('삭제 실패');
      }
    }
  };

  const openWriteModal = () => {
    setEditingPost(null);
    setPreviewImages([]);
    setIsModalOpen(true);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.headerArea}>
          <div>
            <h1 className={`${styles.title} text-accent neon-glow`}>Travelogue</h1>
            <p className={styles.subtitle}>멤버들의 은밀하고 특별한 여행 일상</p>
          </div>
          <button className={styles.writeButton} onClick={openWriteModal}>
            <span>✍️</span> 글쓰기
          </button>
        </div>

        <div className={styles.tabContainer}>
          <button 
            className={`${styles.tab} ${activeTab === '부산' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('부산')}
          >
            📍 부산 (Busan)
          </button>
          <button 
            className={`${styles.tab} ${activeTab === '부산 외' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('부산 외')}
          >
            ✈️ 부산 외 (Global)
          </button>
        </div>

        <div className={styles.feedContainer}>
          {filteredPosts.map(post => (
            <article key={post.id} className={styles.postCard}>
              <div className={styles.postHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className={styles.avatar}>{post.avatarLetter}</div>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{post.author}</span>
                    <span className={styles.postTime}>{post.time}</span>
                  </div>
                </div>
                {(currentUserEmail === post.authorEmail || currentUserEmail === 'admin@admin.com') && (
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.8rem' }}>
                    <button onClick={() => handleEdit(post)} style={{ background: 'transparent', color: '#aaa', border: 'none', cursor: 'pointer', fontSize: '0.9rem', padding: '0.2rem' }}>수정</button>
                    <button onClick={() => handleDelete(post.id)} style={{ background: 'transparent', color: '#ff5555', border: 'none', cursor: 'pointer', fontSize: '0.9rem', padding: '0.2rem' }}>삭제</button>
                  </div>
                )}
              </div>
              
              <div className={styles.postImageSlider}>
                {post.imageUrls.map((imgUrl: string, idx: number) => (
                  <div key={idx} className={styles.sliderItem}>
                    <Image 
                      src={imgUrl} 
                      alt={`${post.author}의 여행 사진 ${idx + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                  </div>
                ))}
              </div>

              <div 
                className={styles.postContent}
                onClick={() => toggleExpand(post.id)}
                style={{ cursor: 'pointer' }}
              >
                <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#fff' }}>{post.title}</strong>
                <p className={`${styles.textContent} ${expandedPosts[post.id] ? styles.expanded : styles.collapsed}`}>
                  {post.content}
                </p>
                {!expandedPosts[post.id] && (
                  <span style={{ color: '#888', fontSize: '0.85rem', display: 'block', marginTop: '0.5rem' }}>...더보기</span>
                )}
              </div>

              <div className={styles.postFooter}>
                <div className={styles.actionIcons}>
                  <button 
                    className={`${styles.iconBtn} ${likedPosts[post.id] ? styles.liked : ''}`} 
                    onClick={() => handleLike(post)}
                  >
                    {likedPosts[post.id] ? '❤️' : '🤍'} {post.likes}
                  </button>
                  <button 
                    className={styles.iconBtn}
                    onClick={() => handleToggleComments(post)}
                  >
                    💬 {post.comments}
                  </button>
                </div>
                <button className={styles.iconBtn}>🔗 공유</button>
              </div>

              {activeCommentPostId === post.id && (
                <div className={styles.commentSection}>
                  <div className={styles.commentList}>
                    {(commentsData[post.id] || []).map((comment: any) => (
                      <div key={comment.id} className={styles.commentItem}>
                        <div className={styles.commentHeader}>
                          <span className={styles.commentAuthor}>{comment.author_nickname}</span>
                          <span className={styles.commentTime}>{new Date(comment.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className={styles.commentBody}>{comment.content}</div>
                        {(currentUserEmail === comment.author_email || currentUserEmail === 'admin@admin.com') && (
                          <button 
                            onClick={() => handleCommentDelete(comment.id, post.id)} 
                            className={styles.commentDeleteBtn}
                          >
                            삭제
                          </button>
                        )}
                      </div>
                    ))}
                    {(commentsData[post.id] || []).length === 0 && (
                      <div style={{ color: '#888', fontSize: '0.9rem', padding: '1rem 0' }}>아직 댓글이 없습니다.</div>
                    )}
                  </div>
                  <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className={styles.commentForm}>
                    <input 
                      type="text" 
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="댓글 달기..." 
                      className={styles.commentInput}
                    />
                    <button type="submit" className={styles.commentSubmitBtn} disabled={!commentInput.trim() || isPending}>게시</button>
                  </form>
                </div>
              )}
            </article>
          ))}
          
          {filteredPosts.length === 0 && (
            <p style={{ color: '#888', padding: '2rem 0' }}>아직 등록된 게시물이 없습니다.</p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingPost ? '여행기 수정' : '새 여행기 작성'}</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <form className={styles.modalForm} onSubmit={handleWriteSubmit}>
              <div className={styles.inputGroup}>
                <label>사진 첨부 (최대 9장)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleFileChange} 
                  className={styles.fileInput}
                  disabled={previewImages.length >= MAX_IMAGES}
                />
                
                {previewImages.length > 0 && (
                  <div className={styles.imagePreviewGrid}>
                    {previewImages.map((imgSrc, idx) => (
                      <div key={idx} className={styles.previewItem}>
                        <Image src={imgSrc} alt={`preview ${idx}`} fill style={{ objectFit: 'cover' }} />
                        <button type="button" className={styles.removeImgBtn} onClick={() => removePreview(idx)}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="title">제목</label>
                <input id="title" name="title" type="text" className={styles.modalInput} required placeholder="기억에 남는 순간을 한 줄로 표현해주세요" defaultValue={editingPost?.title || ''} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="content">내용</label>
                <textarea id="content" name="content" className={styles.modalTextarea} rows={5} required placeholder="투어에서 경험한 날것의 감정을 자유롭게 공유해주세요." defaultValue={editingPost?.content || ''}></textarea>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="author">작성자 (닉네임)</label>
                <input 
                  id="author" 
                  name="author" 
                  type="text" 
                  className={styles.modalInput} 
                  required 
                  placeholder="예: 로컬탐험가" 
                  defaultValue={editingPost?.author || currentUserNickname || ''} 
                  readOnly={!!currentUserNickname}
                  style={currentUserNickname ? { backgroundColor: '#333', color: '#999', cursor: 'not-allowed' } : {}}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="region">지역</label>
                <select id="region" name="region" className={styles.modalInput} defaultValue={editingPost?.region || activeTab}>
                  <option value="부산">📍 부산 (Busan)</option>
                  <option value="부산 외">✈️ 부산 외 (Global)</option>
                </select>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={isPending}>
                {isPending ? '저장 중...' : editingPost ? '수정하기' : '공유하기'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
