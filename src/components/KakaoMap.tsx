'use client';

import { useEffect } from 'react';
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
  
  const initMap = () => {
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        const container = document.getElementById('kakao-map');
        const options = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 4,
        };
        const map = new window.kakao.maps.Map(container, options);
        
        // 마커 생성
        const markerPosition  = new window.kakao.maps.LatLng(latitude, longitude); 
        const marker = new window.kakao.maps.Marker({
            position: markerPosition
        });
        marker.setMap(map);
      });
    }
  };

  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_KEY}&autoload=false`}
        onLoad={initMap}
      />
      <div 
        id="kakao-map" 
        style={{ width: '100%', height: '300px', borderRadius: '12px', marginTop: '1.5rem', background: '#222' }}
      ></div>
    </>
  );
}
