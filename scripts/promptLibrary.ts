/**
 * AI 프롬프트 라이브러리
 * 콘텐츠 제작을 위한 재사용 가능한 프롬프트 템플릿
 */

export const PromptTemplates = {
  /**
   * Vocabulary 생성 프롬프트
   */
  vocabulary: {
    generate: (level: string, topic: string, count: number = 20) => `
Create a JSON array of ${count} ${level}-level English vocabulary words for "${topic}".

Requirements:
- Include fields: word, pronunciation (IPA), partOfSpeech, koreanMeaning, difficulty (1-5)
- Provide 3 real-life example sentences per word with Korean translations
- Include situational context (e.g., "at a cafe", "at work")
- Words should be practical and commonly used
- Ensure difficulty matches ${level} level

Format:
[
  {
    "word": "hello",
    "pronunciation": "/həˈloʊ/",
    "partOfSpeech": "interjection",
    "koreanMeaning": "안녕하세요",
    "difficulty": 1,
    "examples": [
      {
        "sentence": "Hello! How are you?",
        "translation": "안녕하세요! 어떻게 지내세요?",
        "situation": "meeting a friend"
      },
      {
        "sentence": "Hello, my name is John.",
        "translation": "안녕하세요, 제 이름은 John입니다.",
        "situation": "first introduction"
      },
      {
        "sentence": "Hello? Is anyone there?",
        "translation": "여보세요? 누구 있나요?",
        "situation": "phone call"
      }
    ]
  }
]

Please provide exactly ${count} words.
`,

    validate: (level: string) => `
Review this vocabulary list for ${level} learners.

Check:
1. Are all words appropriate for this level?
2. Are example sentences natural and practical?
3. Are Korean translations accurate?
4. Are IPA pronunciations correct?
5. Any cultural notes needed?

Provide feedback and suggestions for improvements.
`
  },

  /**
   * Dialogue 생성 프롬프트
   */
  dialogue: {
    generate: (situation: string, level: string, turns: number = 5) => `
Create a natural English dialogue for ${level} learners in this situation: "${situation}".

Requirements:
- ${turns} conversational turns (back and forth)
- Natural, contemporary English (how native speakers actually talk)
- Include Korean translations for each line
- Add 2-3 comprehension questions
- Mark difficult vocabulary with notes
- Appropriate length for ${level} level

Format:
{
  "id": "listening-${level.toLowerCase()}-001",
  "level": "${level}",
  "title": "...",
  "situation": "...",
  "duration": "... seconds",
  "speakers": ["Speaker1", "Speaker2"],
  "dialogue": [
    {
      "speaker": "Speaker1",
      "text": "...",
      "translation": "...",
      "notes": "optional notes about difficult words or cultural context"
    }
  ],
  "vocabulary": [
    {
      "word": "...",
      "meaning": "..."
    }
  ],
  "questions": [
    {
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "correctAnswer": 0,
      "explanation": "..."
    }
  ]
}
`,

    refine: (dialogue: string) => `
Review and improve this English dialogue:

${dialogue}

Please:
1. Check if it sounds natural (how native speakers actually talk)
2. Verify Korean translations are accurate
3. Suggest more natural alternatives if needed
4. Add cultural notes where helpful
5. Ensure appropriate difficulty level

Provide the improved version.
`
  },

  /**
   * Conversation Simulation 생성 프롬프트
   */
  conversationSimulation: {
    generate: (scenario: string, level: string) => `
Create a branching conversation simulation for ${level} learners: "${scenario}".

Requirements:
- 6-8 conversational turns
- For EACH turn, provide exactly 3 response options:
  1. Perfect (100% natural, what native speakers would say)
  2. Okay (grammatically correct but slightly awkward or less natural)
  3. Wrong (unnatural, rude, or inappropriate)
- Detailed feedback for each option explaining WHY it's rated that way
- Cultural tips where relevant
- Points: Perfect (20), Okay (14), Wrong (6)

Format:
{
  "id": "conversation-${level.toLowerCase()}-...",
  "title": "...",
  "scenario": "...",
  "level": "${level}",
  "estimatedTime": "5-7 minutes",
  "turns": [
    {
      "turnNumber": 1,
      "speaker": "npc",
      "npcName": "...",
      "text": "...",
      "translation": "...",
      "options": [
        {
          "id": "perfect",
          "text": "...",
          "translation": "...",
          "naturalness": 100,
          "feedback": "✅ Perfect! This is exactly how native speakers say it...",
          "culturalTip": "optional cultural insight",
          "points": 20,
          "nextTurn": 2
        },
        {
          "id": "okay",
          "text": "...",
          "translation": "...",
          "naturalness": 70,
          "feedback": "⚠️ This works, but native speakers usually say...",
          "improvement": "Try using ... instead of ...",
          "points": 14,
          "nextTurn": 2
        },
        {
          "id": "wrong",
          "text": "...",
          "translation": "...",
          "naturalness": 30,
          "feedback": "❌ This sounds awkward/rude because...",
          "explanation": "why it's wrong",
          "correctForm": "You should say...",
          "points": 6,
          "nextTurn": 2
        }
      ]
    }
  ]
}
`,

    expand: (scenario: string, currentTurns: number) => `
Expand this conversation simulation with ${currentTurns + 2} more turns:

Current scenario: ${scenario}

Continue the conversation naturally and provide:
- 3 options per turn (perfect/okay/wrong)
- Detailed feedback for each
- Natural progression of the conversation
- Cultural tips where appropriate
`
  },

  /**
   * Grammar Explanation 프롬프트
   */
  grammar: {
    generateExplanation: (topic: string, level: string) => `
Explain this grammar topic for ${level} learners: "${topic}".

Requirements:
- Simple, clear Korean explanation (avoid technical jargon)
- 5-7 example sentences with Korean translations
- Common mistakes Korean learners make
- Practice exercises (5 questions with answers)
- Real-life usage tips

Format:
{
  "topic": "${topic}",
  "level": "${level}",
  "explanation": {
    "korean": "...",
    "english": "..."
  },
  "rules": [
    "Rule 1...",
    "Rule 2..."
  ],
  "examples": [
    {
      "sentence": "...",
      "translation": "...",
      "notes": "when to use this"
    }
  ],
  "commonMistakes": [
    {
      "wrong": "...",
      "right": "...",
      "explanation": "..."
    }
  ],
  "exercises": [
    {
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "correctAnswer": 0,
      "explanation": "..."
    }
  ]
}
`,

    generateQuestions: (topic: string, level: string, count: number = 5) => `
Create ${count} multiple-choice grammar questions for ${level} learners on "${topic}".

Requirements:
- Focus on ${topic}
- Include common mistakes Korean learners make
- Provide clear Korean explanations
- Mix difficulty within ${level} range

Format:
[
  {
    "id": "grammar-${level.toLowerCase()}-001",
    "topic": "${topic}",
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "correctAnswer": 0,
    "explanation": {
      "korean": "...",
      "english": "...",
      "rule": "..."
    },
    "difficulty": 1-5
  }
]
`
  },

  /**
   * Reading Passage 생성 프롬프트
   */
  reading: {
    generate: (topic: string, level: string, wordCount: number = 100) => `
Create a reading passage for ${level} learners about "${topic}".

Requirements:
- ${wordCount} words (±20)
- Appropriate vocabulary for ${level}
- Natural, engaging content
- 3 comprehension questions (multiple choice)
- Vocabulary list (5-10 words with Korean meanings)

Format:
{
  "id": "reading-${level.toLowerCase()}-...",
  "title": "...",
  "level": "${level}",
  "topic": "${topic}",
  "wordCount": ${wordCount},
  "text": "...",
  "translation": "...",
  "vocabulary": [
    {
      "word": "...",
      "meaning": "...",
      "context": "sentence from the passage"
    }
  ],
  "questions": [
    {
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "correctAnswer": 0,
      "explanation": "..."
    }
  ]
}
`
  },

  /**
   * Writing Prompt 생성
   */
  writing: {
    generatePrompt: (topic: string, level: string) => `
Create a writing prompt for ${level} learners on "${topic}".

Requirements:
- Clear instructions in Korean
- Step-by-step guide (3-5 steps)
- 3-5 example responses of varying quality
- Checklist for self-evaluation
- Useful phrases (5-10)

Format:
{
  "id": "writing-${level.toLowerCase()}-...",
  "title": "...",
  "level": "${level}",
  "topic": "${topic}",
  "instructions": {
    "korean": "...",
    "english": "..."
  },
  "steps": [
    {
      "number": 1,
      "title": "...",
      "guide": "...",
      "example": "..."
    }
  ],
  "usefulPhrases": [
    {
      "phrase": "...",
      "translation": "...",
      "usage": "when to use"
    }
  ],
  "exampleResponses": [
    {
      "level": "excellent",
      "text": "...",
      "notes": "why this is good"
    }
  ],
  "checklist": [
    "Did you include...?",
    "Did you check...?"
  ]
}
`
  }
};

/**
 * 사용 예시
 */
export const exampleUsage = {
  // Vocabulary 생성
  generateA1Vocabulary: () => {
    const prompt = PromptTemplates.vocabulary.generate('A1', 'Greetings and Self-Introduction', 20);
    console.log('Copy this to ChatGPT/Claude:');
    console.log(prompt);
  },

  // Dialogue 생성
  generateCafeDialogue: () => {
    const prompt = PromptTemplates.dialogue.generate('Ordering coffee at Starbucks', 'A1', 5);
    console.log(prompt);
  },

  // Conversation Simulation 생성
  generateCafeSimulation: () => {
    const prompt = PromptTemplates.conversationSimulation.generate('Ordering coffee at a cafe', 'A1');
    console.log(prompt);
  }
};
