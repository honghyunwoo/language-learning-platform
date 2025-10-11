# Phase 1-2: Elite Track 예문 개선

**시작일**: 2025-01-11
**목표**: Week 9-16 vocabulary 예문 중복 패턴 제거, 실제 맥락 반영

---

## 🎯 문제 분석

**발견된 문제**:
- Week 9-16 vocabulary 파일의 모든 예문이 동일한 템플릿 사용
- 예: "We should operationalize the '{word}' metrics..."
- 15개 단어 × 3개 예문 × 8주 = 360개 문장이 템플릿화

**개선 방향**:
1. 각 단어의 실제 사용 맥락 반영
2. 다양한 문장 구조
3. 비즈니스/일상/학술 다양한 레지스터

---

## ✅ 개선된 예문 (Week 9 - 비즈니스 전화·메시지 어휘)

### agenda
**기존** (템플릿):
- "We should operationalize the 'agenda' metrics..."
- "The board mandated stricter 'agenda' thresholds..."

**개선** (실제 맥락):
```json
{
  "level": "intermediate",
  "sentence": "Let's review the meeting agenda before we start.",
  "translation": "시작하기 전에 회의 안건을 검토합시다.",
  "notes": "회의 준비 맥락"
},
{
  "level": "advanced",
  "sentence": "The committee set a clear agenda for digital transformation.",
  "translation": "위원회가 디지털 전환을 위한 명확한 의제를 설정했다.",
  "notes": "조직 전략"
},
{
  "level": "expert",
  "sentence": "His hidden agenda became apparent during the negotiations.",
  "translation": "그의 숨은 의도가 협상 중에 명백해졌다.",
  "notes": "은유적 사용 (숨은 의도)"
}
```

### follow-up
**개선**:
```json
{
  "level": "intermediate",
  "sentence": "I'll send a follow-up email after our call.",
  "translation": "통화 후 후속 이메일을 보내겠습니다.",
  "notes": "업무 커뮤니케이션"
},
{
  "level": "advanced",
  "sentence": "The follow-up meeting revealed several implementation challenges.",
  "translation": "후속 회의에서 여러 구현 과제가 드러났다.",
  "notes": "프로젝트 관리"
},
{
  "level": "expert",
  "sentence": "Consistent follow-up is critical for client retention.",
  "translation": "일관된 후속 조치는 고객 유지에 매우 중요하다.",
  "notes": "비즈니스 원칙"
}
```

### escalate
**개선**:
```json
{
  "level": "intermediate",
  "sentence": "Please escalate this issue to your manager.",
  "translation": "이 문제를 상사에게 올려주세요.",
  "notes": "문제 해결 프로세스"
},
{
  "level": "advanced",
  "sentence": "The conflict quickly escalated into a legal dispute.",
  "translation": "갈등이 빠르게 법적 분쟁으로 확대되었다.",
  "notes": "상황 악화"
},
{
  "level": "expert",
  "sentence": "We established clear escalation pathways for critical incidents.",
  "translation": "우리는 중대 사건에 대한 명확한 단계적 대응 경로를 수립했다.",
  "notes": "위기 관리 체계"
}
```

### voicemail
**개선**:
```json
{
  "level": "intermediate",
  "sentence": "Please leave a voicemail and I'll get back to you.",
  "translation": "음성 메시지를 남겨주시면 연락드리겠습니다.",
  "notes": "전화 응대"
},
{
  "level": "advanced",
  "sentence": "Her voicemail indicated she would be out of office until Monday.",
  "translation": "그녀의 음성 메시지는 월요일까지 부재중임을 알렸다.",
  "notes": "업무 부재 안내"
},
{
  "level": "expert",
  "sentence": "Professional voicemail greetings can significantly impact client perception.",
  "translation": "전문적인 음성 메시지 인사말은 고객 인식에 상당한 영향을 미칠 수 있다.",
  "notes": "비즈니스 커뮤니케이션 전략"
}
```

### touch base
**개선**:
```json
{
  "level": "intermediate",
  "sentence": "Let's touch base next week to discuss progress.",
  "translation": "다음 주에 진행 상황을 논의하기 위해 연락합시다.",
  "notes": "비공식 회의 제안"
},
{
  "level": "advanced",
  "sentence": "I wanted to touch base regarding the Q3 projections.",
  "translation": "3분기 전망에 관해 의견을 나누고 싶었습니다.",
  "notes": "업무 확인"
},
{
  "level": "expert",
  "sentence": "Regular touchpoints help maintain alignment across distributed teams.",
  "translation": "정기적인 접촉은 분산된 팀 간 정렬을 유지하는 데 도움이 된다.",
  "notes": "팀 관리 전략"
}
```

---

## 🔄 작업 계획

### Option A: 수동 개선 (품질 최고)
- 15개 단어 × 8주 = 120개 파일
- 각 파일 15-45개 예문
- 예상 시간: 10-15시간

### Option B: GPT-5 재생성 (추천)
- 프롬프트 작성하여 사용자에게 전달
- GPT-5로 개선된 예문 생성
- 검증 및 적용: 2-3시간

### Option C: 핵심만 개선 (현실적)
- Week 9-10만 수동 개선 (샘플)
- Week 11-16은 현재 상태 유지
- 점진적 개선: 3-4시간

**선택**: Option C 추천 (상용화 우선)

---

## 💡 다음 단계

1. Week 9 vocabulary 파일 개선 적용
2. Elite Track 배포 스크립트 실행
3. Dashboard UI 통합
4. 나머지 Week는 사용자 피드백 후 개선
