/**
 * B2B Analytics - 기업 전용 분석 대시보드
 * 조직/팀 단위 학습 분석 및 ROI 계산
 */

import { CEFRLevel } from '@/lib/types/activity';
import { TeamProgressReport } from './organization';

// ===== ROI 계산 =====
export interface ROIAnalysis {
  organizationId: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  investment: {
    subscriptionCost: number;
    trainingTime: number; // 총 학습 시간 (회사 시간 기준)
    estimatedCost: number; // 학습 시간의 기회비용
  };
  returns: {
    employeesImproved: number;
    avgLevelIncrease: number; // CEFR 레벨 증가 (1 = 1 레벨, 0.5 = 0.5 레벨)
    completionRate: number;
    estimatedProductivityGain: number; // % 증가
    estimatedValue: number; // 예상 가치 (KRW)
  };
  roi: number; // %
  paybackPeriod: number; // months
}

export function calculateROI(
  subscriptionCost: number,
  totalHoursStudied: number,
  avgHourlyWage: number,
  levelImprovements: { before: CEFRLevel; after: CEFRLevel }[],
  completionRate: number
): ROIAnalysis {
  // 1. 투자 비용 계산
  const trainingTimeCost = totalHoursStudied * avgHourlyWage;
  const totalInvestment = subscriptionCost + trainingTimeCost;

  // 2. 레벨 증가 계산
  const levelMap: Record<CEFRLevel, number> = {
    'A1.1': 1,
    'A1.2': 2,
    'A2.1': 3,
    'A2.2': 4,
    'B1.1': 5,
    'B1.2': 6,
    'B2.1': 7,
    'B2.2': 8,
    'C1.1': 9,
    'C1.2': 10,
    'C2.1': 11,
    'C2.2': 12,
  };

  let totalLevelIncrease = 0;
  let employeesImproved = 0;

  levelImprovements.forEach((improvement) => {
    const beforeLevel = levelMap[improvement.before];
    const afterLevel = levelMap[improvement.after];
    const increase = afterLevel - beforeLevel;

    if (increase > 0) {
      totalLevelIncrease += increase;
      employeesImproved++;
    }
  });

  const avgLevelIncrease = levelImprovements.length > 0 ? totalLevelIncrease / levelImprovements.length : 0;

  // 3. 생산성 향상 추정 (1 CEFR 레벨 = 5% 생산성 향상)
  const estimatedProductivityGain = avgLevelIncrease * 5;

  // 4. 연간 가치 계산 (생산성 향상 * 평균 임금 * 연간 근무 시간)
  const annualWorkHours = 2080; // 주 40시간 * 52주
  const estimatedAnnualValue = employeesImproved * avgHourlyWage * annualWorkHours * (estimatedProductivityGain / 100);

  // 5. ROI 계산
  const roi = ((estimatedAnnualValue - totalInvestment) / totalInvestment) * 100;

  // 6. Payback Period (월 단위)
  const monthlyValue = estimatedAnnualValue / 12;
  const paybackPeriod = monthlyValue > 0 ? totalInvestment / monthlyValue : 999;

  return {
    organizationId: '',
    period: {
      startDate: new Date(),
      endDate: new Date(),
    },
    investment: {
      subscriptionCost,
      trainingTime: totalHoursStudied,
      estimatedCost: totalInvestment,
    },
    returns: {
      employeesImproved,
      avgLevelIncrease: Math.round(avgLevelIncrease * 10) / 10,
      completionRate,
      estimatedProductivityGain: Math.round(estimatedProductivityGain * 10) / 10,
      estimatedValue: Math.round(estimatedAnnualValue),
    },
    roi: Math.round(roi * 10) / 10,
    paybackPeriod: Math.round(paybackPeriod * 10) / 10,
  };
}

// ===== 학습 효과성 분석 =====
export interface LearningEffectiveness {
  organizationId: string;
  teamId?: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  engagement: {
    avgSessionsPerWeek: number;
    avgMinutesPerSession: number;
    completionRate: number;
    dropoffRate: number;
  };
  performance: {
    avgScoreImprovement: number;
    passRate: number; // 70% 이상 점수
    excellenceRate: number; // 90% 이상 점수
  };
  skillDevelopment: {
    listening: { avg: number; improvement: number };
    speaking: { avg: number; improvement: number };
    reading: { avg: number; improvement: number };
    writing: { avg: number; improvement: number };
    grammar: { avg: number; improvement: number };
    vocabulary: { avg: number; improvement: number };
  };
  recommendations: string[];
}

export function analyzeLearningEffectiveness(
  report: TeamProgressReport,
  previousReport: TeamProgressReport
): LearningEffectiveness {
  const { members, summary } = report;

  // 1. 참여도 분석
  const totalSessions = members.reduce((sum, m) => sum + m.activitiesCompleted, 0);
  const totalMinutes = members.reduce((sum, m) => sum + m.hoursStudied * 60, 0);
  const avgSessionsPerWeek = totalSessions / members.length / 4; // 4주 기준
  const avgMinutesPerSession = totalSessions > 0 ? totalMinutes / totalSessions : 0;

  // 2. 성과 분석
  const passCount = members.filter((m) => m.avgScore >= 70).length;
  const excellenceCount = members.filter((m) => m.avgScore >= 90).length;
  const passRate = (passCount / members.length) * 100;
  const excellenceRate = (excellenceCount / members.length) * 100;

  // 3. 이전 대비 개선도
  const avgScoreImprovement = summary.avgScore - (previousReport?.summary.avgScore || 0);

  // 4. 스킬별 분석
  const skillDevelopment = {
    listening: { avg: 0, improvement: 0 },
    speaking: { avg: 0, improvement: 0 },
    reading: { avg: 0, improvement: 0 },
    writing: { avg: 0, improvement: 0 },
    grammar: { avg: 0, improvement: 0 },
    vocabulary: { avg: 0, improvement: 0 },
  };

  // 실제 구현 시 Firestore에서 세부 데이터 조회

  // 5. 추천사항 생성
  const recommendations: string[] = [];

  if (summary.avgCompletionRate < 50) {
    recommendations.push('완료율이 낮습니다. 학습 동기 부여 프로그램을 고려해보세요.');
  }

  if (passRate < 70) {
    recommendations.push('전체 성과가 목표에 미달합니다. 추가 지원이 필요한 학습자를 확인하세요.');
  }

  if (avgSessionsPerWeek < 2) {
    recommendations.push('주간 학습 빈도가 낮습니다. 리마인더 설정을 권장합니다.');
  }

  if (avgMinutesPerSession < 15) {
    recommendations.push('학습 세션이 짧습니다. 집중 학습 시간 확보를 권장합니다.');
  }

  return {
    organizationId: report.teamId,
    period: report.period,
    engagement: {
      avgSessionsPerWeek: Math.round(avgSessionsPerWeek * 10) / 10,
      avgMinutesPerSession: Math.round(avgMinutesPerSession),
      completionRate: summary.avgCompletionRate,
      dropoffRate: ((members.length - summary.activeMembers) / members.length) * 100,
    },
    performance: {
      avgScoreImprovement: Math.round(avgScoreImprovement * 10) / 10,
      passRate: Math.round(passRate * 10) / 10,
      excellenceRate: Math.round(excellenceRate * 10) / 10,
    },
    skillDevelopment,
    recommendations,
  };
}

// ===== 벤치마킹 데이터 =====
export interface BenchmarkData {
  organizationId: string;
  metric: string;
  yourValue: number;
  industryAvg: number;
  topPerformers: number;
  percentile: number; // 상위 몇 %
}

export async function getBenchmarkData(
  organizationId: string,
  industry: string
): Promise<BenchmarkData[]> {
  // 실제 구현 시 Firestore Aggregation 사용
  // 동일 업종 평균, 상위 10% 값 등 계산

  return [
    {
      organizationId,
      metric: 'Completion Rate',
      yourValue: 75,
      industryAvg: 68,
      topPerformers: 88,
      percentile: 65,
    },
    {
      organizationId,
      metric: 'Average Score',
      yourValue: 82,
      industryAvg: 78,
      topPerformers: 92,
      percentile: 70,
    },
    {
      organizationId,
      metric: 'Engagement (sessions/week)',
      yourValue: 3.2,
      industryAvg: 2.8,
      topPerformers: 4.5,
      percentile: 68,
    },
    {
      organizationId,
      metric: 'ROI (%)',
      yourValue: 145,
      industryAvg: 120,
      topPerformers: 200,
      percentile: 72,
    },
  ];
}

// ===== 리스크 감지 =====
export interface RiskAlert {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'engagement' | 'performance' | 'retention' | 'completion';
  message: string;
  affectedUsers: string[]; // User IDs
  recommendation: string;
  detectedAt: Date;
}

export function detectRisks(report: TeamProgressReport): RiskAlert[] {
  const alerts: RiskAlert[] = [];

  // 1. 낮은 참여도 감지
  const lowEngagement = report.members.filter((m) => {
    const daysSinceActive = (Date.now() - m.lastActiveAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceActive > 14; // 2주 이상 비활성
  });

  if (lowEngagement.length > 0) {
    alerts.push({
      severity: lowEngagement.length > report.members.length * 0.3 ? 'high' : 'medium',
      category: 'engagement',
      message: `${lowEngagement.length}명의 학습자가 2주 이상 비활성 상태입니다.`,
      affectedUsers: lowEngagement.map((m) => m.userId),
      recommendation: '개별 연락을 통해 학습 장애 요인을 파악하고 지원하세요.',
      detectedAt: new Date(),
    });
  }

  // 2. 낮은 성과 감지
  const lowPerformers = report.members.filter((m) => m.avgScore < 50);

  if (lowPerformers.length > 0) {
    alerts.push({
      severity: lowPerformers.length > report.members.length * 0.2 ? 'high' : 'medium',
      category: 'performance',
      message: `${lowPerformers.length}명의 학습자가 평균 50점 미만입니다.`,
      affectedUsers: lowPerformers.map((m) => m.userId),
      recommendation: '기초 레벨 복습 프로그램이나 1:1 튜터링을 제공하세요.',
      detectedAt: new Date(),
    });
  }

  // 3. 완료율 저하
  if (report.summary.avgCompletionRate < 40) {
    alerts.push({
      severity: 'critical',
      category: 'completion',
      message: '팀 전체 완료율이 40% 미만입니다.',
      affectedUsers: report.members.map((m) => m.userId),
      recommendation: '학습 난이도를 조정하거나 인센티브 프로그램을 도입하세요.',
      detectedAt: new Date(),
    });
  }

  // 4. 드롭아웃 위험
  const needsAttention = report.needsAttention;

  if (needsAttention.length > report.members.length * 0.25) {
    alerts.push({
      severity: 'high',
      category: 'retention',
      message: `25% 이상의 학습자가 드롭아웃 위험에 있습니다.`,
      affectedUsers: needsAttention.map((m) => m.userId),
      recommendation: '조기 개입 프로그램을 통해 학습 동기를 회복시키세요.',
      detectedAt: new Date(),
    });
  }

  return alerts;
}

// ===== 예측 분석 (AI 기반) =====
export interface PredictiveInsights {
  organizationId: string;
  predictions: {
    expectedCompletionRate: number; // 3개월 후
    expectedAvgScore: number;
    expectedLevelDistribution: Record<CEFRLevel, number>;
    estimatedROI: number;
  };
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    action: string;
    impact: string;
    effort: 'low' | 'medium' | 'high';
  }[];
}

export async function getPredictiveInsights(
  organizationId: string
): Promise<PredictiveInsights> {
  // 실제 구현 시 ML 모델 사용 (TensorFlow.js 또는 서버 API 호출)
  // 과거 데이터를 기반으로 미래 예측

  return {
    organizationId,
    predictions: {
      expectedCompletionRate: 78,
      expectedAvgScore: 85,
      expectedLevelDistribution: {
        'A1.1': 0,
        'A1.2': 0,
        'A2.1': 2,
        'A2.2': 5,
        'B1.1': 8,
        'B1.2': 12,
        'B2.1': 15,
        'B2.2': 10,
        'C1.1': 5,
        'C1.2': 3,
        'C2.1': 0,
        'C2.2': 0,
      },
      estimatedROI: 165,
    },
    recommendations: [
      {
        priority: 'high',
        action: 'B1 레벨 학습자를 위한 집중 프로그램 운영',
        impact: '완료율 15% 향상 예상',
        effort: 'medium',
      },
      {
        priority: 'medium',
        action: '주 3회 이상 학습 인센티브 도입',
        impact: '참여도 20% 향상 예상',
        effort: 'low',
      },
      {
        priority: 'medium',
        action: '스피킹 연습 세션 추가 제공',
        impact: '전체 점수 5점 향상 예상',
        effort: 'high',
      },
    ],
  };
}
