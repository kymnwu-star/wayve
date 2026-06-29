'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { checkEmailAndSendCode, updatePassword } from './actions';
import styles from './page.module.css';

type Step = 'EMAIL_INPUT' | 'CODE_INPUT' | 'RESET_PASSWORD';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [step, setStep] = useState<Step>('EMAIL_INPUT');
  const [email, setEmail] = useState('');
  const [tableName, setTableName] = useState('');
  
  // 모의 인증 코드 (프로토타입)
  const [generatedCode, setGeneratedCode] = useState('');
  const [inputCode, setInputCode] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');

  // 1단계: 이메일 검증
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    startTransition(async () => {
      const res = await checkEmailAndSendCode(email);
      if (res.success && res.tableName) {
        setTableName(res.tableName);
        // 프로토타입: 랜덤 6자리 생성 및 팝업 (원래는 이메일 발송됨)
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedCode(code);
        alert(`[프로토타입 테스트 모드]\n\n실제 이메일 발송 대신 인증코드를 화면에 띄웁니다.\n\n인증코드: ${code}`);
        setStep('CODE_INPUT');
      } else {
        setError(res.error || '오류가 발생했습니다.');
      }
    });
  };

  // 2단계: 인증 코드 확인
  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode === generatedCode) {
      setError('');
      setStep('RESET_PASSWORD');
    } else {
      setError('인증코드가 일치하지 않습니다.');
    }
  };

  // 3단계: 새 비밀번호 설정
  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (newPassword.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    startTransition(async () => {
      const res = await updatePassword(email, newPassword, tableName);
      if (res.success) {
        alert('비밀번호가 성공적으로 변경되었습니다! 새 비밀번호로 로그인해 주세요.');
        router.push('/login');
      } else {
        setError(res.error || '비밀번호 변경 중 오류가 발생했습니다.');
      }
    });
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>비밀번호 찾기</h1>
        
        {step === 'EMAIL_INPUT' && (
          <>
            <p className={styles.subtitle}>가입하신 이메일 주소를 입력해 주세요.</p>
            {error && <div className={styles.errorMessage}>{error}</div>}
            <form onSubmit={handleEmailSubmit}>
              <div className={styles.formGroup}>
                <label>이메일</label>
                <input 
                  type="email" 
                  className={styles.input} 
                  required 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="예: wayve@example.com"
                />
              </div>
              <button type="submit" className={styles.submitBtn} disabled={isPending || !email}>
                {isPending ? '확인 중...' : '인증번호 받기'}
              </button>
            </form>
          </>
        )}

        {step === 'CODE_INPUT' && (
          <>
            <p className={styles.subtitle}>이메일로 전송된 6자리 인증코드를 입력해 주세요.</p>
            {error && <div className={styles.errorMessage}>{error}</div>}
            <form onSubmit={handleCodeSubmit}>
              <div className={styles.formGroup}>
                <label>인증 코드</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  required 
                  maxLength={6}
                  value={inputCode}
                  onChange={e => setInputCode(e.target.value)}
                  placeholder="6자리 숫자 입력"
                />
              </div>
              <button type="submit" className={styles.submitBtn} disabled={!inputCode}>
                인증 확인
              </button>
            </form>
          </>
        )}

        {step === 'RESET_PASSWORD' && (
          <>
            <p className={styles.subtitle}>안전한 새 비밀번호를 설정해 주세요.</p>
            {error && <div className={styles.errorMessage}>{error}</div>}
            <form onSubmit={handleResetSubmit}>
              <div className={styles.formGroup}>
                <label>새 비밀번호</label>
                <input 
                  type="password" 
                  className={styles.input} 
                  required 
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호 (6자 이상)"
                />
              </div>
              <div className={styles.formGroup}>
                <label>새 비밀번호 확인</label>
                <input 
                  type="password" 
                  className={styles.input} 
                  required 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="새 비밀번호 다시 입력"
                />
              </div>
              <button type="submit" className={styles.submitBtn} disabled={isPending || !newPassword || !confirmPassword}>
                {isPending ? '변경 중...' : '비밀번호 변경하기'}
              </button>
            </form>
          </>
        )}

        <Link href="/login" className={styles.backLink}>
          로그인 화면으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
