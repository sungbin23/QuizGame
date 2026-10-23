// quiz-data.js
const quizData = [
    // --- 한국사 ---
    {
        id: 1,
        category: "한국사",
        difficulty: "easy",
        question: "임진왜란이 일어난 연도는?",
        options: ["1392년", "1592년", "1636년", "1910년"],
        answerIndex: 1,
        explanation: "임진왜란은 1592년(선조 25년)에 일본의 침략으로 시작되었습니다."
    },
    {
        id: 2,
        category: "한국사",
        difficulty: "medium",
        question: "조선시대 4대 사화 중 첫 번째로 일어난 사화는?",
        options: ["무오사화", "갑자사화", "기묘사화", "을사사화"],
        answerIndex: 0,
        explanation: "무오사화(1498년)는 연산군 때 사림파가 화를 입은 첫 번째 사화입니다."
    },

    // --- 세계지리 ---
    {
        id: 3,
        category: "세계지리",
        difficulty: "medium",
        question: "세계에서 가장 긴 강은? (전통적 측정 기준)",
        options: ["아마존강", "나일강", "양쯔강", "미시시피강"],
        answerIndex: 1,
        explanation: "나일강은 약 6,650km로 전통적/공식적 측정을 통해 가장 긴 강으로 분류됩니다."
    },
    {
        id: 4,
        category: "세계지리",
        difficulty: "easy",
        question: "세계에서 면적이 가장 넓은 국가 기준(2024년 기준)은?",
        options: ["캐나다", "미국", "러시아", "중국"],
        answerIndex: 2,
        explanation: "러시아는 약 1,710만 ㎢의 면적으로 세계에서 가장 넓은 국토를 가졌습니다."
    },

    // --- 과학 ---
    {
        id: 5,
        category: "과학",
        difficulty: "easy",
        question: "주기율표에서 원자 번호 1번인 원소는?",
        options: ["수소(H)", "헬륨(He)", "리튬(Li)", "산소(O)"],
        answerIndex: 0,
        explanation: "원자 번호 1번은 가장 가벼운 원소인 수소(H)입니다."
    },
    {
        id: 6,
        category: "과학",
        difficulty: "hard",
        question: "빛의 속도(진공 상태 기준)는 약 얼마인가?",
        options: ["초속 30만 km", "초속 15만 km", "초속 50만 km", "초속 100만 km"],
        answerIndex: 0,
        explanation: "진공 속 빛의 속도는 약 299,792,458 m/s (약 초속 30만 km)입니다."
    },

    // --- IT / 컴퓨터공학 ---
    {
        id: 7,
        category: "IT/컴퓨터공학",
        difficulty: "medium",
        question: "HTTP 상태 코드 중 'Page Not Found(찾을 수 없음)'를 나타내는 번호는?",
        options: ["200", "403", "404", "500"],
        answerIndex: 2,
        explanation: "404 Not Found는 클라이언트가 요청한 리소스를 서버에서 찾을 수 없을 때 반환됩니다."
    },
    {
        id: 8,
        category: "IT/컴퓨터공학",
        difficulty: "hard",
        question: "객체 지향 프로그래밍(OOP)의 4대 요소에 속하지 않는 것은?",
        options: ["캡슐화", "상속성", "다형성", "절차성"],
        answerIndex: 3,
        explanation: "OOP의 4대 핵심 개념은 캡슐화, 추상화, 상속성, 다형성입니다."
    },

    // --- 예술과 문화 ---
    {
        id: 9,
        category: "예술과 문화",
        difficulty: "hard",
        question: "'게르니카'를 그린 화가는?",
        options: ["살바도르 달리", "파블로 피카소", "마크 샤갈", "고야"],
        answerIndex: 1,
        explanation: "파블로 피카소는 1937년 스페인 내전의 비극을 다룬 대작 '게르니카'를 남겼습니다."
    },
    {
        id: 10,
        category: "예술과 문화",
        difficulty: "easy",
        question: "레오나르도 다 빈치의 대표작 '모나리자'가 소장되어 있는 박물관은?",
        options: ["대영박물관", "루브르 박물관", "바티칸 박물관", "메트로폴리탄 박물관"],
        answerIndex: 1,
        explanation: "모나리자는 프랑스 파리에 위치한 루브르 박물관에 소장되어 있습니다."
    },

    // --- 게임/서브컬처 ---
    {
        id: 11,
        category: "게임/서브컬처",
        difficulty: "easy",
        question: "닌텐도의 마스코트 캐릭터 '마리오'의 직업은?",
        options: ["요리사", "배관공", "목수", "카레이서"],
        answerIndex: 1,
        explanation: "마리오는 공식 설정상 버섯 왕국을 구하는 배관공(Plumber)입니다."
    },
    {
        id: 12,
        category: "게임/서브컬처",
        difficulty: "medium",
        question: "세계 최초로 상업적 성공을 거둔 레트로 게임 '퐁(Pong)'을 개발한 회사는?",
        options: ["닌텐도", "아타리(Atari)", "세가(Sega)", "남코(Namco)"],
        answerIndex: 1,
        explanation: "1972년 아타리(Atari)사에서 출시한 '퐁'은 아케이드 게임 산업의 시초가 되었습니다."
    }
];