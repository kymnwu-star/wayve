import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ydmbfrfljvibtivpkeah.supabase.co';
const supabaseKey = 'sb_publishable_CWxy7sVF-rcB3ItjNPNW3w_QPPD0Dbg';

const supabase = createClient(supabaseUrl, supabaseKey);

const dummyPosts = [
  // 부산 (6개)
  {
    author: '광안리바다여행',
    authorEmail: 'admin@admin.com',
    title: '광안리 드론쇼 명당 공유합니다 🎆',
    content: '주말마다 열리는 광안리 드론쇼, 진짜 너무 멋졌어요! 사람 엄청 많을 줄 알고 일찍 갔는데 밀락더마켓 쪽에서 보니까 여유롭고 좋더라고요. 광안대교 야경이랑 겹쳐서 인생샷 100장 건졌습니다. 다음엔 부모님 모시고 가려고요! 완전 추천합니다.',
    region: '부산',
    time: '2시간 전',
    likes: 342,
    comments: 56,
    imageUrls: ['https://images.unsplash.com/photo-1598463953503-6f81e33527b1?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1591504780517-db3ffae60956?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1616016738520-213941426ea7?auto=format&fit=crop&q=80']
  },
  {
    author: '부산돼지국밥러버',
    authorEmail: 'admin@admin.com',
    title: '부산 로컬들만 아는 진짜 돼지국밥 맛집 🍲',
    content: '여행 책자에 나오는 곳 말고, 제가 10년째 단골로 다니는 영도 할매국밥집 다녀왔습니다. 국물이 아주 뽀얗고 고기 누린내 하나도 안 나요! 깍두기 국물 살짝 풀어서 부추 팍팍 넣고 먹으면 끝장납니다. 나만 알고 싶지만 특별히 공유해요.',
    region: '부산',
    time: '5시간 전',
    likes: 120,
    comments: 32,
    imageUrls: ['https://images.unsplash.com/photo-1580651315530-69c8e0026377?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1628186259063-4710189d2c20?auto=format&fit=crop&q=80']
  },
  {
    author: '해운대요트투어',
    authorEmail: 'admin@admin.com',
    title: '해운대 선셋 요트 투어 후기 ⛵️',
    content: '해가 질 무렵에 해운대에서 출발하는 요트 투어 탔어요! 마린시티 배경으로 해 지는 모습이 진짜 그림 같았습니다. 바닷바람 쐬면서 맥주 한 캔 마시니까 스트레스가 다 날아가네요! 데이트 코스로 강추!',
    region: '부산',
    time: '1일 전',
    likes: 85,
    comments: 12,
    imageUrls: ['https://images.unsplash.com/photo-1533219057257-46323bc01b44?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1565651586719-f9f3cce7a9d0?auto=format&fit=crop&q=80']
  },
  {
    author: '감천문화마을탐험',
    authorEmail: 'admin@admin.com',
    title: '알록달록 감천문화마을 스탬프 투어 완성 🎨',
    content: '아침 일찍 감천문화마을 다녀왔습니다. 골목골목 예쁜 벽화랑 아기자기한 소품샵 구경하느라 시간 가는 줄 몰랐네요. 길고양이들도 너무 귀여워요! 꼭 편한 신발 신고 가세요. 언덕이 꽤 가파릅니다.',
    region: '부산',
    time: '2일 전',
    likes: 45,
    comments: 8,
    imageUrls: ['https://images.unsplash.com/photo-1517400508447-f8dd518b86db?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1530635201083-d5e032eb3db7?auto=format&fit=crop&q=80']
  },
  {
    author: '태종대수국축제',
    authorEmail: 'admin@admin.com',
    title: '태종대 몽돌해변 파도소리 힐링 🌊',
    content: '태종대 다누비열차 타고 전망대 갔다가 몽돌해변까지 걸어 내려갔어요. 동글동글한 돌에 부딪히는 파도 소리가 ASMR이 따로 없네요! 신선바위에서 바라보는 바다뷰는 진짜 가슴이 뻥 뚫립니다.',
    region: '부산',
    time: '3일 전',
    likes: 210,
    comments: 15,
    imageUrls: ['https://images.unsplash.com/photo-1498307833015-e7b400441eb8?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1542152862-23cbf9ba518e?auto=format&fit=crop&q=80']
  },
  {
    author: '전포카페거리순례',
    authorEmail: 'admin@admin.com',
    title: '전포동 에스프레소 바 투어 ☕️',
    content: '요즘 핫하다는 전포동 카페거리! 하루 종일 에스프레소 바 3곳을 돌아다녔어요. 확실히 가게마다 원두 블렌딩이랑 크림 맛이 달라서 비교하며 마시는 재미가 있더라고요. 잔 쌓기 인증샷도 남겼습니다 ㅎㅎ',
    region: '부산',
    time: '4일 전',
    likes: 98,
    comments: 24,
    imageUrls: ['https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1495474472205-51f757077dbf?auto=format&fit=crop&q=80']
  },

  // 글로벌 (6개)
  {
    author: '방콕한달살기',
    authorEmail: 'admin@admin.com',
    title: '방콕 왓아룬 뷰포인트 루프탑 바 🇹🇭',
    content: '미리 예약해둔 왓아룬 맞은편 루프탑 바에서 찍은 사진입니다! 칵테일 한 잔 하면서 해 지고 사원에 조명 들어오는 걸 보는데 진짜 황홀하더라고요. 모기가 좀 있으니 기피제는 필수입니다!',
    region: '글로벌',
    time: '1시간 전',
    likes: 540,
    comments: 112,
    imageUrls: ['https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?auto=format&fit=crop&q=80']
  },
  {
    author: '파리낭만여행',
    authorEmail: 'admin@admin.com',
    title: '비 오는 파리의 아침 거리 🇫🇷',
    content: '에펠탑 근처 에어비앤비에 묵고 있는데, 아침에 비가 오길래 빵집 가서 크루아상이랑 커피 사왔습니다. 비 오는 파리 특유의 센치한 분위기가 너무 좋네요! 오후엔 루브르 박물관 갈 예정입니다.',
    region: '글로벌',
    time: '6시간 전',
    likes: 280,
    comments: 45,
    imageUrls: ['https://images.unsplash.com/photo-1502602898657-3e90760081d7?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80']
  },
  {
    author: '도쿄미식가',
    authorEmail: 'admin@admin.com',
    title: '도쿄 아사쿠사 근처 텐동 맛집 🇯🇵',
    content: '현지인들이 줄 서서 먹는다는 텐동집 1시간 웨이팅 끝에 먹었습니다. 새우튀김 크기가 진짜 장난 아니에요. 겉바속촉의 정석! 나마비루랑 같이 먹으니 천국이 따로 없네요 ㅠㅠ',
    region: '글로벌',
    time: '1일 전',
    likes: 155,
    comments: 38,
    imageUrls: ['https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1522851493728-662776cde4d9?auto=format&fit=crop&q=80']
  },
  {
    author: '알프스하이커',
    authorEmail: 'admin@admin.com',
    title: '스위스 융프라우요흐 등반 성공! 🇨🇭',
    content: '기차 타고 편하게 올라오긴 했지만, 고산병 살짝 와서 혼났네요 ㅋㅋ 그래도 만년설을 직접 밟아보고 내려다보는 경치는 말로 다 표현할 수 없습니다. 신라면 꿀맛입니다!',
    region: '글로벌',
    time: '2일 전',
    likes: 670,
    comments: 88,
    imageUrls: ['https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1498429089284-41f8cf3ffd39?auto=format&fit=crop&q=80']
  },
  {
    author: '뉴욕센트럴파크',
    authorEmail: 'admin@admin.com',
    title: '맨해튼 센트럴파크 피크닉 🇺🇸',
    content: '베이글이랑 연어크림치즈 사들고 센트럴파크 잔디밭에 누웠습니다. 고층 빌딩 숲 사이에 이런 거대한 공원이 있다는 게 새삼 놀랍네요. 넷플릭스 영화 주인공 된 기분 ㅋㅋㅋ',
    region: '글로벌',
    time: '3일 전',
    likes: 310,
    comments: 29,
    imageUrls: ['https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&q=80']
  },
  {
    author: '다낭리조트요정',
    authorEmail: 'admin@admin.com',
    title: '베트남 호이안 올드타운 소원배 🇻🇳',
    content: '밤이 되니 홍등이 켜져서 너무 예쁜 호이안 올드타운! 투본강에서 소원배 타고 촛불도 띄웠습니다. 마사지도 받고 망고스틴도 배터지게 먹고 1일 1쌀국수 실천 중입니다.',
    region: '글로벌',
    time: '4일 전',
    likes: 225,
    comments: 41,
    imageUrls: ['https://images.unsplash.com/photo-1555921015-5532091f6026?auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1541887375253-e9168f121e78?auto=format&fit=crop&q=80']
  }
];

const dbPosts = dummyPosts.map(post => {
  let finalContent = post.content + `\n<!--REGION:${post.region}-->\n<!--EMAIL:${post.authorEmail}-->`;
  return {
    title: post.title,
    author: post.author,
    content: finalContent,
    image_url: JSON.stringify(post.imageUrls)
  };
});

async function seed() {
  const { data, error } = await supabase.from('travelogues').insert(dbPosts);
  if (error) {
    console.error('Error inserting mock data:', error);
  } else {
    console.log('Successfully inserted 12 dummy posts.');
  }
}

seed();
