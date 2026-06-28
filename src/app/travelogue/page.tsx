'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { createPost } from './actions';
import styles from './page.module.css';

// Mock Data for 5 posts
const initialMockPosts = [
  {
    id: 1,
    region: '부산',
    author: 'Jihoon.K',
    title: '영도의 날것',
    avatarLetter: 'J',
    time: '2 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1546874177-9e664107314e?q=80&w=800',
    content: '영도 해녀촌에서 바라본 남항대교 야경. 언제 와도 영도의 밤은 거칠지만 매력적이다. 다음번엔 심야 투어에도 참여해봐야지. 🌙',
    likes: 42,
    comments: 5
  },
  {
    id: 2,
    region: '부산',
    author: 'Sarah Traveler',
    title: '광안리 요트 크루징',
    avatarLetter: 'S',
    time: '5 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1580214371493-277ba5bbda32?q=80&w=800',
    content: '광안리 선셋 요트 크루징... 와인 한 잔과 함께 듣는 어쿠스틱 라이브가 최고였다. Wayve 프리미엄 투어 강추합니다! 🍷🛥️',
    likes: 128,
    comments: 12
  },
  {
    id: 3,
    region: '부산',
    author: '로컬탐험가',
    title: '전포동 커피 마스터',
    avatarLetter: '로',
    time: '1 day ago',
    imageUrl: 'https://images.unsplash.com/photo-1603525281488-8422731cde7e?q=80&w=800',
    content: '전포동 뒷골목 로컬 브루어리에서 바리스타님과 깊은 대화. 유명한 프랜차이즈에서는 절대 느낄 수 없는 깊은 맛이었다. ☕',
    likes: 85,
    comments: 3
  },
  {
    id: 4,
    region: '부산 외',
    author: '마이크',
    title: '두바이 사막 투어',
    avatarLetter: 'M',
    time: '2 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800',
    content: '두바이 사막 한가운데서 즐긴 에디토리얼 투어. 부산의 바다와는 또 다른 압도적인 느낌이었다. 다음 여행지는 어디로 할까?',
    likes: 256,
    comments: 45
  },
  {
    id: 5,
    region: '부산 외',
    author: 'Tokyo Drifter',
    title: '도쿄의 심야 식당',
    avatarLetter: 'T',
    time: '3 days ago',
    imageUrl: ['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800'],
    content: '도쿄 밤거리의 네온사인 아래. Wayve에서 추천해준 프라이빗 이자카야는 정말 신의 한 수였다. 관광객은 나 혼자뿐이었음! 🍣🏮',
    likes: 194,
    comments: 21
  }
];

export default function TraveloguePage() {
  const [activeTab, setActiveTab] = useState<'부산' | '부산 외'>('부산');
  const [posts, setPosts] = useState(initialMockPosts.map(p => ({...p, imageUrls: Array.isArray(p.imageUrl) ? p.imageUrl : [p.imageUrl]})));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const MAX_IMAGES = 9;

  const filteredPosts = posts.filter(post => post.region === activeTab);

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
    
    // Add images JSON to formData
    formData.append('images', JSON.stringify(previewImages));

    startTransition(async () => {
      const res = await createPost(formData);
      if (res.success) {
        let finalImages = previewImages;
        if (finalImages.length === 0) {
          finalImages = [
            formData.get('region') === '부산' 
              ? 'https://images.unsplash.com/photo-1546874177-9e664107314e?q=80&w=800'
              : 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800'
          ];
        }

        const newPost = {
          id: Date.now(),
          region: formData.get('region') as string,
          author: formData.get('author') as string,
          title: formData.get('title') as string,
          avatarLetter: (formData.get('author') as string).charAt(0).toUpperCase(),
          time: 'Just now',
          imageUrl: finalImages[0], // Add for TS compatibility
          imageUrls: finalImages,
          content: formData.get('content') as string,
          likes: 0,
          comments: 0
        };
        
        setPosts([newPost, ...posts]);
        setIsModalOpen(false);
        setPreviewImages([]);
      } else {
        alert(res.error || '저장 중 오류가 발생했습니다.');
      }
    });
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.headerArea}>
          <div>
            <h1 className={`${styles.title} text-accent neon-glow`}>Travelogue</h1>
            <p className={styles.subtitle}>멤버들의 은밀하고 특별한 여행 일상</p>
          </div>
          <button className={styles.writeButton} onClick={() => setIsModalOpen(true)}>
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
                <div className={styles.avatar}>{post.avatarLetter}</div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{post.author}</span>
                  <span className={styles.postTime}>{post.time}</span>
                </div>
              </div>
              
              <div className={styles.postImageGrid} data-count={post.imageUrls.length > 4 ? 'more' : post.imageUrls.length}>
                {post.imageUrls.slice(0, 4).map((imgUrl: string, idx: number) => (
                  <div key={idx} style={{ position: 'relative', width: '100%', height: '100%', minHeight: '150px' }}>
                    <Image 
                      src={imgUrl} 
                      alt={`${post.author}의 여행 사진 ${idx + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 85vw, 350px"
                    />
                    {idx === 3 && post.imageUrls.length > 4 && (
                      <div className={styles.moreImagesOverlay}>
                        +{post.imageUrls.length - 4}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className={styles.postContent}>
                <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#fff' }}>{post.title}</strong>
                {post.content}
              </div>

              <div className={styles.postFooter}>
                <div className={styles.actionIcons}>
                  <button className={styles.iconBtn}>🤍 {post.likes}</button>
                  <button className={styles.iconBtn}>💬 {post.comments}</button>
                </div>
                <button className={styles.iconBtn}>🔗 공유</button>
              </div>
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
              <h2>새 여행기 작성</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <form className={styles.modalForm} onSubmit={handleWriteSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="region">지역구분</label>
                <select id="region" name="region" className={styles.modalSelect} required defaultValue={activeTab}>
                  <option value="부산">📍 부산 (Busan)</option>
                  <option value="부산 외">✈️ 부산 외 (Global)</option>
                </select>
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="title">제목</label>
                <input id="title" name="title" type="text" className={styles.modalInput} required placeholder="기억에 남는 순간을 요약해주세요" />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="author">작성자 (닉네임)</label>
                <input id="author" name="author" type="text" className={styles.modalInput} required placeholder="예: 로컬탐험가" />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="content">내용</label>
                <textarea id="content" name="content" className={styles.modalTextarea} required placeholder="어떤 은밀하고 특별한 경험을 하셨나요?" />
              </div>

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

              <button type="submit" className={styles.submitBtn} disabled={isPending}>
                {isPending ? '저장 중...' : '공유하기'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
