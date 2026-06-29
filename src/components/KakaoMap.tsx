'use client';

import { useEffect, useState, useRef } from 'react';

interface KakaoMapProps {
  latitude?: number;
  longitude?: number;
}

declare global {
  interface Window {
    kakao: any;
  }
}

export default function KakaoMap({ latitude = 35.1595454, longitude = 129.1625985 }: KakaoMapProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.kakao && window.kakao.maps) {
      setIsLoaded(true);
      return;
    }

    const existingScript = document.getElementById('kakao-sdk');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'kakao-sdk';
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=7ff26c6aeb4799e58f60679f26fa69b7&autoload=false&libraries=services`;
      script.onload = () => setIsLoaded(true);
      script.onerror = () => console.error('Kakao Map SDK load failed');
      document.head.appendChild(script);
    } else {
      existingScript.addEventListener('load', () => setIsLoaded(true));
    }
  }, []);

  useEffect(() => {
    if (isLoaded && window.kakao && window.kakao.maps && mapRef.current) {
      window.kakao.maps.load(() => {
        const container = mapRef.current;
        if (!container) return;
        
        // Remove existing children if React re-rendered
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }

        const options = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 4,
        };
        const map = new window.kakao.maps.Map(container, options);
        
        const markerPosition = new window.kakao.maps.LatLng(latitude, longitude); 
        const marker = new window.kakao.maps.Marker({
            position: markerPosition
        });
        marker.setMap(map);
      });
    }
  }, [isLoaded, latitude, longitude]);

  return (
    <div 
      ref={mapRef}
      style={{ width: '100%', height: '300px', borderRadius: '12px', marginTop: '1.5rem', background: '#222', position: 'relative' }}
    >
      {!isLoaded && <div style={{display:'flex', height:'100%', justifyContent:'center', alignItems:'center', color:'#888', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>지도를 불러오는 중...</div>}
    </div>
  );
}
