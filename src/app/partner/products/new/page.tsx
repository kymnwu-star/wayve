'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct } from './actions';
import styles from './page.module.css';

export default function NewProductPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const [title, setTitle] = useState('');
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [competitorPrice, setCompetitorPrice] = useState<number | ''>('');
  const [wayvePrice, setWayvePrice] = useState<number | ''>('');
  
  const [error, setError] = useState('');

  const OTHER_FEE_RATE = 0.15; // 15%
  const WAYVE_FEE_RATE = 0.03; // 3%

  // 93% 계산 (최대 허용가)
  const maxAllowedPrice = typeof competitorPrice === 'number' && competitorPrice > 0 
    ? Math.floor(competitorPrice * 0.93)
    : 0;

  const handleWayvePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
      setWayvePrice('');
      setError('');
      return;
    }
    
    if (val < 0) {
      setWayvePrice(0);
      return;
    }

    setWayvePrice(val);

    if (maxAllowedPrice > 0 && val > maxAllowedPrice) {
      setError(`WAYVE 판매가는 타사 가격의 93%(${maxAllowedPrice.toLocaleString()}원) 이하로만 설정 가능합니다.`);
    } else {
      setError('');
    }
  };

  const handleCompetitorPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 0) {
      setCompetitorPrice('');
      return;
    }
    setCompetitorPrice(val);
    
    // 타사 가격이 변경되었을 때 기존 wayve 가격이 조건을 위반하는지 체크
    const newMax = Math.floor(val * 0.93);
    if (typeof wayvePrice === 'number' && wayvePrice > newMax) {
      setError(`WAYVE 판매가는 타사 가격의 93%(${newMax.toLocaleString()}원) 이하로만 설정 가능합니다.`);
    } else {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typeof competitorPrice !== 'number' || competitorPrice <= 0) {
      setError('타사 판매가를 정확히 입력해 주세요.');
      return;
    }
    if (typeof wayvePrice !== 'number' || wayvePrice <= 0) {
      setError('WAYVE 판매가를 정확히 입력해 주세요.');
      return;
    }
    if (wayvePrice > maxAllowedPrice) {
      setError(`WAYVE 판매가는 ${maxAllowedPrice.toLocaleString()}원을 초과할 수 없습니다.`);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('competitorUrl', competitorUrl);
    formData.append('competitorPrice', competitorPrice.toString());
    formData.append('wayvePrice', wayvePrice.toString());

    startTransition(async () => {
      const result = await createProduct(formData);
      if (result.success) {
        alert('✅ 상품이 성공적으로 구글 시트에 등록되었습니다!');
        router.push('/partner/dashboard');
      } else {
        alert(result.error);
      }
    });
  };

  // 시뮬레이션 계산
  const compPriceNum = typeof competitorPrice === 'number' ? competitorPrice : 0;
  const wayvePriceNum = typeof wayvePrice === 'number' ? wayvePrice : 0;

  const compFee = compPriceNum * OTHER_FEE_RATE;
  const compProfit = compPriceNum - compFee;

  const wayveFee = wayvePriceNum * WAYVE_FEE_RATE;
  const wayveProfit = wayvePriceNum - wayveFee;

  const extraProfit = wayveProfit - compProfit;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={`${styles.title} text-accent neon-glow`}>새 상품 등록</h1>
          <p className={styles.subtitle}>최저가 검증 시스템을 통해 완벽한 상품을 등록하세요.</p>
        </div>

        <div className={styles.grid}>
          {/* 입력 폼 */}
          <div className={styles.formCard}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  상품명 <span className={styles.required}>*</span>
                </label>
                <input 
                  type="text" 
                  className={styles.input} 
                  required
                  placeholder="예: 해운대 럭셔리 요트 투어"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  타사 판매 링크 (URL) <span className={styles.required}>*</span>
                </label>
                <input 
                  type="url" 
                  className={styles.input} 
                  required
                  placeholder="예: https://www.myrealtrip.com/..."
                  value={competitorUrl}
                  onChange={e => setCompetitorUrl(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  타사 판매가 (원) <span className={styles.required}>*</span>
                </label>
                <input 
                  type="number" 
                  className={styles.input} 
                  required
                  min="0"
                  placeholder="숫자만 입력해 주세요"
                  value={competitorPrice}
                  onChange={handleCompetitorPriceChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  WAYVE 판매가 (원) <span className={styles.required}>*</span>
                </label>
                <input 
                  type="number" 
                  className={`${styles.input} ${error ? styles.inputError : ''}`} 
                  required
                  min="0"
                  max={maxAllowedPrice > 0 ? maxAllowedPrice : undefined}
                  placeholder="타사 가격의 93% 이하로 입력"
                  value={wayvePrice}
                  onChange={handleWayvePriceChange}
                />
                {error && <p className={styles.errorMessage}>{error}</p>}
                {!error && maxAllowedPrice > 0 && (
                  <p className={styles.infoMessage}>
                    최대 허용 가격: ₩{maxAllowedPrice.toLocaleString()} (타사가 대비 -7%)
                  </p>
                )}
              </div>

              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={!!error || !wayvePrice || !competitorPrice}
              >
                검증 완료 및 등록하기
              </button>
            </form>
          </div>

          {/* 마진 시뮬레이터 */}
          <div className={styles.simulatorCard}>
            <h3 className={styles.simTitle}>💡 실시간 마진 시뮬레이터</h3>
            
            <div className={styles.simRow}>
              <span className={styles.simLabel}>타사 입점 시 실수익 (수수료 15%)</span>
              <span className={styles.simValue}>₩{compProfit.toLocaleString()}</span>
            </div>
            
            <div className={styles.simRow}>
              <span className={styles.simLabel}>WAYVE 입점 시 실수익 (수수료 3%)</span>
              <span className={styles.simValue}>₩{wayveProfit.toLocaleString()}</span>
            </div>

            <div className={styles.simResultBox}>
              <span className={styles.simResultTitle}>고객에게 7% 싸게 팔아도</span>
              <span className={`${styles.simResultAmount} ${extraProfit < 0 ? styles.negative : ''}`}>
                {extraProfit > 0 ? '+' : ''}₩{extraProfit.toLocaleString()}
              </span>
              <span style={{ display: 'block', fontSize: '0.9rem', color: 'white', marginTop: '0.5rem' }}>
                추가 마진이 남습니다!
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
