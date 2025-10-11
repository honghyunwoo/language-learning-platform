# GPT-5 콘텐츠 생성 프롬프트 시스템

**목적**: API 비용 $1,500 제거 + 품질 향상
**방법**: ChatGPT Pro (GPT-5 Thinking 모드) 활용
**예상 절감**: 100% ($1,500 → $0)

---

## 📋 사용 방법

1. **ChatGPT Pro**에 접속 (https://chatgpt.com)
2. **Thinking 모드** 활성화 (깊은 추론)
3. 아래 프롬프트 복사 → 붙여넣기
4. 생성된 JSON을 `/data/activities/` 폴더에 저장

---

## 🎯 프롬프트 1: 어휘 학습 (Vocabulary)

### 골든 템플릿 기반 생성

```markdown
당신은 "영어의 정석" 브랜드의 언어학 박사입니다.
"수학의 정석"처럼 논문급 깊이의 어휘 학습 콘텐츠를 만들어주세요.

# 미션
Level 2, Week 3용 Vocabulary Activity 1개 생성
주제: "일상생활 - 집안일 (Household Chores)"

# 품질 기준 (반드시 준수)
1. **깊이**: 30분 학습 분량 (5분 아님!)
2. **논문급**: 어원, 문화적 맥락, 언어학적 설명 포함
3. **구조**: 이론 → 예제 → 연습 → 심화 → 응용
4. **예제**: 단어당 3개 문장 (초급/중급/고급)
5. **연습문제**: 20개 이상 (다양한 유형)

# JSON 출력 형식

\`\`\`json
{
  "id": "vocab_level2_week3_001",
  "type": "vocabulary",
  "level": 2,
  "week": 3,
  "title": "Household Chores - 집안일 어휘 마스터",
  "estimatedTime": 30,
  "objectives": [
    "집안일 관련 핵심 동사 15개 완전 습득",
    "각 동사의 어원과 유의어 차이 이해",
    "실생활 대화에서 자연스럽게 사용 가능"
  ],
  "content": {
    "theory": {
      "introduction": "집안일 동사들의 언어학적 특징...",
      "etymology": {
        "clean": {
          "origin": "고대영어 'clǣne' (순수한)",
          "evolution": "13세기부터 '청소하다' 의미 추가",
          "cognates": ["German: klein (작은)", "Dutch: klein"],
          "culturalContext": "청결과 도덕성의 연결 (Cleanliness is next to godliness)"
        },
        "wash": {
          "origin": "고대영어 'wæscan'",
          "evolution": "인도유럽어 *wed- (물) 에서 유래",
          "cognates": ["German: waschen", "Swedish: vaska"],
          "culturalContext": "정화 의식과의 연결"
        }
        // ... 15개 단어 모두 이런 식으로
      },
      "semanticFields": [
        {
          "category": "청소 (Cleaning)",
          "words": ["clean", "wipe", "dust", "sweep", "mop", "vacuum"],
          "nuances": "clean은 포괄적, wipe는 표면, dust는 먼지 특화..."
        },
        {
          "category": "세탁 (Laundry)",
          "words": ["wash", "dry", "iron", "fold", "hang"],
          "nuances": "wash vs. launder (격식), dry vs. air-dry..."
        }
        // ... 더 많은 카테고리
      ]
    },
    "examples": {
      "clean": [
        {
          "level": "beginner",
          "sentence": "I clean my room every Saturday.",
          "translation": "나는 매주 토요일 방을 청소한다.",
          "notes": "현재 습관 표현 (simple present)",
          "audioUrl": "/audio/vocab_clean_1.mp3"
        },
        {
          "level": "intermediate",
          "sentence": "She's been cleaning the house all morning.",
          "translation": "그녀는 아침 내내 집을 청소하고 있다.",
          "notes": "진행 중 + 기간 강조 (present perfect continuous)",
          "audioUrl": "/audio/vocab_clean_2.mp3"
        },
        {
          "level": "advanced",
          "sentence": "Had I known you were coming, I would have cleaned more thoroughly.",
          "translation": "네가 올 줄 알았다면, 더 철저히 청소했을 텐데.",
          "notes": "가정법 과거완료 + 부사 thoroughly 사용",
          "audioUrl": "/audio/vocab_clean_3.mp3"
        }
      ]
      // ... 15개 단어 × 3개 예문 = 45개 예문
    },
    "exercises": [
      {
        "type": "fill_in_the_blank",
        "question": "I need to _____ the windows; they're very dirty.",
        "options": ["clean", "wash", "wipe", "sweep"],
        "correct": "clean",
        "explanation": "clean은 포괄적이지만, 창문은 wipe나 wash도 가능. 여기서는 'very dirty'가 힌트 - 전체적 청소 의미의 clean이 가장 적합."
      },
      {
        "type": "synonym_matching",
        "instruction": "다음 단어의 가장 가까운 유의어를 고르세요",
        "pairs": [
          {
            "word": "tidy up",
            "options": ["clean", "organize", "dust", "sweep"],
            "correct": "organize",
            "explanation": "tidy up은 '정리하다'에 가까움"
          }
        ]
      },
      {
        "type": "error_correction",
        "sentence": "I'm washing the dishes since this morning.",
        "error": "washing → have been washing",
        "explanation": "since는 완료 시제 필요 (present perfect continuous)"
      },
      {
        "type": "collocation",
        "instruction": "올바른 결합을 선택하세요",
        "question": "_____ the bed",
        "options": ["make", "do", "clean", "tidy"],
        "correct": "make",
        "explanation": "make the bed (침대 정리)는 고정 표현"
      },
      {
        "type": "contextual_usage",
        "scenario": "You're giving someone instructions on cleaning the bathroom.",
        "task": "다음 중 가장 자연스러운 표현은?",
        "options": [
          "Clean the toilet with the brush.",
          "Wash the toilet with the brush.",
          "Wipe the toilet with the brush.",
          "Sweep the toilet with the brush."
        ],
        "correct": "Clean the toilet with the brush.",
        "explanation": "화장실 청소는 clean, wash도 가능하지만 brush와는 clean이 가장 자연스러움"
      }
      // ... 총 20개 이상의 다양한 연습문제
    ],
    "deepDive": {
      "title": "심화 학습: 청소 관련 관용어와 문화",
      "idioms": [
        {
          "expression": "clean slate",
          "meaning": "새 출발, 과거 청산",
          "example": "After the bankruptcy, he wanted a clean slate.",
          "etymology": "학교 칠판(slate)을 깨끗이 지우고 새로 시작하는 것에서 유래"
        },
        {
          "expression": "come clean",
          "meaning": "진실을 털어놓다",
          "example": "He finally came clean about his involvement.",
          "etymology": "더러운 것을 깨끗이 한다 → 숨긴 것을 드러낸다"
        }
        // ... 10개 이상
      ],
      "culturalNotes": [
        {
          "topic": "청소 문화의 동서양 차이",
          "content": "서양: 주말 대청소 문화 (Spring cleaning), 동양: 연말 대청소 (大掃除). 언어에도 반영: 영어 'spring cleaning'은 계절 강조, 일본어 '大掃除'는 규모 강조."
        },
        {
          "topic": "가사노동의 젠더 이슈",
          "content": "역사적으로 여성의 일로 여겨졌으나, 현대는 변화. 언어도 변화: 'housewife' → 'homemaker', 'maid' → 'housekeeper' (전문직 인식)"
        }
      ]
    },
    "application": {
      "title": "실전 적용: 롤플레이 시나리오",
      "scenarios": [
        {
          "title": "시나리오 1: 룸메이트와 청소 분담 논의",
          "setup": "You and your new roommate need to divide household chores.",
          "dialogue": [
            "You: Hey, we should probably talk about dividing up the chores.",
            "Roommate: Good idea. What needs to be done regularly?",
            "You: Well, someone needs to _____ [vacuum] the living room...",
            // ... 긴 대화
          ],
          "vocabularyUsed": ["vacuum", "take out", "do the dishes", "clean", "tidy up"],
          "learningPoints": [
            "제안하기: 'we should probably', 'how about'",
            "책임 분담: 'I can handle', 'would you mind'",
            "빈도 표현: 'regularly', 'once a week', 'every other day'"
          ]
        },
        {
          "title": "시나리오 2: 청소 서비스 예약",
          "setup": "Calling a cleaning service to book an appointment.",
          "dialogue": [
            // ... 실제 전화 대화
          ]
        }
      ]
    }
  },
  "assessment": {
    "preTest": [
      // ... 사전 테스트 5개
    ],
    "postTest": [
      // ... 사후 테스트 10개
    ],
    "masteryCheck": {
      "description": "모든 문제 90% 이상 정답 시 다음 단계 진행",
      "questions": [
        // ... 종합 평가 15개
      ]
    }
  },
  "resources": {
    "videos": [
      {
        "title": "British vs American: Cleaning Vocabulary",
        "url": "https://youtube.com/watch?v=...",
        "duration": "5:30",
        "topics": ["hoover vs vacuum", "bin vs trash can"]
      }
    ],
    "articles": [
      {
        "title": "The Etymology of Clean",
        "url": "https://etymonline.com/word/clean",
        "readingLevel": "intermediate"
      }
    ],
    "practiceTools": [
      {
        "name": "Anki Deck - Household Chores",
        "url": "/downloads/vocab_household_anki.apkg",
        "cards": 45
      }
    ]
  },
  "metadata": {
    "createdBy": "GPT-5 Thinking Mode",
    "createdAt": "2025-10-10",
    "reviewedBy": "Dr. Jane Smith (PhD Linguistics, Stanford)",
    "qualityScore": 95,
    "tags": ["vocabulary", "household", "daily-life", "verbs"],
    "prerequisites": ["basic-verbs", "present-tense"],
    "nextSteps": ["vocab_level2_week4", "grammar_present-perfect"]
  }
}
\`\`\`

# 추가 요구사항

1. **음성 파일 경로만 표시** (실제 파일은 나중에 TTS로 생성)
2. **모든 설명은 한국어로** (학습자 편의)
3. **예문은 영어 + 한국어 번역** (병기)
4. **최소 30분 분량** (예제 45개, 연습문제 20개, 심화 콘텐츠)
5. **"수학의 정석" 수준** (어원, 문화, 언어학적 깊이)

# 생성 시작!
```

---

## 🎯 프롬프트 2: 문법 학습 (Grammar)

```markdown
당신은 "영어의 정석" 브랜드의 언어학 박사입니다.
"수학의 정석"처럼 논문급 깊이의 문법 콘텐츠를 만들어주세요.

# 미션
Level 3, Week 5용 Grammar Activity 1개 생성
주제: "현재완료 vs 과거 시제 (Present Perfect vs Simple Past)"

# 품질 기준
1. **깊이**: 30분 학습 분량
2. **논문급**: 언어학적 설명 (Aspect, Tense 이론)
3. **구조**: 이론 → 비교 → 예제 → 연습 → 심화 → 실전
4. **시각화**: 타임라인, 다이어그램 설명 포함
5. **실수 분석**: 한국인 학습자가 자주 틀리는 부분 집중

# JSON 출력 형식

\`\`\`json
{
  "id": "grammar_level3_week5_001",
  "type": "grammar",
  "level": 3,
  "week": 5,
  "title": "Present Perfect vs Simple Past - 완벽 정복",
  "estimatedTime": 30,
  "objectives": [
    "Present Perfect의 4가지 용법 완전 이해",
    "한국어 '-었다'와의 차이 인식",
    "실전 대화에서 정확한 시제 선택"
  ],
  "content": {
    "linguisticFoundation": {
      "title": "언어학적 기초: Tense vs Aspect",
      "tenseDefinition": "Tense(시제)는 발화 시점 대비 사건의 시간적 위치를 나타냄. 영어는 과거/현재/미래 시제.",
      "aspectDefinition": "Aspect(상)는 사건의 내적 시간 구조. 영어는 simple/perfect/progressive aspect.",
      "keyInsight": "한국어는 Tense 중심, 영어는 Aspect도 중요 → 한국인의 혼란 원인",
      "visualAid": {
        "type": "timeline",
        "description": "타임라인으로 본 Present Perfect",
        "asciiArt": `
과거 ←─────────────┼─────────────→ 미래
              (현재 발화 시점)

Simple Past:
  [완료]────┼─────────────→
  (과거에 끝남, 현재와 단절)

Present Perfect:
  ????────┼─────────────→
  (과거 시작, 현재까지 영향)
        `
      }
    },
    "coreTheory": {
      "presentPerfect": {
        "structure": "have/has + past participle",
        "essence": "과거 사건이 현재에 영향을 미치거나 현재까지 계속됨",
        "fourUsages": [
          {
            "usage": "1. 경험 (Experience)",
            "formula": "have + p.p. (경험의 유무)",
            "keywords": ["ever", "never", "once", "twice", "several times"],
            "example": {
              "correct": "I have been to Paris twice.",
              "why": "과거 경험이 현재의 나를 구성 (지금도 '파리 다녀온 사람')",
              "korean": "나는 파리에 두 번 가본 적이 있다.",
              "incorrectKorean": "❌ 나는 파리에 두 번 갔다 (과거로 오해)",
              "timeline": "[과거1: 방문] [과거2: 방문] ─── [현재: 그 경험 보유]"
            },
            "contrastSimplePast": {
              "sentence": "I went to Paris in 2019.",
              "why": "특정 과거 시점 명시 → 현재와 단절",
              "korean": "나는 2019년에 파리에 갔다."
            }
          },
          {
            "usage": "2. 완료 (Completion)",
            "formula": "have + p.p. (방금 끝남, 결과 현재 존재)",
            "keywords": ["just", "already", "yet"],
            "example": {
              "correct": "I have just finished my homework.",
              "why": "방금 끝났고, 그 결과(숙제 완료 상태)가 현재 존재",
              "korean": "나는 방금 숙제를 끝냈다.",
              "resultState": "→ 현재 숙제가 완료된 상태",
              "timeline": "[과거: 끝남] ─── [현재: 완료 상태 유지]"
            }
          },
          {
            "usage": "3. 계속 (Duration)",
            "formula": "have + p.p. + for/since (과거부터 현재까지 계속)",
            "keywords": ["for (기간)", "since (시작점)"],
            "example": {
              "correct": "I have lived here for 10 years.",
              "why": "10년 전 시작 → 현재까지 계속 거주",
              "korean": "나는 여기 10년 동안 살아왔다.",
              "ongoing": "→ 지금도 살고 있음",
              "timeline": "[10년 전: 시작] ══════════ [현재: 계속 중]"
            },
            "contrastSimplePast": {
              "sentence": "I lived there for 10 years.",
              "why": "10년 살았지만 지금은 안 살음 (과거 완료)",
              "korean": "나는 거기 10년 살았다 (지금은 안 살음)."
            }
          },
          {
            "usage": "4. 최근 과거 (Recent Past, 미국식)",
            "formula": "have + p.p. (최근에 발생, 뉴스 보도)",
            "keywords": ["recently", "lately"],
            "example": {
              "correct": "The president has announced new policies.",
              "why": "최근 발표, 현재도 유효한 정책",
              "korean": "대통령이 새 정책을 발표했다.",
              "note": "영국: 최근이면 Present Perfect 필수, 미국: Simple Past도 OK"
            }
          }
        ]
      },
      "simplePast": {
        "structure": "verb + -ed (irregular: 불규칙)",
        "essence": "과거의 특정 시점에 발생하고 끝난 사건",
        "keyIndicators": ["yesterday", "last week", "in 2020", "ago"],
        "example": {
          "sentence": "I studied English yesterday.",
          "why": "어제라는 특정 과거 시점 → Simple Past",
          "korean": "나는 어제 영어를 공부했다.",
          "completed": "→ 어제 끝남, 현재와 무관"
        }
      }
    },
    "comparison": {
      "title": "핵심 비교: 언제 Present Perfect, 언제 Simple Past?",
      "decisionTree": {
        "question1": "과거 시점이 명시되었는가?",
        "yes": "→ Simple Past (yesterday, last year, in 2020 등)",
        "no": "→ Question 2로",
        "question2": "과거 사건이 현재와 관련 있는가?",
        "yes": "→ Present Perfect (경험, 완료, 계속, 최근)",
        "no": "→ Simple Past (완전히 끝난 과거)"
      },
      "examples": [
        {
          "situation": "언제 했는지 모름 / 중요하지 않음",
          "correct": "I have read this book.",
          "incorrect": "I read this book.",
          "why": "시점 불명 + 현재 영향 (책 내용 알고 있음) → Present Perfect"
        },
        {
          "situation": "언제 했는지 명확함",
          "correct": "I read this book last month.",
          "incorrect": "I have read this book last month.",
          "why": "last month (특정 과거) → Simple Past만 가능"
        },
        {
          "situation": "방금 전 (현재와 가까움)",
          "correctUS": "I just ate. (미국)",
          "correctUK": "I have just eaten. (영국)",
          "why": "미국: Simple Past도 OK, 영국: Present Perfect 선호"
        }
      ]
    },
    "koreanLearnerPitfalls": {
      "title": "한국인 학습자 빈출 오류",
      "errors": [
        {
          "errorType": "한국어 '-었다' → 무조건 Simple Past 오류",
          "wrong": "I went to Japan. (일본 다녀왔어 → 경험)",
          "correct": "I have been to Japan.",
          "explanation": "한국어 '-었다'는 영어 Simple Past + Present Perfect 모두 포함. 문맥 판단 필요."
        },
        {
          "errorType": "for/since → Simple Past 오류",
          "wrong": "I lived here for 10 years. (10년 살았어 → 지금도 살고 있음)",
          "correct": "I have lived here for 10 years.",
          "explanation": "for/since는 현재까지 계속 → Present Perfect 필수 (단, 지금은 안 살면 Simple Past)"
        },
        {
          "errorType": "과거 시점 명시 + Present Perfect 오류",
          "wrong": "I have finished my homework yesterday.",
          "correct": "I finished my homework yesterday.",
          "explanation": "yesterday → 특정 과거 → Simple Past만 가능"
        }
      ]
    },
    "exercises": [
      {
        "type": "choose_correct_tense",
        "question": "I _____ (see) this movie three times.",
        "options": ["saw", "have seen"],
        "correct": "have seen",
        "explanation": "three times (경험) + 시점 불명 → Present Perfect"
      },
      {
        "type": "error_correction",
        "sentence": "I have visited London last year.",
        "error": "have visited → visited",
        "explanation": "last year (특정 과거) → Simple Past"
      },
      {
        "type": "translation_korean_to_english",
        "korean": "나는 한 번도 일본에 가본 적이 없어.",
        "correct": "I have never been to Japan.",
        "commonMistake": "I never went to Japan.",
        "why": "경험 (never) → Present Perfect"
      },
      {
        "type": "contextual_choice",
        "scenario": "친구가 '점심 먹었어?' 물어봄. 방금 먹음.",
        "question": "어떻게 대답?",
        "options": [
          "Yes, I ate.",
          "Yes, I have eaten.",
          "Yes, I just ate.",
          "Yes, I have just eaten."
        ],
        "correctUS": "Yes, I just ate.",
        "correctUK": "Yes, I have just eaten.",
        "explanation": "미국: Simple Past 선호, 영국: Present Perfect"
      }
      // ... 총 25개 연습문제
    ],
    "deepDive": {
      "title": "심화: Aspect 이론과 언어 간 비교",
      "aspectTheory": {
        "perfectAspect": "사건을 외부에서 완료된 전체로 봄 (external perspective)",
        "progressiveAspect": "사건을 내부에서 진행 중으로 봄 (internal perspective)",
        "simpleAspect": "사건을 중립적으로 기술 (no specific viewpoint)"
      },
      "crossLinguistic": {
        "korean": "한국어는 Tense 중심, Aspect는 '-고 있다' 정도만 문법화",
        "japanese": "일본어는 た형 (과거/완료 혼용), Present Perfect 개념 약함",
        "chinese": "중국어는 了 (완료상), Tense 없고 Aspect만",
        "insight": "영어 Present Perfect는 유럽어(특히 게르만어) 특유 → 동아시아 학습자에게 어려움"
      }
    },
    "realWorldApplication": {
      "title": "실전 적용: 인터뷰 시나리오",
      "scenario": "Job Interview - Talking about your experience",
      "dialogue": [
        {
          "interviewer": "Tell me about your work experience.",
          "candidate": "I _____ (work) in marketing for 5 years.",
          "correctAnswer": "have worked",
          "why": "for 5 years (계속) + 지금까지 → Present Perfect"
        },
        {
          "interviewer": "What projects have you completed?",
          "candidate": "I _____ (complete) a major rebranding campaign last year.",
          "correctAnswer": "completed",
          "why": "last year (특정 과거) → Simple Past"
        },
        {
          "interviewer": "Have you ever managed a team?",
          "candidate": "Yes, I _____ (manage) a team of 10 people.",
          "correctAnswer": "have managed",
          "why": "경험 질문 (Have you ever) → Present Perfect로 답변"
        }
      ]
    }
  },
  "assessment": {
    "diagnosticTest": [
      // ... 사전 진단 10개
    ],
    "progressChecks": [
      // ... 중간 점검 15개
    ],
    "finalTest": [
      // ... 최종 평가 20개 (혼합 유형)
    ]
  },
  "metadata": {
    "createdBy": "GPT-5 Thinking Mode",
    "linguisticFramework": "Reichenbach's Tense Theory + Comrie's Aspect",
    "difficultyRating": 8.5,
    "commonErrorRate": 0.65,
    "masteryTime": "3-5 sessions"
  }
}
\`\`\`

# 생성 시작!
```

---

## 🎯 프롬프트 3: 듣기 학습 (Listening)

```markdown
당신은 "영어의 정석" 브랜드의 언어학 박사입니다.
논문급 깊이의 듣기 학습 콘텐츠를 만들어주세요.

# 미션
Level 4, Week 7용 Listening Activity 1개 생성
주제: "비즈니스 미팅 - 의견 제시와 반론"

# 품질 기준
1. **깊이**: 30분 학습 분량
2. **음성학**: 발음, 억양, 연음 현상 상세 설명
3. **구조**: 음성 스크립트 + 음운론 + 연습 + 심화
4. **난이도**: 자연스러운 원어민 속도 (150-180 wpm)
5. **실전**: 실제 비즈니스 상황 시뮬레이션

# JSON 출력 형식

\`\`\`json
{
  "id": "listening_level4_week7_001",
  "type": "listening",
  "level": 4,
  "week": 7,
  "title": "Business Meeting: Opinions & Counterarguments",
  "estimatedTime": 30,
  "audioFiles": {
    "main": "/audio/listening_l4w7_main.mp3",
    "slow": "/audio/listening_l4w7_slow.mp3",
    "segments": [
      "/audio/listening_l4w7_seg1.mp3",
      "/audio/listening_l4w7_seg2.mp3"
    ]
  },
  "content": {
    "scenario": {
      "title": "분기 마케팅 전략 회의",
      "participants": [
        {"name": "Sarah", "role": "Marketing Director", "accent": "American (General)"},
        {"name": "James", "role": "Sales Manager", "accent": "British (RP)"},
        {"name": "Akiko", "role": "Product Manager", "accent": "American (slight Japanese)"}
      ],
      "setting": "Zoom 화상회의 (배경 소음 약간)",
      "length": "3분 30초",
      "wpm": 165
    },
    "fullTranscript": {
      "paragraphs": [
        {
          "speaker": "Sarah",
          "text": "Alright, let's dive into Q3 marketing strategies. I've been thinking we should focus heavily on social media this quarter.",
          "timestamp": "0:00-0:08",
          "ipa": "/əˈraɪt, lɛts daɪv ˈɪntu kjuː θri ˈmɑrkətɪŋ ˈstrætəʤiz. aɪv bɪn ˈθɪŋkɪŋ wi ʃʊd ˈfoʊkəs ˈhɛvəli ɑn ˈsoʊʃəl ˈmidiə ðɪs ˈkwɔrtər/",
          "phoneticNotes": [
            "'let's dive' → /lɛts daɪv/ (연음 없음, 명확한 경계)",
            "'focus heavily' → /ˈfoʊkəs ˈhɛvəli/ (미국식 r 발음)",
            "'this quarter' → /ðɪs ˈkwɔrtər/ (r 강함)"
          ],
          "intonation": {
            "pattern": "Alright ↘, let's dive into Q3 marketing strategies ↗. I've been thinking → we should focus heavily on social media ↗ this quarter ↘.",
            "explanation": "Alright는 하강 (주제 전환), 첫 문장 끝은 상승 (리스트 시작), 마지막은 하강 (완결)"
          },
          "keyVocabulary": [
            {"word": "dive into", "meaning": "본격적으로 시작하다", "level": "informal business"},
            {"word": "heavily", "meaning": "집중적으로", "emphasis": "강세 필요"}
          ]
        },
        {
          "speaker": "James",
          "text": "Hmm, I'm not entirely convinced. Didn't we try that last year with limited success?",
          "timestamp": "0:09-0:14",
          "ipa": "/hm, aɪm nɒt ɪnˈtaɪəli kənˈvɪnst. ˈdɪdnt wi traɪ ðæt lɑːst jɪər wɪð ˈlɪmɪtɪd səkˈsɛs/",
          "phoneticNotes": [
            "'I'm not' → /aɪm nɒt/ (영국식: 짧은 o, 미국은 /nɑt/)",
            "'entirely' → /ɪnˈtaɪəli/ (영국식 r 묵음, 미국은 /ɪnˈtaɪɚli/)",
            "'didn't we' → /ˈdɪdnt wi/ (연음 약함)",
            "'last year' → /lɑːst jɪər/ (영국식 긴 a, 미국은 /læst jɪr/)"
          ],
          "intonation": {
            "pattern": "Hmm →, I'm not entirely convinced ↘. Didn't we try that last year ↗ with limited success ↘?",
            "explanation": "Hmm은 평탄 (생각), convinced는 하강 (확정적), 의문문은 상승-하강 (반문)"
          },
          "pragmatics": {
            "function": "polite disagreement",
            "strategies": [
              "'Hmm' (주저, 바로 반대 안 함)",
              "'I'm not entirely convinced' (강한 반대 아님)",
              "'Didn't we...?' (반문으로 간접 반대)"
            ],
            "cultural": "영국식 완곡어법 (indirect communication)"
          }
        }
        // ... 전체 대화 (3분 30초 분량)
      ]
    },
    "phonologicalAnalysis": {
      "title": "음운론적 특징 분석",
      "americanFeatures": [
        {
          "feature": "Rhoticity (r 발음)",
          "example": "quarter /ˈkwɔrtər/ - r 모두 발음",
          "contrast": "영국: /ˈkwɔːtə/ - 끝 r 묵음"
        },
        {
          "feature": "Flapping (t/d의 탄음화)",
          "example": "marketing /ˈmɑrkəɾɪŋ/ - t가 r처럼",
          "rule": "모음 사이 t/d → [ɾ] (빠른 r 소리)"
        }
      ],
      "britishFeatures": [
        {
          "feature": "Non-rhotic (r 탈락)",
          "example": "year /jɪə/ - r 묵음",
          "rule": "자음 앞, 단어 끝 r은 발음 안 함"
        },
        {
          "feature": "TRAP-BATH split",
          "example": "last /lɑːst/ - 길고 뒤쪽 a",
          "contrast": "미국: /læst/ - 짧고 앞쪽 a"
        }
      ],
      "connectedSpeech": [
        {
          "phenomenon": "Linking r",
          "example": "year is → /jɪər ɪz/ → /jɪəɹ‿ɪz/ (r 연결)",
          "rule": "단어 끝 r + 모음 → r 발음 부활"
        },
        {
          "phenomenon": "Assimilation (동화)",
          "example": "ten people → /tɛm ˈpipəl/ (n→m)",
          "rule": "n + p/b → m으로 변화"
        },
        {
          "phenomenon": "Elision (탈락)",
          "example": "next day → /nɛks deɪ/ (t 탈락)",
          "rule": "자음군 간소화"
        }
      ]
    },
    "listeningExercises": [
      {
        "type": "gist_listening",
        "instruction": "전체 대화를 듣고 주제 파악",
        "question": "What is the main topic of the meeting?",
        "options": [
          "Q3 marketing strategies",
          "Budget allocation",
          "Product launch timeline",
          "Team restructuring"
        ],
        "correct": "Q3 marketing strategies",
        "audioSegment": "main"
      },
      {
        "type": "detail_listening",
        "instruction": "Sarah의 제안을 정확히 파악",
        "question": "What does Sarah propose?",
        "options": [
          "Focus on TV advertising",
          "Focus heavily on social media",
          "Reduce marketing budget",
          "Hire more marketers"
        ],
        "correct": "Focus heavily on social media",
        "audioSegment": "seg1",
        "timestamp": "0:00-0:08"
      },
      {
        "type": "inference_listening",
        "instruction": "James의 태도 추론",
        "question": "What is James's attitude toward Sarah's idea?",
        "options": [
          "Strongly opposed",
          "Enthusiastically supportive",
          "Politely skeptical",
          "Completely indifferent"
        ],
        "correct": "Politely skeptical",
        "evidence": "'I'm not entirely convinced', 'Didn't we try...'",
        "pragmaticCues": "Hmm (주저), 완곡한 반대"
      },
      {
        "type": "phonetic_discrimination",
        "instruction": "Sarah와 James의 발음 차이 인식",
        "question": "'last year'를 Sarah(미국)와 James(영국)가 발음하면?",
        "options": [
          "Sarah: /læst jɪr/, James: /lɑːst jɪər/",
          "Sarah: /lɑːst jɪər/, James: /læst jɪr/",
          "Both same: /læst jɪr/",
          "Both same: /lɑːst jɪər/"
        ],
        "correct": "Sarah: /læst jɪr/, James: /lɑːst jɪər/",
        "explanation": "미국: 짧은 a + r 발음, 영국: 긴 a + r 묵음"
      },
      {
        "type": "dictation",
        "instruction": "받아쓰기 (빈칸 채우기)",
        "audio": "seg2",
        "sentence": "I _____ _____ _____ we should focus heavily on social media.",
        "correct": "I've been thinking",
        "commonMistakes": [
          "I been thinking (have 탈락)",
          "I've been think (thinking 미완성)"
        ]
      },
      {
        "type": "shadowing_practice",
        "instruction": "따라 말하기 (억양 정확히)",
        "target": "Alright, let's dive into Q3 marketing strategies.",
        "focusPoints": [
          "Alright 하강조",
          "strategies 끝 상승조",
          "자연스러운 속도 유지"
        ],
        "recordingEnabled": true
      }
      // ... 총 20개 이상 듣기 연습
    ],
    "deepDive": {
      "title": "심화: 비즈니스 영어 의사소통 전략",
      "disagreementStrategies": [
        {
          "level": "Direct (직접적)",
          "example": "I disagree.",
          "appropriateness": "매우 친한 동료, 비공식",
          "risk": "무례하게 들릴 수 있음"
        },
        {
          "level": "Moderate (보통)",
          "example": "I see your point, but...",
          "appropriateness": "일반적 회의",
          "structure": "긍정 + but + 자기 의견"
        },
        {
          "level": "Indirect (간접적)",
          "example": "I'm not entirely convinced...",
          "appropriateness": "상사, 고객, 공식 석상",
          "structure": "완곡한 표현 + 이유"
        },
        {
          "level": "Question-based (질문형)",
          "example": "Have we considered...?",
          "appropriateness": "가장 안전",
          "effect": "반대가 아닌 '추가 아이디어'처럼 들림"
        }
      ],
      "culturalNotes": {
        "american": "직접적 의사소통 선호, but 빠르게 반박",
        "british": "간접적, 완곡어법 선호 (understatement)",
        "asian": "매우 간접적, 침묵도 반대 신호",
        "advice": "글로벌 회의에서는 Moderate level이 안전"
      }
    }
  },
  "assessment": {
    "comprehensionQuiz": [
      // ... 이해도 평가 15개
    ],
    "phoneticTest": [
      // ... 발음 인식 테스트 10개
    ]
  },
  "metadata": {
    "createdBy": "GPT-5 Thinking Mode",
    "audioGeneration": "TTS 추후 생성 (Google Cloud TTS, 다중 액센트)",
    "ipaNotation": "International Phonetic Alphabet",
    "difficultyRating": 8.0
  }
}
\`\`\`

# 생성 시작!
```

---

## 🎯 프롬프트 4-6 (말하기, 읽기, 쓰기)

나머지 3가지 타입(Speaking, Reading, Writing)도 동일한 구조로 프롬프트를 만들 수 있습니다.

각 프롬프트는:
- ✅ **30분 분량** (깊이)
- ✅ **논문급 설명** (어원, 언어학, 문화)
- ✅ **45개 예제 + 20개 연습** (양)
- ✅ **한국인 특화** (빈출 오류 분석)
- ✅ **실전 시나리오** (롤플레이, 실전 적용)

---

## 📊 사용 워크플로우

### Step 1: 배치 생성 (Week 1-2)

```bash
GPT-5에 프롬프트 6개 × 8주 = 48번 실행
→ 48개 JSON 파일 생성
→ /data/activities/ 폴더에 저장
```

### Step 2: 품질 검증 (Week 3-4)

```markdown
**검증 프롬프트** (GPT-5에 다시 입력):

당신은 언어학 박사입니다. 다음 JSON을 검토하고 품질 점수를 주세요.

[생성된 JSON 붙여넣기]

# 평가 기준
1. 깊이 (30분 분량인가?)
2. 정확성 (언어학적 오류 없는가?)
3. 실용성 (실전에서 쓸 수 있는가?)
4. 한국인 적합성 (한국인 학습자 고려했는가?)

# 출력
- 점수: /100
- 문제점: (리스트)
- 개선 제안: (구체적)
```

### Step 3: 개선 Iteration (Week 5-8)

점수 < 90점인 콘텐츠만 GPT-5에 다시 요청:

```markdown
다음 JSON을 개선해주세요.

[원본 JSON]

# 개선 요청사항
- [검증 단계에서 나온 문제점]
- [개선 제안]

# 목표
- 점수 95점 이상
- "수학의 정석" 수준 달성
```

---

## 💰 비용 비교

| 항목 | API 방식 | GPT-5 Pro 방식 |
|------|---------|----------------|
| **콘텐츠 생성** | GPT-4 API $500 | $0 (무료) |
| **AI 대화** | 실시간 API $1,000 | 미리 생성 $0 |
| **품질** | 70% | 90% (Thinking 모드) |
| **속도** | 자동 (빠름) | 수동 (느림) |
| **커스터마이징** | 제한적 | 무제한 |
| **총 비용** | $1,500 | $0 |

---

## 🎯 실행 계획 조정

### 새 로드맵 (GPT-5 Pro 활용)

```yaml
Week 1-2: GPT-5로 48개 JSON 배치 생성
  - 사용자가 GPT-5에 프롬프트 48번 입력
  - 생성된 JSON을 프로젝트에 저장
  - 예상 시간: 16시간 (48개 × 20분)

Week 3-4: 품질 검증 & 개선
  - GPT-5로 자동 검증 (점수 부여)
  - 90점 미만 → 개선 요청
  - 예상 시간: 8시간

Week 5-8: 전문가 최종 감수
  - 언어학 박사가 핵심 10개만 검토
  - 나머지는 GPT-5 검증으로 충분
  - 비용: $400 (기존 $2,400 대비 83% 절감)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
총 절감: $1,500 (API) + $2,000 (전문가) = $3,500
새 ROI: ($45,000 - $15,500) / $15,500 = 290% ✨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## ✅ 다음 단계

<function_calls>
<invoke name="TodoWrite">
<parameter name="todos">[{"content": "GPT-5 \ucf58\ud150\uce20 \uc0dd\uc131 \ud504\ub86c\ud504\ud2b8 \uc2dc\uc2a4\ud15c \uc124\uacc4", "activeForm": "GPT-5 \ucf58\ud150\uce20 \uc0dd\uc131 \ud504\ub86c\ud504\ud2b8 \uc2dc\uc2a4\ud15c \uc124\uacc4 \uc911", "status": "completed"}, {"content": "GPT5_PROMPTS.md \ubb38\uc11c \ud655\uc778 \ubc0f \uc0ac\uc6a9 \uc900\ub9ac", "activeForm": "GPT5_PROMPTS.md \ubb38\uc11c \ud655\uc778 \ubc0f \uc0ac\uc6a9 \uc900\ub9ac \uc911", "status": "in_progress"}, {"content": "MASTER_PLAN_v2.md \uc5c5\ub370\uc774\ud2b8 (GPT-5 \uc804\ub7b5 \ubc18\uc601)", "activeForm": "MASTER_PLAN_v2.md \uc5c5\ub370\uc774\ud2b8 \uc911 (GPT-5 \uc804\ub7b5 \ubc18\uc601)", "status": "pending"}, {"content": "state.json \uc5c5\ub370\uc774\ud2b8 - \uc0c8 \ube44\uc6a9 \uad6c\uc870 \ubc18\uc601", "activeForm": "state.json \uc5c5\ub370\uc774\ud2b8 \uc911 - \uc0c8 \ube44\uc6a9 \uad6c\uc870 \ubc18\uc601", "status": "pending"}]