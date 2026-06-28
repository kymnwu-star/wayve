'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './AIAssistant.module.css';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: '안녕하세요! 부산 웨이브 로컬 컨시어지입니다. 무엇을 도와드릴까요?', isUser: false }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Add user message
    const userMsg: Message = { id: Date.now(), text: inputText, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Mock AI response after a short delay
    setTimeout(() => {
      const aiMsg: Message = { 
        id: Date.now() + 1, 
        text: '현재는 데모 버전이므로 답변을 제공할 수 없습니다. 향후 업데이트를 기대해주세요!', 
        isUser: false 
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <>
      <button 
        className={`${styles.floatingBtn} ${isOpen ? styles.hidden : ''}`} 
        onClick={() => setIsOpen(true)}
      >
        <span className={styles.icon}>✨</span>
        <span className={styles.text}>wayve</span>
      </button>

      <div className={`${styles.chatWindow} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <div>
            <div className={styles.headerTitle}>WAYVE</div>
            <div className={styles.headerSubtitle}>Local Guide</div>
          </div>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>✕</button>
        </div>

        <div className={styles.messageArea}>
          {messages.map((msg) => (
            <div key={msg.id} className={`${styles.messageWrapper} ${msg.isUser ? styles.user : styles.ai}`}>
              {!msg.isUser && <div className={styles.avatar}>✨</div>}
              <div className={styles.messageBubble}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className={styles.inputArea} onSubmit={handleSend}>
          <input 
            type="text" 
            placeholder="메시지를 입력하세요..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.sendBtn} disabled={!inputText.trim()}>전송</button>
        </form>
      </div>
    </>
  );
}
