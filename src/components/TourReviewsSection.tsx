'use client';

import { useState, useEffect, useTransition } from 'react';
import { getTourReviews, addTourReview, deleteTourReview } from '@/app/tours/detail/[id]/actions';
import styles from './TourReviewsSection.module.css';

export default function TourReviewsSection({ tourId, currentUserEmail }: { tourId: string, currentUserEmail: string | null }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function fetchReviews() {
      const res = await getTourReviews(tourId);
      if (res.success) {
        setReviews(res.reviews);
      }
      setLoading(false);
    }
    fetchReviews();
  }, [tourId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserEmail) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!content.trim()) return;

    startTransition(async () => {
      const res = await addTourReview(tourId, rating, content);
      if (res.success) {
        setContent('');
        setRating(5);
        // Refresh reviews
        const refreshRes = await getTourReviews(tourId);
        if (refreshRes.success) setReviews(refreshRes.reviews);
      } else {
        alert('후기 등록에 실패했습니다.');
      }
    });
  };

  const handleDelete = async (id: number, authorEmail: string) => {
    if (confirm('후기를 삭제하시겠습니까?')) {
      startTransition(async () => {
        const res = await deleteTourReview(id, authorEmail);
        if (res.success) {
          setReviews(prev => prev.filter(r => r.id !== id));
        } else {
          alert('삭제 실패');
        }
      });
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>⭐ 투어 후기 <span className={styles.average}>({averageRating})</span></h3>
      
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.starRating}>
            {[1, 2, 3, 4, 5].map(star => (
              <button 
                key={star} 
                type="button" 
                onClick={() => setRating(star)}
                className={`${styles.star} ${rating >= star ? styles.starActive : ''}`}
              >
                ★
              </button>
            ))}
          </div>
          <div className={styles.inputGroup}>
            <input 
              type="text" 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              placeholder="투어에 대한 솔직한 후기를 남겨주세요." 
              className={styles.input}
            />
            <button type="submit" disabled={isPending || !content.trim()} className={styles.submitBtn}>등록</button>
          </div>
        </form>
      </div>

      <div className={styles.list}>
        {loading ? (
          <p style={{ color: '#888' }}>로딩 중...</p>
        ) : reviews.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '1rem 0' }}>아직 등록된 후기가 없습니다.</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <div className={styles.authorInfo}>
                  <span className={styles.author}>{review.user_nickname}</span>
                  <span className={styles.stars}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                </div>
                <span className={styles.time}>{new Date(review.created_at).toLocaleDateString()}</span>
              </div>
              <div className={styles.content}>{review.content}</div>
              
              {(currentUserEmail === review.user_email || currentUserEmail === 'admin@admin.com') && (
                <button onClick={() => handleDelete(review.id, review.user_email)} className={styles.deleteBtn}>삭제</button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
