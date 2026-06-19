'use client';

import { useTransition } from 'react';
import styles from './page.module.css';
import { createTour } from './actions';

export default function TourForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity()) {
      startTransition(() => {
        createTour(new FormData(form));
        form.reset(); // 성공 시 폼 초기화
      });
    } else {
      form.reportValidity();
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <label htmlFor="title">Tour Title</label>
        <input id="title" name="title" type="text" required placeholder="예: 광안리 요트 프라이빗 야경 투어" />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" required placeholder="투어에 대한 상세한 설명을 적어주세요." />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="price">Price (KRW)</label>
        <input id="price" name="price" type="number" required placeholder="예: 55000" />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="duration">Duration</label>
        <input id="duration" name="duration" type="text" required placeholder="예: 2 hours" />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="maxCapacity">Max Capacity</label>
        <input id="maxCapacity" name="maxCapacity" type="number" required placeholder="예: 8" />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="category">Category</label>
        <select id="category" name="category" required className={styles.select}>
          <option value="">카테고리를 선택하세요</option>
          <option value="Marine Cruise">Marine Cruise</option>
          <option value="Boutique Coffee">Boutique Coffee</option>
          <option value="Night Exploration">Night Exploration</option>
        </select>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="imageUrl">Thumbnail Image URL</label>
        <input id="imageUrl" name="imageUrl" type="url" required placeholder="https://example.com/image.jpg" />
      </div>
      
      <div className={styles.actions}>
        <button type="submit" disabled={isPending} className={styles.btnSubmit}>
          {isPending ? 'Registering...' : 'Register Tour'}
        </button>
      </div>
    </form>
  );
}
