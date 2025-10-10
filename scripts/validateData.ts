/**
 * 데이터 검증 스크립트
 * JSON 파일의 형식과 내용을 검증
 */

// TypeScript 타입 정의
export interface VocabularyWord {
  word: string;
  pronunciation: string; // IPA format
  partOfSpeech: string;
  koreanMeaning: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  examples: {
    sentence: string;
    translation: string;
    situation: string;
  }[];
}

export interface DialogueData {
  id: string;
  level: string;
  title: string;
  situation: string;
  duration: string;
  speakers: string[];
  dialogue: {
    speaker: string;
    text: string;
    translation: string;
    notes?: string;
  }[];
  vocabulary?: {
    word: string;
    meaning: string;
  }[];
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

export interface ConversationTurn {
  turnNumber: number;
  speaker: 'npc' | 'user';
  npcName?: string;
  text: string;
  translation?: string;
  options?: {
    id: string;
    text: string;
    translation: string;
    naturalness: number;
    feedback: string;
    culturalTip?: string;
    improvement?: string;
    explanation?: string;
    correctForm?: string;
    points: number;
    nextTurn: number;
  }[];
}

export interface ConversationScenario {
  id: string;
  title: string;
  scenario: string;
  level: string;
  estimatedTime: string;
  turns: ConversationTurn[];
}

export interface GrammarQuestion {
  id: string;
  level: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: {
    korean: string;
    english: string;
    rule: string;
  };
  difficulty: 1 | 2 | 3 | 4 | 5;
}

/**
 * 데이터 검증 함수들
 */
export const DataValidator = {
  /**
   * Vocabulary 데이터 검증
   */
  vocabulary: (data: VocabularyWord[]): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!Array.isArray(data)) {
      errors.push('Data must be an array');
      return { valid: false, errors };
    }

    data.forEach((word, index) => {
      // 필수 필드 체크
      if (!word.word) {
        errors.push(`[${index}] Missing 'word' field`);
      }

      if (!word.pronunciation) {
        errors.push(`[${index}] Missing 'pronunciation' field`);
      } else if (!word.pronunciation.match(/^\/.*\/$/)) {
        errors.push(`[${index}] Pronunciation must be in IPA format: /.../ (got: ${word.pronunciation})`);
      }

      if (!word.koreanMeaning) {
        errors.push(`[${index}] Missing 'koreanMeaning' field`);
      }

      if (!word.partOfSpeech) {
        errors.push(`[${index}] Missing 'partOfSpeech' field`);
      }

      // 난이도 검증
      if (word.difficulty === undefined) {
        errors.push(`[${index}] Missing 'difficulty' field`);
      } else if (word.difficulty < 1 || word.difficulty > 5) {
        errors.push(`[${index}] Difficulty must be between 1-5 (got: ${word.difficulty})`);
      }

      // 예문 검증
      if (!word.examples || !Array.isArray(word.examples)) {
        errors.push(`[${index}] Missing 'examples' array`);
      } else if (word.examples.length !== 3) {
        errors.push(`[${index}] Must have exactly 3 examples (got: ${word.examples.length})`);
      } else {
        word.examples.forEach((ex, i) => {
          if (!ex.sentence) {
            errors.push(`[${index}.examples[${i}]] Missing 'sentence' field`);
          }
          if (!ex.translation) {
            errors.push(`[${index}.examples[${i}]] Missing 'translation' field`);
          }
          if (!ex.situation) {
            errors.push(`[${index}.examples[${i}]] Missing 'situation' field`);
          }
        });
      }
    });

    return { valid: errors.length === 0, errors };
  },

  /**
   * Dialogue 데이터 검증
   */
  dialogue: (data: DialogueData): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // 필수 필드
    if (!data.id) errors.push('Missing dialogue ID');
    if (!data.title) errors.push('Missing dialogue title');
    if (!data.level) errors.push('Missing level');
    if (!data.situation) errors.push('Missing situation description');

    // 대화 검증
    if (!data.dialogue || !Array.isArray(data.dialogue)) {
      errors.push('Missing dialogue array');
    } else if (data.dialogue.length < 3) {
      errors.push(`Dialogue must have at least 3 turns (got: ${data.dialogue.length})`);
    } else {
      data.dialogue.forEach((turn, i) => {
        if (!turn.speaker) {
          errors.push(`[Turn ${i}] Missing speaker`);
        }
        if (!turn.text) {
          errors.push(`[Turn ${i}] Missing text`);
        }
        if (!turn.translation) {
          errors.push(`[Turn ${i}] Missing Korean translation`);
        }
      });
    }

    // 질문 검증
    if (!data.questions || !Array.isArray(data.questions)) {
      errors.push('Missing questions array');
    } else if (data.questions.length < 2) {
      errors.push(`Must have at least 2 comprehension questions (got: ${data.questions.length})`);
    } else {
      data.questions.forEach((q, i) => {
        if (!q.question) {
          errors.push(`[Question ${i}] Missing question text`);
        }
        if (!q.options || q.options.length !== 4) {
          errors.push(`[Question ${i}] Must have exactly 4 options`);
        }
        if (q.correctAnswer === undefined || q.correctAnswer < 0 || q.correctAnswer > 3) {
          errors.push(`[Question ${i}] correctAnswer must be 0-3`);
        }
        if (!q.explanation) {
          errors.push(`[Question ${i}] Missing explanation`);
        }
      });
    }

    return { valid: errors.length === 0, errors };
  },

  /**
   * Conversation Simulation 검증
   */
  conversationSimulation: (data: ConversationScenario): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!data.id) errors.push('Missing conversation ID');
    if (!data.title) errors.push('Missing title');
    if (!data.scenario) errors.push('Missing scenario description');
    if (!data.level) errors.push('Missing level');

    if (!data.turns || !Array.isArray(data.turns)) {
      errors.push('Missing turns array');
      return { valid: false, errors };
    }

    if (data.turns.length < 6 || data.turns.length > 8) {
      errors.push(`Conversation should have 6-8 turns (got: ${data.turns.length})`);
    }

    data.turns.forEach((turn, i) => {
      if (turn.turnNumber === undefined) {
        errors.push(`[Turn ${i}] Missing turn number`);
      }

      if (!turn.speaker) {
        errors.push(`[Turn ${i}] Missing speaker`);
      }

      if (!turn.text) {
        errors.push(`[Turn ${i}] Missing text`);
      }

      // NPC 턴인 경우
      if (turn.speaker === 'npc') {
        if (!turn.npcName) {
          errors.push(`[Turn ${i}] NPC turn missing npcName`);
        }
      }

      // User 턴인 경우 (선택지 필요)
      if (turn.speaker === 'user' || turn.options) {
        if (!turn.options || !Array.isArray(turn.options)) {
          errors.push(`[Turn ${i}] User turn missing options array`);
        } else if (turn.options.length !== 3) {
          errors.push(`[Turn ${i}] Must have exactly 3 options (got: ${turn.options.length})`);
        } else {
          turn.options.forEach((opt, j) => {
            if (!opt.id) {
              errors.push(`[Turn ${i}, Option ${j}] Missing option ID`);
            }
            if (!opt.text) {
              errors.push(`[Turn ${i}, Option ${j}] Missing option text`);
            }
            if (!opt.feedback) {
              errors.push(`[Turn ${i}, Option ${j}] Missing feedback`);
            }
            if (opt.naturalness === undefined) {
              errors.push(`[Turn ${i}, Option ${j}] Missing naturalness score`);
            }
            if (opt.points === undefined) {
              errors.push(`[Turn ${i}, Option ${j}] Missing points`);
            } else {
              const validPoints = [20, 14, 6];
              if (!validPoints.includes(opt.points)) {
                errors.push(`[Turn ${i}, Option ${j}] Points must be 20, 14, or 6 (got: ${opt.points})`);
              }
            }
          });
        }
      }
    });

    return { valid: errors.length === 0, errors };
  },

  /**
   * Grammar Question 검증
   */
  grammarQuestion: (data: GrammarQuestion[]): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!Array.isArray(data)) {
      errors.push('Data must be an array');
      return { valid: false, errors };
    }

    data.forEach((q, index) => {
      if (!q.id) errors.push(`[${index}] Missing ID`);
      if (!q.level) errors.push(`[${index}] Missing level`);
      if (!q.topic) errors.push(`[${index}] Missing topic`);
      if (!q.question) errors.push(`[${index}] Missing question text`);

      if (!q.options || q.options.length !== 4) {
        errors.push(`[${index}] Must have exactly 4 options`);
      }

      if (q.correctAnswer === undefined || q.correctAnswer < 0 || q.correctAnswer > 3) {
        errors.push(`[${index}] correctAnswer must be 0-3`);
      }

      if (!q.explanation) {
        errors.push(`[${index}] Missing explanation object`);
      } else {
        if (!q.explanation.korean) {
          errors.push(`[${index}] Missing Korean explanation`);
        }
        if (!q.explanation.english) {
          errors.push(`[${index}] Missing English explanation`);
        }
        if (!q.explanation.rule) {
          errors.push(`[${index}] Missing grammar rule`);
        }
      }

      if (q.difficulty === undefined || q.difficulty < 1 || q.difficulty > 5) {
        errors.push(`[${index}] Difficulty must be 1-5`);
      }
    });

    return { valid: errors.length === 0, errors };
  }
};

/**
 * 파일 검증 함수
 */
export const validateFile = async (filePath: string, type: string) => {
  try {
    // 파일 읽기 (Node.js 환경)
    const data = await import(filePath);

    let result: { valid: boolean; errors: string[] };

    switch (type) {
      case 'vocabulary':
        result = DataValidator.vocabulary(data.default || data);
        break;
      case 'dialogue':
        result = DataValidator.dialogue(data.default || data);
        break;
      case 'conversation':
        result = DataValidator.conversationSimulation(data.default || data);
        break;
      case 'grammar':
        result = DataValidator.grammarQuestion(data.default || data);
        break;
      default:
        throw new Error(`Unknown type: ${type}`);
    }

    if (!result.valid) {
      console.error(`❌ Validation failed for ${filePath}:`);
      result.errors.forEach(err => console.error(`  - ${err}`));
      return false;
    }

    console.log(`✅ Validation passed for ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error validating ${filePath}:`, error);
    return false;
  }
};

/**
 * 사용 예시
 */
if (require.main === module) {
  // CLI 사용
  const args = process.argv.slice(2);
  const [filePath, type] = args;

  if (!filePath || !type) {
    console.error('Usage: node validateData.js <file-path> <type>');
    console.error('Types: vocabulary, dialogue, conversation, grammar');
    process.exit(1);
  }

  validateFile(filePath, type).then(valid => {
    process.exit(valid ? 0 : 1);
  });
}
