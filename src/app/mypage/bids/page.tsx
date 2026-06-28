import styles from './page.module.css';
import { supabase } from '@/utils/supabase';

export const revalidate = 0;

export default async function MyBidsPage() {
  const userId = 'user_dummy_123';

  // Fetch user's bids
  let myBids: any[] = [];
  try {
    const { data } = await supabase
      .from('bidding_requests')
      .select('*, tours(title)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (data) {
      // Lazy Update for Expiration (TTL: 24 hours)
      const now = new Date();
      const updates = [];

      for (const bid of data) {
        if (bid.status === 'pending') {
          const createdAt = new Date(bid.created_at);
          const diffHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
          
          if (diffHours >= 24) {
            bid.status = 'expired';
            updates.push(supabase.from('bidding_requests').update({ status: 'expired' }).eq('id', bid.id));
          }
        }
      }

      // Execute lazy updates in background
      if (updates.length > 0) {
        Promise.all(updates).catch(console.error);
      }

      myBids = data;
    }
  } catch (err) {
    console.error('Error fetching my bids:', err);
  }

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'pending': return '수락 대기중';
      case 'accepted': return '예약 확정 (결제됨)';
      case 'rejected': return '판매자 거절 (환불됨)';
      case 'expired': return '시간 만료 (자동 환불)';
      default: return status;
    }
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>내 입찰 현황</h1>
      <p className={styles.subtitle}>제안하신 입찰 내역과 결과를 확인하세요.</p>

      <div className={styles.bidsList}>
        {myBids.length === 0 ? (
          <p style={{color: '#888'}}>아직 입찰한 내역이 없습니다. 투어를 둘러보고 나만의 가격을 제안해 보세요!</p>
        ) : (
          myBids.map(bid => (
            <div key={bid.id} className={styles.bidCard}>
              <div>
                <h3 className={styles.tourTitle}>{bid.tours?.title || '알 수 없는 투어'}</h3>
                <div className={styles.bidDetails}>
                  <span>일정: {bid.bid_date} | {bid.bid_time}</span>
                </div>
                <div className={styles.bidPrice}>
                  제시 가격: ₩{bid.bid_price.toLocaleString()}
                </div>
              </div>
              <div className={styles[`badge_${bid.status}`] || styles.badge_pending}>
                {getStatusLabel(bid.status)}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
