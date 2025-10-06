import { CurriculumWeek } from '@/types/curriculum';

export const curriculumData: CurriculumWeek[] = [
  // A1 Level - Week 1
  {
    id: 'A1-W1',
    level: 'A1',
    weekNumber: 1,
    title: '기초 인사와 자기소개',
    description: '영어로 인사하고 자신을 소개하는 방법을 배웁니다.',
    objectives: [
      '기본 인사 표현 익히기',
      '자기소개 문장 만들기',
      '간단한 질문에 답하기',
      '알파벳과 기본 발음 익히기',
    ],
    estimatedTime: 180, // 3시간
    order: 1,
    activities: [
      {
        id: 'A1-W1-A1',
        type: 'vocabulary',
        title: '인사 표현 익히기',
        description:
          'Hello, Hi, Good morning, Good afternoon 등 기본 인사 표현을 학습합니다.',
        duration: 20,
        difficulty: 1,
        order: 1,
        requiredForCompletion: true,
        tags: ['greetings', 'basics'],
      },
      {
        id: 'A1-W1-A2',
        type: 'listening',
        title: '인사 듣기 연습',
        description: '원어민의 인사 표현을 듣고 따라 말해봅니다.',
        duration: 25,
        difficulty: 1,
        order: 2,
        requiredForCompletion: true,
        tags: ['greetings', 'listening'],
      },
      {
        id: 'A1-W1-A3',
        type: 'speaking',
        title: '인사 말하기 연습',
        description: '다양한 상황에서 적절한 인사를 해봅니다.',
        duration: 30,
        difficulty: 1,
        order: 3,
        requiredForCompletion: true,
        tags: ['greetings', 'speaking'],
      },
      {
        id: 'A1-W1-A4',
        type: 'grammar',
        title: '자기소개 문장 구조',
        description: 'My name is..., I am... 등 자기소개 문장 구조를 학습합니다.',
        duration: 30,
        difficulty: 1,
        order: 4,
        requiredForCompletion: true,
        tags: ['introduction', 'grammar'],
      },
      {
        id: 'A1-W1-A5',
        type: 'writing',
        title: '자기소개 글 쓰기',
        description: '배운 표현을 활용해 자기소개 글을 작성합니다.',
        duration: 35,
        difficulty: 2,
        order: 5,
        requiredForCompletion: true,
        tags: ['introduction', 'writing'],
      },
      {
        id: 'A1-W1-A6',
        type: 'reading',
        title: '자기소개 예시 읽기',
        description: '다양한 사람들의 자기소개 글을 읽고 이해합니다.',
        duration: 25,
        difficulty: 1,
        order: 6,
        requiredForCompletion: false,
        tags: ['introduction', 'reading'],
      },
      {
        id: 'A1-W1-A7',
        type: 'vocabulary',
        title: '알파벳 복습',
        description: '영어 알파벳 26자와 발음을 복습합니다.',
        duration: 15,
        difficulty: 1,
        order: 7,
        requiredForCompletion: false,
        tags: ['alphabet', 'pronunciation'],
      },
    ],
  },

  // A1 Level - Week 2
  {
    id: 'A1-W2',
    level: 'A1',
    weekNumber: 2,
    title: '숫자와 시간 표현',
    description: '숫자를 읽고 시간을 표현하는 방법을 배웁니다.',
    objectives: [
      '1부터 100까지 숫자 익히기',
      '시간 묻고 답하기',
      '날짜와 요일 표현하기',
      '기본 수량 표현 익히기',
    ],
    estimatedTime: 195, // 3시간 15분
    order: 2,
    activities: [
      {
        id: 'A1-W2-A1',
        type: 'vocabulary',
        title: '숫자 1-20 익히기',
        description: '1부터 20까지 숫자를 영어로 읽고 씁니다.',
        duration: 20,
        difficulty: 1,
        order: 1,
        requiredForCompletion: true,
        tags: ['numbers', 'basics'],
      },
      {
        id: 'A1-W2-A2',
        type: 'vocabulary',
        title: '숫자 20-100 익히기',
        description: '20부터 100까지 숫자를 영어로 읽고 씁니다.',
        duration: 25,
        difficulty: 2,
        order: 2,
        requiredForCompletion: true,
        tags: ['numbers'],
      },
      {
        id: 'A1-W2-A3',
        type: 'listening',
        title: '숫자 듣기 연습',
        description: '원어민이 말하는 숫자를 듣고 받아쓰기 합니다.',
        duration: 30,
        difficulty: 2,
        order: 3,
        requiredForCompletion: true,
        tags: ['numbers', 'listening'],
      },
      {
        id: 'A1-W2-A4',
        type: 'grammar',
        title: '시간 표현 문법',
        description: "What time is it? It's... o'clock 등 시간 표현을 학습합니다.",
        duration: 30,
        difficulty: 2,
        order: 4,
        requiredForCompletion: true,
        tags: ['time', 'grammar'],
      },
      {
        id: 'A1-W2-A5',
        type: 'speaking',
        title: '시간 말하기 연습',
        description: '다양한 시간을 영어로 말하는 연습을 합니다.',
        duration: 25,
        difficulty: 2,
        order: 5,
        requiredForCompletion: true,
        tags: ['time', 'speaking'],
      },
      {
        id: 'A1-W2-A6',
        type: 'vocabulary',
        title: '요일과 날짜',
        description: '요일 이름과 날짜 표현을 학습합니다.',
        duration: 25,
        difficulty: 1,
        order: 6,
        requiredForCompletion: true,
        tags: ['date', 'vocabulary'],
      },
      {
        id: 'A1-W2-A7',
        type: 'writing',
        title: '일정표 작성하기',
        description: '요일과 시간을 사용해 간단한 일정표를 작성합니다.',
        duration: 30,
        difficulty: 2,
        order: 7,
        requiredForCompletion: false,
        tags: ['date', 'time', 'writing'],
      },
      {
        id: 'A1-W2-A8',
        type: 'reading',
        title: '시간표 읽기',
        description: '학교 시간표나 버스 시간표를 읽고 이해합니다.',
        duration: 10,
        difficulty: 1,
        order: 8,
        requiredForCompletion: false,
        tags: ['time', 'reading'],
      },
    ],
  },

  // A1 Level - Week 3
  {
    id: 'A1-W3',
    level: 'A1',
    weekNumber: 3,
    title: '가족과 친구 소개하기',
    description: '가족 구성원과 친구들을 소개하는 방법을 배웁니다.',
    objectives: [
      '가족 관계 표현 익히기',
      '사람 묘사하기',
      '소유격 사용하기',
      '간단한 질문과 답변하기',
    ],
    estimatedTime: 190,
    order: 3,
    activities: [
      {
        id: 'A1-W3-A1',
        type: 'vocabulary',
        title: '가족 관계 단어',
        description: 'mother, father, sister, brother 등 가족 관계 단어를 학습합니다.',
        duration: 25,
        difficulty: 1,
        order: 1,
        requiredForCompletion: true,
        tags: ['family', 'vocabulary'],
      },
      {
        id: 'A1-W3-A2',
        type: 'grammar',
        title: '소유격 문법',
        description: "my, your, his, her 등 소유격과 's 사용법을 학습합니다.",
        duration: 30,
        difficulty: 2,
        order: 2,
        requiredForCompletion: true,
        tags: ['grammar', 'possessive'],
      },
      {
        id: 'A1-W3-A3',
        type: 'reading',
        title: '가족 소개 글 읽기',
        description: '다양한 가족 소개 글을 읽고 이해합니다.',
        duration: 25,
        difficulty: 1,
        order: 3,
        requiredForCompletion: true,
        tags: ['family', 'reading'],
      },
      {
        id: 'A1-W3-A4',
        type: 'speaking',
        title: '가족 소개하기',
        description: '자신의 가족 구성원을 영어로 소개합니다.',
        duration: 30,
        difficulty: 2,
        order: 4,
        requiredForCompletion: true,
        tags: ['family', 'speaking'],
      },
      {
        id: 'A1-W3-A5',
        type: 'vocabulary',
        title: '외모와 성격 표현',
        description: 'tall, short, kind, funny 등 사람을 묘사하는 단어를 학습합니다.',
        duration: 30,
        difficulty: 2,
        order: 5,
        requiredForCompletion: true,
        tags: ['description', 'vocabulary'],
      },
      {
        id: 'A1-W3-A6',
        type: 'writing',
        title: '친구 소개 글 쓰기',
        description: '친구의 외모와 성격을 묘사하는 글을 작성합니다.',
        duration: 35,
        difficulty: 2,
        order: 6,
        requiredForCompletion: true,
        tags: ['description', 'writing'],
      },
      {
        id: 'A1-W3-A7',
        type: 'listening',
        title: '가족 대화 듣기',
        description: '가족에 대한 대화를 듣고 이해합니다.',
        duration: 15,
        difficulty: 1,
        order: 7,
        requiredForCompletion: false,
        tags: ['family', 'listening'],
      },
    ],
  },

  // A1 Level - Week 4
  {
    id: 'A1-W4',
    level: 'A1',
    weekNumber: 4,
    title: '일상생활과 취미',
    description: '일상 활동과 취미에 대해 이야기하는 방법을 배웁니다.',
    objectives: [
      '일상 활동 동사 익히기',
      '현재 시제 사용하기',
      '취미와 좋아하는 것 표현하기',
      '빈도 부사 사용하기',
    ],
    estimatedTime: 200,
    order: 4,
    activities: [
      {
        id: 'A1-W4-A1',
        type: 'vocabulary',
        title: '일상 활동 동사',
        description: 'wake up, eat, study, sleep 등 일상 활동 동사를 학습합니다.',
        duration: 25,
        difficulty: 1,
        order: 1,
        requiredForCompletion: true,
        tags: ['daily', 'verbs'],
      },
      {
        id: 'A1-W4-A2',
        type: 'grammar',
        title: '현재 시제 문법',
        description: '현재 시제 동사 활용과 3인칭 단수 -s를 학습합니다.',
        duration: 35,
        difficulty: 2,
        order: 2,
        requiredForCompletion: true,
        tags: ['grammar', 'present-tense'],
      },
      {
        id: 'A1-W4-A3',
        type: 'writing',
        title: '하루 일과 쓰기',
        description: '자신의 하루 일과를 시간 순서대로 작성합니다.',
        duration: 30,
        difficulty: 2,
        order: 3,
        requiredForCompletion: true,
        tags: ['daily', 'writing'],
      },
      {
        id: 'A1-W4-A4',
        type: 'vocabulary',
        title: '취미 관련 단어',
        description: 'reading, swimming, playing 등 취미 관련 단어를 학습합니다.',
        duration: 20,
        difficulty: 1,
        order: 4,
        requiredForCompletion: true,
        tags: ['hobbies', 'vocabulary'],
      },
      {
        id: 'A1-W4-A5',
        type: 'grammar',
        title: '좋아하는 것 표현하기',
        description: 'like, love, enjoy + -ing 형태를 학습합니다.',
        duration: 30,
        difficulty: 2,
        order: 5,
        requiredForCompletion: true,
        tags: ['grammar', 'preferences'],
      },
      {
        id: 'A1-W4-A6',
        type: 'listening',
        title: '취미 대화 듣기',
        description: '사람들이 취미에 대해 이야기하는 것을 듣습니다.',
        duration: 25,
        difficulty: 2,
        order: 6,
        requiredForCompletion: true,
        tags: ['hobbies', 'listening'],
      },
      {
        id: 'A1-W4-A7',
        type: 'speaking',
        title: '취미 말하기 연습',
        description: '자신의 취미와 좋아하는 활동에 대해 말합니다.',
        duration: 25,
        difficulty: 2,
        order: 7,
        requiredForCompletion: true,
        tags: ['hobbies', 'speaking'],
      },
      {
        id: 'A1-W4-A8',
        type: 'reading',
        title: '취미 소개 글 읽기',
        description: '다양한 사람들의 취미 소개 글을 읽고 이해합니다.',
        duration: 10,
        difficulty: 1,
        order: 8,
        requiredForCompletion: false,
        tags: ['hobbies', 'reading'],
      },
    ],
  },
];

// 레벨별 주차 필터링 헬퍼
export const getWeeksByLevel = (level: string) => {
  return curriculumData.filter((week) => week.level === level);
};

// 특정 주차 찾기
export const getWeekById = (weekId: string) => {
  return curriculumData.find((week) => week.id === weekId);
};

// 다음 주차 찾기
export const getNextWeek = (currentWeekId: string) => {
  const currentIndex = curriculumData.findIndex(
    (week) => week.id === currentWeekId
  );
  if (currentIndex === -1 || currentIndex === curriculumData.length - 1) {
    return null;
  }
  return curriculumData[currentIndex + 1];
};

// 이전 주차 찾기
export const getPreviousWeek = (currentWeekId: string) => {
  const currentIndex = curriculumData.findIndex(
    (week) => week.id === currentWeekId
  );
  if (currentIndex <= 0) {
    return null;
  }
  return curriculumData[currentIndex - 1];
};
