'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './BiddingSection.module.css';
import { submitBid } from './biddingActions';

interface Props {
  tourId: string | number;
  originalPrice: number;
}

export default function BiddingSection({ tourId, originalPrice }: Props) {
  const router = useRouter();
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00');
  const [bidPrice, setBidPrice] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState(false);

  // 하한선: 정가의 70%
  const minimumPrice = Math.floor(originalPrice * 0.7);
  const isBelowFloor = bidPrice !== '' && bidPrice < minimumPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBelowFloor) return;
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append('tourId', tourId.toString());
    formData.append('date', date);
    formData.append('timeSlot', timeSlot);
    formData.append('bidPrice', bidPrice.toString());

    const result = await submitBid(formData);
    setIsLoading(false);

    if (result.success) {
      alert('입찰 신청이 완료되었습니다! 마이페이지에서 상태를 확인하세요.');
      router.push('/mypage/bids');
    } else {
      alert(result.message);
    }
  };

  return (
    <form className={styles.biddingForm} onSubmit={handleSubmit}>
      <div>
        <h3 className={styles.title}>원하는 가격으로 입찰하기</h3>
        <p className={styles.desc}>판매자가 수락하면 예약이 확정됩니다. (최소 입찰가: {minimumPrice.toLocaleString()}원)</p>
      </div>

      <div className={styles.inputGroup}>
        <label>이용 날짜</label>
        <div className={styles.calendarWrapper}>
          <input 
            type="date" 
            id="biddingDate"
            className={styles.hiddenDateInput}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            min={new Date().toISOString().split('T')[0]}
          />
          <button 
            type="button" 
            className={styles.calendarBtn}
            onClick={() => {
              const input = document.getElementById('biddingDate');
              if (input && 'showPicker' in input) {
                (input as any).showPicker();
              } else {
                input?.focus();
              }
            }}
          >
            📅 달력에서 날짜 선택하기 {date ? `[ ${date} ]` : ''}
          </button>
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label>이용 시간 (회차)</label>
        <select 
          className={styles.select}
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
          required
        >
          <option value="10:00">오전 10:00</option>
          <option value="14:00">오후 2:00</option>
          <option value="18:00">오후 6:00</option>
          <option value="20:00">오후 8:00 (심야)</option>
        </select>
      </div>

      <div className={styles.inputGroup}>
        <label>희망 입찰가 (원)</label>
        <input 
          type="number" 
          className={styles.input}
          placeholder={`최소 ${minimumPrice.toLocaleString()}원 이상 입력`}
          value={bidPrice}
          onChange={(e) => setBidPrice(parseInt(e.target.value, 10) || '')}
          required
        />
        {isBelowFloor && (
          <span className={styles.floorWarning}>
            ⚠️ 하한선({minimumPrice.toLocaleString()}원) 이상으로 입력해주세요.
          </span>
        )}
      </div>

      <button 
        type="submit" 
        className={styles.submitBtn}
        disabled={isLoading || isBelowFloor || !date || !bidPrice}
      >
        {isLoading ? '신청 중...' : '입찰 신청하기 (가결제)'}
      </button>
    </form>
  );
}
