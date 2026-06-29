'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

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

  useEffect(() => {
    if (typeof window !== 'undefined' && window.kakao && window.kakao.maps) {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        const container = document.getElementById('kakao-map');
        if (!container) return;
        
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
    <>
      <Script
        strategy="afterInteractive"
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=7ff26c6aeb4799e58f60679f26fa69b7&autoload=false&libraries=services`}
        onLoad={() => setIsLoaded(true)}
      />
      <div 
        id="kakao-map" 
        style={{ width: '100%', height: '300px', borderRadius: '12px', marginTop: '1.5rem', background: '#222' }}
      ></div>
    </>
  );
}
