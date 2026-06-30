import Link from 'next/link';
import styles from './page.module.css';
import { supabase } from '@/utils/supabase';
import { revalidatePath } from 'next/cache';

export const revalidate = 0;

// Mock data for initial rendering
const mockSales = 45000000; // 4,500만원
const OTHER_PLATFORM_FEE = 0.15; // 15%
const WAYVE_FEE = 0.03; // 3%
const savedAmount = mockSales * (OTHER_PLATFORM_FEE - WAYVE_FEE);

const mockSettlements = [
  {
    id: 'S-1001',
    productName: '프리미엄 요트 선셋 투어',
    status: 'waiting',
    amount: 850000,
    timeRemaining: '14:25:00',
    date: '2026-06-24'
  }
];

export default async function PartnerDashboard() {
  // Fetch pending bids
  let pendingBids: any[] = [];
  try {
    const { data } = await supabase
      .from('bidding_requests')
      .select('*, tours(title)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (data) pendingBids = data;
  } catch (err) {
    console.error('Error fetching bids:', err);
  }

  // Fetch total bids count
  let totalBidsCount = 0;
  try {
    const { count } = await supabase
      .from('bidding_requests')
      .select('*', { count: 'exact', head: true });
    
    totalBidsCount = count || 0;
  } catch (err) {
    console.error('Error fetching total bids:', err);
  }

  // Server Actions for Accept/Reject
  async function acceptBid(formData: FormData) {
    'use server';
    const bidId = formData.get('bidId') as string;
    const tourId = formData.get('tourId') as string;
    const bidDate = formData.get('bidDate') as string;
    const bidTime = formData.get('bidTime') as string;

    // 1. Accept this bid
    await supabase.from('bidding_requests').update({ status: 'accepted' }).eq('id', bidId);

    // 2. Reject all other pending bids for the same tour, date, and time (Transaction Lock simulation)
    await supabase.from('bidding_requests')
      .update({ status: 'rejected' })
      .eq('tour_id', tourId)
      .eq('bid_date', bidDate)
      .eq('bid_time', bidTime)
      .eq('status', 'pending');

    revalidatePath('/partner/dashboard');
  }

  async function rejectBid(formData: FormData) {
    'use server';
    const bidId = formData.get('bidId') as string;
    await supabase.from('bidding_requests').update({ status: 'rejected' }).eq('id', bidId);
    revalidatePath('/partner/dashboard');
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Partner Dashboard</h1>
            <p className={styles.subtitle}>웨이브와 함께 성장하는 파트너, 환영합니다.</p>
          </div>
        </div>

        <div className={styles.dashboardGrid}>
          {/* Incoming Bids Section */}
          <div className={`${styles.card} ${styles.bidsSection}`} style={{ gridColumn: '1 / -1' }}>
            <h3 className={styles.cardTitle}>새로운 입찰 제안 (Bidding Requests)</h3>
            {pendingBids.length === 0 ? (
              <p style={{color: '#888'}}>현재 대기 중인 입찰이 없습니다.</p>
            ) : (
              <div className={styles.bidsList}>
                {pendingBids.map(bid => (
                  <div key={bid.id} className={styles.bidItem}>
                    <div className={styles.bidInfo}>
                      <h4>{bid.tours?.title || '알 수 없는 투어'}</h4>
                      <p>일정: {bid.bid_date} | {bid.bid_time}</p>
                      <p>제시 가격: <strong style={{color: 'var(--accent)', fontSize: '1.2rem'}}>₩{bid.bid_price.toLocaleString()}</strong></p>
                    </div>
                    <div className={styles.bidActions}>
                      <form action={acceptBid} style={{display: 'inline'}}>
                        <input type="hidden" name="bidId" value={bid.id} />
                        <input type="hidden" name="tourId" value={bid.tour_id} />
                        <input type="hidden" name="bidDate" value={bid.bid_date} />
                        <input type="hidden" name="bidTime" value={bid.bid_time} />
                        <button type="submit" className={styles.acceptBtn}>수락 (Accept)</button>
                      </form>
                      <form action={rejectBid} style={{display: 'inline'}}>
                        <input type="hidden" name="bidId" value={bid.id} />
                        <button type="submit" className={styles.rejectBtn}>거절 (Reject)</button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={`${styles.card} ${styles.savingsCard}`}>
            <h3 className={styles.cardTitle}>타 플랫폼 대비 누적 절감 수수료</h3>
            <div className={styles.savingsAmount}>
              ₩{savedAmount.toLocaleString()}
            </div>
            <div className={styles.savingsDetail}>
              <span className={styles.badge}>Wayve 3%</span>
              <span>타사 평균 15% 대비 무려 12%를 절감하셨습니다!</span>
            </div>
          </div>

          <div className={`${styles.card} ${styles.statCard}`}>
            <h3 className={styles.cardTitle}>이번 달 총 매출</h3>
            <div className={styles.statValue}>₩{mockSales.toLocaleString()}</div>
          </div>

          <div className={`${styles.card} ${styles.statCard}`}>
            <h3 className={styles.cardTitle}>진행 중인 투어</h3>
            <div className={styles.statValue}>14건</div>
          </div>

          <div className={`${styles.card} ${styles.statCard}`}>
            <h3 className={styles.cardTitle}>누적 입찰 제안 건수</h3>
            <div className={styles.statValue} style={{ color: 'var(--accent)' }}>{totalBidsCount}건</div>
          </div>
        </div>
      </div>

      {/* Floating Add Product Button */}
      <Link href="/admin/tours/new" className={styles.floatingAddBtn}>
        <span>+</span> 상품 등록
      </Link>
    </main>
  );
}
