import Image from 'next/image';
import Link from 'next/link';
import { cookies } from 'next/headers';
import styles from './page.module.css';

export default async function ShopPage() {
  const cookieStore = await cookies();
  const waveRole = cookieStore.get('wave_role')?.value;
  const isAdmin = waveRole === 'Admin';

  const dummyProducts = [
    {
      id: 1,
      title: '부산 웨이브 에디토리얼 매거진 Vol.1',
      price: '18,000',
      imageUrl: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=1200',
    },
    {
      id: 2,
      title: '미드나잇 로스터리 스페셜 블렌드 원두 200g',
      price: '24,000',
      imageUrl: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=1200',
    },
    {
      id: 3,
      title: '영도 깡깡이예술마을 엽서 & 포스터 세트',
      price: '12,000',
      imageUrl: 'https://images.unsplash.com/photo-1516008882583-0570b6d21e20?q=80&w=1200',
    }
  ];

  return (
    <main className={styles.main}>
      <h1 className={`${styles.pageTitle} text-accent neon-glow`}>WAYVE Shop</h1>
      <p className={styles.pageSubtitle}>부산의 로컬 바이브를 담은 굿즈와 큐레이션 상품</p>

      {isAdmin && (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button style={{
            background: 'var(--accent)',
            color: '#000',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '30px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            ➕ 관리자 전용: 새 상품 등록
          </button>
        </div>
      )}

      <div className={styles.grid}>
        {dummyProducts.map((product) => (
          <div key={product.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img 
                src={product.imageUrl} 
                alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{product.title}</h3>
              <div className={styles.cardFooter}>
                <span className={styles.price}>₩ {product.price}</span>
                <button className={styles.buyBtn}>구매하기</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
