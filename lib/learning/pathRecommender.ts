/**
 * Learning Path Recommender - AI 맞춤 학습 경로 추천
 * 영어의 정석 - 개인화된 학습 경로 생성
 */

import { CEFRLevel, ActivityType } from '@/lib/types/activity';
import { getCEFRLevel, getNextLevel, CEFR_LEVELS } from '@/lib/cefr/levels';

// ===== 학습 목표 타입 =====
export type LearningGoal = 'general' | 'business' | 'academic' | 'travel' | 'exam';
export type Specialization = 'business' | 'legal' | 'medical' | 'none';
export type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'reading-writing';

// ===== 사용자 프로필 =====
export interface UserLearningProfile {
  userId: string;
  currentLevel: CEFRLevel;
  goal: LearningGoal;
  specialization: Specialization;
  learningStyle: LearningStyle;
  weeklyHours: number; // 주당 학습 가능 시간
  strengths: ActivityType[]; // 강점 활동
  weaknesses: ActivityType[]; // 약점 활동
  preferences: {
    preferredTime?: 'morning' | 'afternoon' | 'evening' | 'night';
    skipWeekends?: boolean;
    intensiveMode?: boolean; // 집중 학습 모드
  };
}

// ===== 학습 경로 =====
export interface LearningPath {
  id: string;
  userId: string;
  startLevel: CEFRLevel;
  targetLevel: CEFRLevel;
  estimatedWeeks: number;
  activities: LearningActivity[];
  milestones: Milestone[];
  createdAt: Date;
}

export interface LearningActivity {
  weekNumber: number;
  dayNumber: number;
  activityType: ActivityType;
  activityId: string;
  estimatedTime: number; // minutes
  priority: 'high' | 'medium' | 'low';
  reason: string; // 추천 이유
}

export interface Milestone {
  weekNumber: number;
  title: string;
  description: string;
  assessmentRequired: boolean;
}

// ===== 추천 엔진 =====
export class LearningPathRecommender {
  private profile: UserLearningProfile;

  constructor(profile: UserLearningProfile) {
    this.profile = profile;
  }

  // ===== 메인: 맞춤 학습 경로 생성 =====
  generatePath(): LearningPath {
    const targetLevel = this.determineTargetLevel();
    const estimatedWeeks = this.calculateEstimatedWeeks(targetLevel);
    const activities = this.generateActivities(estimatedWeeks);
    const milestones = this.generateMilestones(estimatedWeeks);

    return {
      id: `path_${this.profile.userId}_${Date.now()}`,
      userId: this.profile.userId,
      startLevel: this.profile.currentLevel,
      targetLevel,
      estimatedWeeks,
      activities,
      milestones,
      createdAt: new Date(),
    };
  }

  // ===== 목표 레벨 결정 =====
  private determineTargetLevel(): CEFRLevel {
    const currentLevelDef = getCEFRLevel(this.profile.currentLevel);
    if (!currentLevelDef) return this.profile.currentLevel;

    // 목표에 따라 타겟 레벨 결정
    switch (this.profile.goal) {
      case 'general':
        return getNextLevel(this.profile.currentLevel) || this.profile.currentLevel;

      case 'business':
        // 비즈니스는 최소 B2 필요
        if (currentLevelDef.major < 'B2') {
          return 'B2.1';
        }
        return getNextLevel(this.profile.currentLevel) || this.profile.currentLevel;

      case 'academic':
        // 학술은 최소 C1 필요
        if (currentLevelDef.major < 'C1') {
          return 'C1.1';
        }
        return getNextLevel(this.profile.currentLevel) || this.profile.currentLevel;

      case 'travel':
        // 여행은 B1 정도면 충분
        if (currentLevelDef.major < 'B1') {
          return 'B1.1';
        }
        return this.profile.currentLevel;

      case 'exam':
        // 시험 준비는 다음 레벨
        return getNextLevel(this.profile.currentLevel) || this.profile.currentLevel;

      default:
        return getNextLevel(this.profile.currentLevel) || this.profile.currentLevel;
    }
  }

  // ===== 예상 주차 계산 =====
  private calculateEstimatedWeeks(targetLevel: CEFRLevel): number {
    const currentLevelDef = getCEFRLevel(this.profile.currentLevel);
    const targetLevelDef = getCEFRLevel(targetLevel);

    if (!currentLevelDef || !targetLevelDef) return 12; // 기본 12주

    const totalHours = targetLevelDef.estimatedHours - currentLevelDef.estimatedHours;
    const weeksNeeded = Math.ceil(totalHours / this.profile.weeklyHours);

    // 최소 8주, 최대 52주
    return Math.max(8, Math.min(52, weeksNeeded));
  }

  // ===== Activity 생성 =====
  private generateActivities(weeks: number): LearningActivity[] {
    const activities: LearningActivity[] = [];
    const daysPerWeek = this.profile.preferences.skipWeekends ? 5 : 7;

    for (let week = 1; week <= weeks; week++) {
      const weeklyActivities = this.generateWeeklyActivities(week, daysPerWeek);
      activities.push(...weeklyActivities);
    }

    return activities;
  }

  // ===== 주간 Activity 생성 =====
  private generateWeeklyActivities(weekNumber: number, daysPerWeek: number): LearningActivity[] {
    const activities: LearningActivity[] = [];
    const dailyMinutes = (this.profile.weeklyHours * 60) / daysPerWeek;

    // 학습 스타일에 따른 Activity 타입 우선순위
    const activityPriorities = this.getActivityPriorities();

    for (let day = 1; day <= daysPerWeek; day++) {
      const dayActivities = this.generateDailyActivities(
        weekNumber,
        day,
        dailyMinutes,
        activityPriorities
      );
      activities.push(...dayActivities);
    }

    return activities;
  }

  // ===== 일일 Activity 생성 =====
  private generateDailyActivities(
    weekNumber: number,
    dayNumber: number,
    dailyMinutes: number,
    priorities: ActivityType[]
  ): LearningActivity[] {
    const activities: LearningActivity[] = [];
    let remainingMinutes = dailyMinutes;

    // 우선순위에 따라 Activity 추가
    for (const activityType of priorities) {
      if (remainingMinutes <= 0) break;

      const timeAllocation = this.getTimeAllocation(activityType, dailyMinutes);
      const estimatedTime = Math.min(timeAllocation, remainingMinutes);

      if (estimatedTime < 10) continue; // 10분 미만은 스킵

      activities.push({
        weekNumber,
        dayNumber,
        activityType,
        activityId: `week-${weekNumber}-${activityType}`,
        estimatedTime,
        priority: this.calculatePriority(activityType),
        reason: this.generateReason(activityType),
      });

      remainingMinutes -= estimatedTime;
    }

    return activities;
  }

  // ===== Activity 우선순위 결정 =====
  private getActivityPriorities(): ActivityType[] {
    const { learningStyle, strengths, weaknesses, goal } = this.profile;

    // 기본 순서
    let priorities: ActivityType[] = ['vocabulary', 'grammar', 'listening', 'speaking', 'reading', 'writing'];

    // 학습 스타일에 따라 조정
    if (learningStyle === 'visual') {
      priorities = ['reading', 'writing', 'vocabulary', 'grammar', 'listening', 'speaking'];
    } else if (learningStyle === 'auditory') {
      priorities = ['listening', 'speaking', 'vocabulary', 'grammar', 'reading', 'writing'];
    } else if (learningStyle === 'kinesthetic') {
      priorities = ['speaking', 'writing', 'listening', 'vocabulary', 'grammar', 'reading'];
    }

    // 약점 보강: 약점 활동을 앞으로
    weaknesses.forEach((weakness) => {
      const index = priorities.indexOf(weakness);
      if (index > -1) {
        priorities.splice(index, 1);
        priorities.unshift(weakness); // 맨 앞에 추가
      }
    });

    // 목표에 따른 조정
    if (goal === 'business') {
      priorities = ['vocabulary', 'writing', 'speaking', 'reading', 'grammar', 'listening'];
    } else if (goal === 'academic') {
      priorities = ['reading', 'writing', 'vocabulary', 'grammar', 'listening', 'speaking'];
    } else if (goal === 'travel') {
      priorities = ['speaking', 'listening', 'vocabulary', 'reading', 'grammar', 'writing'];
    }

    return priorities;
  }

  // ===== Activity 시간 배분 =====
  private getTimeAllocation(activityType: ActivityType, dailyMinutes: number): number {
    const { weaknesses, goal } = this.profile;

    // 기본 배분 비율
    const baseAllocations: Record<ActivityType, number> = {
      vocabulary: 0.20, // 20%
      grammar: 0.15, // 15%
      listening: 0.15, // 15%
      speaking: 0.20, // 20%
      reading: 0.15, // 15%
      writing: 0.15, // 15%
    };

    // 약점에 더 많은 시간 배분
    if (weaknesses.includes(activityType)) {
      baseAllocations[activityType] *= 1.5;
    }

    // 목표에 따른 조정
    if (goal === 'business') {
      baseAllocations.vocabulary *= 1.3;
      baseAllocations.speaking *= 1.3;
    } else if (goal === 'academic') {
      baseAllocations.reading *= 1.5;
      baseAllocations.writing *= 1.5;
    }

    return Math.round(dailyMinutes * baseAllocations[activityType]);
  }

  // ===== 우선순위 계산 =====
  private calculatePriority(activityType: ActivityType): 'high' | 'medium' | 'low' {
    if (this.profile.weaknesses.includes(activityType)) {
      return 'high';
    }
    if (this.profile.strengths.includes(activityType)) {
      return 'low';
    }
    return 'medium';
  }

  // ===== 추천 이유 생성 =====
  private generateReason(activityType: ActivityType): string {
    const { weaknesses, goal, learningStyle } = this.profile;

    if (weaknesses.includes(activityType)) {
      return `${this.getActivityKoreanName(activityType)} 능력 향상이 필요합니다`;
    }

    if (goal === 'business' && (activityType === 'vocabulary' || activityType === 'speaking')) {
      return '비즈니스 목표 달성에 중요한 활동입니다';
    }

    if (goal === 'academic' && (activityType === 'reading' || activityType === 'writing')) {
      return '학술 목표 달성에 필수적인 활동입니다';
    }

    if (learningStyle === 'auditory' && (activityType === 'listening' || activityType === 'speaking')) {
      return '청각 학습 스타일에 적합한 활동입니다';
    }

    return '균형 잡힌 학습을 위해 필요한 활동입니다';
  }

  // ===== Milestone 생성 =====
  private generateMilestones(weeks: number): Milestone[] {
    const milestones: Milestone[] = [];

    // 4주마다 마일스톤
    for (let week = 4; week <= weeks; week += 4) {
      milestones.push({
        weekNumber: week,
        title: `${week}주차 평가`,
        description: `${week}주간의 학습 성과를 평가하고 다음 단계를 준비합니다`,
        assessmentRequired: true,
      });
    }

    // 최종 마일스톤
    milestones.push({
      weekNumber: weeks,
      title: '레벨 완료 평가',
      description: '전체 학습 과정을 마무리하고 다음 레벨로 진급합니다',
      assessmentRequired: true,
    });

    return milestones;
  }

  // ===== Helper: Activity 한글 이름 =====
  private getActivityKoreanName(type: ActivityType): string {
    const names: Record<ActivityType, string> = {
      vocabulary: '어휘',
      grammar: '문법',
      listening: '듣기',
      speaking: '말하기',
      reading: '읽기',
      writing: '쓰기',
    };
    return names[type];
  }
}

// ===== Factory 함수 =====
export function createLearningPath(profile: UserLearningProfile): LearningPath {
  const recommender = new LearningPathRecommender(profile);
  return recommender.generatePath();
}

// ===== 학습 경로 분석 =====
export function analyzeLearningPath(path: LearningPath): {
  totalActivities: number;
  activityDistribution: Record<ActivityType, number>;
  averageDailyTime: number;
  weeklyBreakdown: Array<{
    week: number;
    totalTime: number;
    activities: number;
  }>;
} {
  const activityDistribution: Record<ActivityType, number> = {
    vocabulary: 0,
    grammar: 0,
    listening: 0,
    speaking: 0,
    reading: 0,
    writing: 0,
  };

  path.activities.forEach((activity) => {
    activityDistribution[activity.activityType]++;
  });

  const totalTime = path.activities.reduce((sum, activity) => sum + activity.estimatedTime, 0);
  const totalDays = path.estimatedWeeks * 7;

  const weeklyBreakdown: Array<{
    week: number;
    totalTime: number;
    activities: number;
  }> = [];

  for (let week = 1; week <= path.estimatedWeeks; week++) {
    const weekActivities = path.activities.filter((a) => a.weekNumber === week);
    const weekTime = weekActivities.reduce((sum, a) => sum + a.estimatedTime, 0);

    weeklyBreakdown.push({
      week,
      totalTime: weekTime,
      activities: weekActivities.length,
    });
  }

  return {
    totalActivities: path.activities.length,
    activityDistribution,
    averageDailyTime: totalTime / totalDays,
    weeklyBreakdown,
  };
}
