import { createClient } from '@supabase/supabase-js';

// Vercel 환경변수 설정의 번거로움을 피하기 위해 API 키를 직접 하드코딩합니다.
// (NEXT_PUBLIC_ 변수들은 어차피 브라우저에 노출되는 안전한 공개 키이므로 소스코드에 직접 넣어도 무방합니다.)
const supabaseUrl = 'https://ydmbfrfljvibtivpkeah.supabase.co';
const supabaseKey = 'sb_publishable_CWxy7sVF-rcB3ItjNPNW3w_QPPD0Dbg';

export const supabase = createClient(supabaseUrl, supabaseKey);
