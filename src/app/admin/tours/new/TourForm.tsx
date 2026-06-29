'use client';

import { useTransition, useState, useRef } from 'react';
import styles from './page.module.css';
import { createTour } from './actions';
import { analyzeImage, analyzeImageFile } from './ai-actions';

export default function TourForm() {
  const [isPending, startTransition] = useTransition();
  const [isAILoading, setIsAILoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price_10: '',
    price_14: '',
    price_18: '',
    price_20: '',
    duration: '',
    maxCapacity: '',
    category: '',
    imageUrl: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAIAutoFill = async () => {
    if (!formData.imageUrl && !selectedFile) {
      alert('AI 솔루션을 사용하려면 이미지 URL을 입력하거나 사진 파일을 업로드해주세요!');
      return;
    }

    setIsAILoading(true);
    
    try {
      let result;
      if (selectedFile) {
        // 이미지 압축 (Canvas 이용)
        result = await new Promise((resolve, reject) => {
          const img = new window.Image();
          const reader = new FileReader();
          
          reader.onload = (e) => {
            img.src = e.target?.result as string;
          };
          reader.onerror = reject;
          
          img.onload = async () => {
            try {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 1024;
              const MAX_HEIGHT = 1024;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0, width, height);
              
              // JPEG 80% 품질로 압축
              const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
              const split = dataUrl.split(',');
              const base64Data = split[1];
              const mimeType = 'image/jpeg';
              
              const res = await analyzeImageFile(base64Data, mimeType);
              resolve(res);
            } catch (err) {
              reject(err);
            }
          };
          
          reader.readAsDataURL(selectedFile);
        });
      } else {
        result = await analyzeImage(formData.imageUrl);
      }
      
      const parsedResult = result as any;

      if (parsedResult.success && parsedResult.data) {
        setFormData(prev => ({
          ...prev,
          title: parsedResult.data.title || prev.title,
          description: parsedResult.data.description || prev.description,
          price_10: parsedResult.data.price_10 || prev.price_10,
          price_14: parsedResult.data.price_14 || prev.price_14,
          price_18: parsedResult.data.price_18 || prev.price_18,
          price_20: parsedResult.data.price_20 || prev.price_20,
          duration: parsedResult.data.duration || prev.duration,
          maxCapacity: parsedResult.data.maxCapacity || prev.maxCapacity,
          category: parsedResult.data.category || prev.category
        }));
      } else {
        alert(parsedResult.error || 'AI 분석에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      alert('AI 분석 중 오류가 발생했습니다. 사진 용량이 너무 크거나 네트워크 문제일 수 있습니다.');
    } finally {
      setIsAILoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity()) {
      startTransition(() => {
        createTour(new FormData(form));
        setFormData({ title: '', description: '', price_10: '', price_14: '', price_18: '', price_20: '', duration: '', maxCapacity: '', category: '', imageUrl: '' });
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      });
    } else {
      form.reportValidity();
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputGroup} style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>✨ AI 자동완성 (사진 첨부)</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem', display: 'block' }}>1. 내 컴퓨터에서 사진 파일 직접 선택</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ width: '100%', padding: '0.5rem', border: '1px dashed #555', borderRadius: '6px' }}
            />
          </div>
          
          <div style={{ textAlign: 'center', color: '#666', fontSize: '0.8rem' }}>OR</div>
          
          <div>
            <label style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem', display: 'block' }}>2. 이미지 URL 복사해서 붙여넣기</label>
            <input 
              id="imageUrl" 
              name="imageUrl" 
              type="url" 
              placeholder="https://example.com/image.jpg"
              value={formData.imageUrl}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--surface-border)', borderRadius: '6px', backgroundColor: 'var(--surface)' }}
            />
          </div>
        </div>

        <button 
          type="button" 
          onClick={handleAIAutoFill} 
          disabled={isAILoading}
          style={{ 
            width: '100%',
            padding: '1rem', 
            backgroundColor: 'var(--accent)', 
            color: '#000', 
            border: 'none', 
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            transition: 'opacity 0.2s'
          }}
        >
          {isAILoading ? 'AI가 사진을 분석하는 중입니다...' : '선택한 사진으로 AI 자동완성 시작하기'}
        </button>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="title">Tour Title</label>
        <input id="title" name="title" type="text" required placeholder="예: 광안리 요트 프라이빗 야경 투어" value={formData.title} onChange={handleChange} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" required placeholder="투어에 대한 상세한 설명을 적어주세요." value={formData.description} onChange={handleChange} />
      </div>

      <div className={styles.inputGroup}>
        <label>기준 가격 (KRW) - 시간대별 설정</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{fontSize: '0.8rem', color: '#ccc'}}>오전 10:00</label>
            <input name="price_10" type="number" required placeholder="예: 50000" value={formData.price_10} onChange={handleChange} />
          </div>
          <div>
            <label style={{fontSize: '0.8rem', color: '#ccc'}}>오후 2:00</label>
            <input name="price_14" type="number" required placeholder="예: 50000" value={formData.price_14} onChange={handleChange} />
          </div>
          <div>
            <label style={{fontSize: '0.8rem', color: '#ccc'}}>오후 6:00</label>
            <input name="price_18" type="number" required placeholder="예: 60000" value={formData.price_18} onChange={handleChange} />
          </div>
          <div>
            <label style={{fontSize: '0.8rem', color: '#ccc'}}>오후 8:00 (심야)</label>
            <input name="price_20" type="number" required placeholder="예: 65000" value={formData.price_20} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="duration">Duration</label>
        <input id="duration" name="duration" type="text" required placeholder="예: 2 hours" value={formData.duration} onChange={handleChange} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="maxCapacity">Max Capacity</label>
        <input id="maxCapacity" name="maxCapacity" type="number" required placeholder="예: 8" value={formData.maxCapacity} onChange={handleChange} />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="category">Category</label>
        <select id="category" name="category" required className={styles.select} value={formData.category} onChange={handleChange}>
          <option value="">카테고리를 선택하세요</option>
          <option value="투어&액티비티">투어&액티비티</option>
          <option value="티켓">티켓</option>
          <option value="stay">stay</option>
          <option value="Shop">Shop</option>
        </select>
      </div>
      
      <div className={styles.actions}>
        <button type="submit" disabled={isPending} className={styles.btnSubmit}>
          {isPending ? 'Registering...' : 'Register Tour'}
        </button>
      </div>
    </form>
  );
}
