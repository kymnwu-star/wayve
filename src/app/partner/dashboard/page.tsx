import Link from 'next/link';
import styles from './page.module.css';

// Mock data for initial rendering (To be replaced with Supabase)
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
  },
  {
    id: 'S-1002',
    productName: '해운대 로컬 미식 투어',
    status: 'suspended',
    amount: 120000,
    timeRemaining: 'Suspended (Refund Requested)',
    date: '2026-06-23'
  },
  {
    id: 'S-1003',
    productName: '기장 서핑 마스터 클래스',
    status: 'completed',
    amount: 2100000,
    timeRemaining: '정산 완료',
    date: '2026-06-21'
  }
];

export default function PartnerDashboard() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Partner Dashboard</h1>
            <p className={styles.subtitle}>웨이브와 함께 성장하는 파트너, 환영합니다.</p>
          </div>
          <Link href="/partner/products/new" className={styles.addProductBtn}>
            + 새 상품 등록
          </Link>
        </div>

        <div className={styles.dashboardGrid}>
          {/* 상생 지표 (절감액) */}
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

          {/* 정산 타임라인 */}
          <div className={`${styles.card} ${styles.settlementSection}`}>
            <h3 className={styles.cardTitle}>초고속 48시간 정산 현황</h3>
            <div className={styles.timelineList}>
              {mockSettlements.map((item) => (
                <div key={item.id} className={`${styles.timelineItem} ${styles[item.status]}`}>
                  <div className={styles.itemInfo}>
                    <h4>{item.productName}</h4>
                    <p>예약 번호: {item.id} | 투어 일자: {item.date}</p>
                  </div>
                  <div className={styles.itemStatus}>
                    <span className={styles.amount}>₩{item.amount.toLocaleString()}</span>
                    <span className={`${styles.timer} ${styles[item.status]}`}>
                      {item.timeRemaining}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
