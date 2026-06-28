'use server';

import { GoogleGenAI } from '@google/genai';

export async function analyzeImage(imageUrl: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.');
    }

    const ai = new GoogleGenAI({ apiKey });

    // Fetch the image from URL
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    });
    
    if (!response.ok) {
      throw new Error('이미지를 불러오는데 실패했습니다 (HTTP ' + response.status + '). 외부에서 접근이 막혀 있는 네이버 블로그/카페 등의 사진일 가능성이 높습니다. 다른 사진을 사용해주세요.');
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');
    const mimeType = response.headers.get('content-type') || 'image/jpeg';

    if (!mimeType.startsWith('image/')) {
      throw new Error('웹페이지 링크가 아닌 "순수 이미지 주소"를 입력해야 합니다. (사진 위에서 우클릭 -> [이미지 주소 복사]를 선택하세요.)');
    }

    const prompt = `
      너는 프리미엄 로컬 투어 플랫폼 'BUSAN WAYVE'의 전문 카피라이터이자 상품 기획자야.
      제공된 사진을 꼼꼼하게 분석해서 이 사진과 가장 잘 어울리는 투어 상품 정보를 만들어줘.
      응답은 반드시 JSON 형식으로만 제공하고 마크다운 코드 블록(\`\`\`json)은 포함하지 마.

      조건:
      - title: 직관적이고 매력적인 투어 제목 (예: 해운대 문라이트 프라이빗 요트 세션)
      - description: 이미지의 분위기가 잘 드러나는 서정적이고 구체적인 투어 설명 (2~3문장)
      - price: 30000에서 150000 사이의 적절한 가격 (숫자만, 예: 65000)
      - duration: 예상 소요 시간 (예: 2 hours, 3 hours)
      - maxCapacity: 예상 최대 인원 (예: 4, 6, 8, 12 중 하나)
      - category: "Marine Cruise", "Boutique Coffee", "Night Exploration" 중 사진에 가장 잘 맞는 것 하나
      
      출력 형식:
      {
        "title": "...",
        "description": "...",
        "price": "...",
        "duration": "...",
        "maxCapacity": "...",
        "category": "..."
      }
    `;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType
              }
            }
          ]
        }
      ]
    });

    const text = result.text || '';
    
    // JSON 추출 (마크다운 포맷팅 방어 로직)
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(jsonStr);

    return { success: true, data: parsed };

  } catch (error: any) {
    console.error('AI 분석 에러:', error);
    return { success: false, error: error.message || 'AI 분석 중 오류가 발생했습니다.' };
  }
}

export async function analyzeImageFile(base64Data: string, mimeType: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.');
    }

    const ai = new GoogleGenAI({ apiKey });

    if (!mimeType.startsWith('image/')) {
      throw new Error('올바른 이미지 파일이 아닙니다.');
    }

    const prompt = `
      너는 프리미엄 로컬 투어 플랫폼 'BUSAN WAYVE'의 전문 카피라이터이자 상품 기획자야.
      제공된 사진을 꼼꼼하게 분석해서 이 사진과 가장 잘 어울리는 투어 상품 정보를 만들어줘.
      응답은 반드시 JSON 형식으로만 제공하고 마크다운 코드 블록(\`\`\`json)은 포함하지 마.

      조건:
      - title: 직관적이고 매력적인 투어 제목 (예: 해운대 문라이트 프라이빗 요트 세션)
      - description: 이미지의 분위기가 잘 드러나는 서정적이고 구체적인 투어 설명 (2~3문장)
      - price: 30000에서 150000 사이의 적절한 가격 (숫자만, 예: 65000)
      - duration: 예상 소요 시간 (예: 2 hours, 3 hours)
      - maxCapacity: 예상 최대 인원 (예: 4, 6, 8, 12 중 하나)
      - category: "Marine Cruise", "Boutique Coffee", "Night Exploration" 중 사진에 가장 잘 맞는 것 하나
      
      출력 형식:
      {
        "title": "...",
        "description": "...",
        "price": "...",
        "duration": "...",
        "maxCapacity": "...",
        "category": "..."
      }
    `;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType
              }
            }
          ]
        }
      ]
    });

    const text = result.text || '';
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(jsonStr);

    return { success: true, data: parsed };

  } catch (error: any) {
    console.error('AI 파일 분석 에러:', error);
    return { success: false, error: error.message || 'AI 파일 분석 중 오류가 발생했습니다.' };
  }
}
