import React from 'react';

// WMO 날씨 코드 변환 헬퍼 (기본적인 것만)
function getWeatherDesc(code: number) {
  if (code === 0) return '☀️ 맑음';
  if (code >= 1 && code <= 3) return '⛅️ 구름 조금';
  if (code === 45 || code === 48) return '🌫️ 안개';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return '🌧️ 비';
  if (code >= 71 && code <= 77 || code === 85 || code === 86) return '❄️ 눈';
  if (code >= 95 && code <= 99) return '⛈️ 뇌우';
  return '☁️ 흐림';
}

export default async function WeatherCurrencyBar() {
  let temp = 20;
  let weatherDesc = '☀️ 맑음';
  let krwRate = 1350;
  let error = false;

  try {
    // 1. 부산 날씨 (Open-Meteo 무료 API)
    const weatherRes = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=35.1796&longitude=129.0756&current=temperature_2m,weather_code&timezone=auto',
      { next: { revalidate: 3600 } } // 1시간마다 캐시 갱신
    );
    if (weatherRes.ok) {
      const wData = await weatherRes.json();
      temp = wData.current.temperature_2m;
      weatherDesc = getWeatherDesc(wData.current.weather_code);
    }

    // 2. 환율 (ExchangeRate-API 무료 엔드포인트)
    const rateRes = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 3600 } // 1시간마다 갱신
    });
    if (rateRes.ok) {
      const rData = await rateRes.json();
      krwRate = rData.rates.KRW;
    }
  } catch (e) {
    console.error('Failed to fetch widget data', e);
    error = true;
  }

  return (
    <div style={{
      background: '#0a0a0a',
      color: '#aaa',
      fontSize: '0.8rem',
      padding: '0.4rem 2rem',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '1.5rem',
      borderBottom: '1px solid rgba(255,255,255,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <span style={{ color: 'var(--accent)' }}>📍 부산</span>
        <span>{weatherDesc}</span>
        <span style={{ fontWeight: 'bold' }}>{temp}°C</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <span>💵 환율</span>
        <span style={{ fontWeight: 'bold', color: '#fff' }}>1 USD = {Math.round(krwRate).toLocaleString()} 원</span>
      </div>
    </div>
  );
}
