/**
 * Chart Configuration - Dashboard 통계 차트 설정
 * Chart.js 기반 학습 통계 시각화
 */

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { colors } from '@/lib/design/tokens';
import { CEFRLevel } from '@/lib/types/activity';

// Chart.js 전역 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ===== 차트 데이터 타입 =====
export interface WeeklyProgressData {
  week: string;
  listening: number;
  speaking: number;
  reading: number;
  writing: number;
  grammar: number;
  vocabulary: number;
}

export interface StreakData {
  date: string;
  count: number;
  level: 'none' | 'low' | 'medium' | 'high';
}

export interface LevelProgressData {
  level: CEFRLevel;
  current: number;
  target: number;
}

export interface ActivityDistributionData {
  type: string;
  count: number;
  hours: number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

// ===== 공통 차트 옵션 =====
const baseChartOptions: Partial<ChartOptions> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        font: {
          family: 'var(--font-geist-sans)',
          size: 12,
        },
        color: colors.text.secondary,
        padding: 16,
        usePointStyle: true,
      },
    },
    tooltip: {
      backgroundColor: colors.neutral[800],
      titleColor: colors.text.inverse,
      bodyColor: colors.text.inverse,
      padding: 12,
      borderColor: colors.border.primary,
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      titleFont: {
        family: 'var(--font-geist-sans)',
        size: 14,
        weight: 600,
      },
      bodyFont: {
        family: 'var(--font-geist-sans)',
        size: 13,
      },
    },
  },
};

// ===== 1. 주간 학습 진도 차트 (Line Chart) =====
export const weeklyProgressChartConfig = {
  type: 'line' as const,
  options: {
    ...baseChartOptions,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'var(--font-geist-sans)',
            size: 11,
          },
          color: colors.text.tertiary,
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: colors.border.primary,
          drawBorder: false,
        },
        ticks: {
          font: {
            family: 'var(--font-geist-sans)',
            size: 11,
          },
          color: colors.text.tertiary,
          callback: (value: number | string) => `${value}%`,
        },
      },
    },
    plugins: {
      ...baseChartOptions.plugins,
      title: {
        display: true,
        text: '주간 학습 진도',
        font: {
          family: 'var(--font-geist-sans)',
          size: 16,
          weight: 600,
        },
        color: colors.text.primary,
        padding: { top: 10, bottom: 20 },
      },
    },
  } as ChartOptions<'line'>,
};

export function createWeeklyProgressData(data: WeeklyProgressData[]) {
  return {
    labels: data.map((d) => d.week),
    datasets: [
      {
        label: 'Listening',
        data: data.map((d) => d.listening),
        borderColor: colors.primary[500],
        backgroundColor: `${colors.primary[500]}20`,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Speaking',
        data: data.map((d) => d.speaking),
        borderColor: colors.secondary[500],
        backgroundColor: `${colors.secondary[500]}20`,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Reading',
        data: data.map((d) => d.reading),
        borderColor: colors.success[500],
        backgroundColor: `${colors.success[500]}20`,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Writing',
        data: data.map((d) => d.writing),
        borderColor: colors.accent[500],
        backgroundColor: `${colors.accent[500]}20`,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Grammar',
        data: data.map((d) => d.grammar),
        borderColor: colors.warning[500],
        backgroundColor: `${colors.warning[500]}20`,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Vocabulary',
        data: data.map((d) => d.vocabulary),
        borderColor: colors.error[500],
        backgroundColor: `${colors.error[500]}20`,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };
}

// ===== 2. 학습 스트릭 히트맵 (Bar Chart - Horizontal) =====
export const streakHeatmapChartConfig = {
  type: 'bar' as const,
  options: {
    ...baseChartOptions,
    indexAxis: 'y' as const,
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'var(--font-geist-sans)',
            size: 11,
          },
          color: colors.text.tertiary,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'var(--font-geist-sans)',
            size: 11,
          },
          color: colors.text.tertiary,
        },
      },
    },
    plugins: {
      ...baseChartOptions.plugins,
      title: {
        display: true,
        text: '30일 학습 스트릭',
        font: {
          family: 'var(--font-geist-sans)',
          size: 16,
          weight: 600,
        },
        color: colors.text.primary,
        padding: { top: 10, bottom: 20 },
      },
      legend: {
        display: false,
      },
    },
  } as ChartOptions<'bar'>,
};

export function createStreakHeatmapData(data: StreakData[]) {
  const getColor = (level: StreakData['level']) => {
    switch (level) {
      case 'none':
        return colors.neutral[200];
      case 'low':
        return colors.success[300];
      case 'medium':
        return colors.success[500];
      case 'high':
        return colors.success[700];
      default:
        return colors.neutral[200];
    }
  };

  return {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: '학습 활동',
        data: data.map((d) => d.count),
        backgroundColor: data.map((d) => getColor(d.level)),
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  };
}

// ===== 3. CEFR 레벨 진행도 (Bar Chart) =====
export const levelProgressChartConfig = {
  type: 'bar' as const,
  options: {
    ...baseChartOptions,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'var(--font-geist-sans)',
            size: 11,
          },
          color: colors.text.tertiary,
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: colors.border.primary,
          drawBorder: false,
        },
        ticks: {
          font: {
            family: 'var(--font-geist-sans)',
            size: 11,
          },
          color: colors.text.tertiary,
          callback: (value: number | string) => `${value}%`,
        },
      },
    },
    plugins: {
      ...baseChartOptions.plugins,
      title: {
        display: true,
        text: 'CEFR 레벨 진행도',
        font: {
          family: 'var(--font-geist-sans)',
          size: 16,
          weight: 600,
        },
        color: colors.text.primary,
        padding: { top: 10, bottom: 20 },
      },
      legend: {
        display: true,
      },
    },
  } as ChartOptions<'bar'>,
};

export function createLevelProgressData(data: LevelProgressData[]) {
  return {
    labels: data.map((d) => d.level),
    datasets: [
      {
        label: '현재 진도',
        data: data.map((d) => d.current),
        backgroundColor: colors.primary[500],
        borderRadius: 4,
      },
      {
        label: '목표',
        data: data.map((d) => d.target),
        backgroundColor: colors.neutral[300],
        borderRadius: 4,
      },
    ],
  };
}

// ===== 4. 활동 타입 분포 (Doughnut Chart) =====
export const activityDistributionChartConfig = {
  type: 'doughnut' as const,
  options: {
    ...baseChartOptions,
    cutout: '65%',
    plugins: {
      ...baseChartOptions.plugins,
      title: {
        display: true,
        text: '활동 타입 분포',
        font: {
          family: 'var(--font-geist-sans)',
          size: 16,
          weight: 600,
        },
        color: colors.text.primary,
        padding: { top: 10, bottom: 20 },
      },
      legend: {
        display: true,
        position: 'right',
        labels: {
          font: {
            family: 'var(--font-geist-sans)',
            size: 12,
          },
          color: colors.text.secondary,
          padding: 12,
          usePointStyle: true,
        },
      },
    },
  } as ChartOptions<'doughnut'>,
};

export function createActivityDistributionData(data: ActivityDistributionData[]) {
  return {
    labels: data.map((d) => d.type),
    datasets: [
      {
        label: '활동 개수',
        data: data.map((d) => d.count),
        backgroundColor: [
          colors.primary[500],
          colors.secondary[500],
          colors.success[500],
          colors.accent[500],
          colors.warning[500],
          colors.error[500],
        ],
        borderWidth: 2,
        borderColor: colors.background.primary,
        hoverOffset: 8,
      },
    ],
  };
}

// ===== 5. 학습 시간 추이 (Area Chart) =====
export const timeSeriesChartConfig = {
  type: 'line' as const,
  options: {
    ...baseChartOptions,
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
          displayFormats: {
            day: 'MM/DD',
          },
        },
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'var(--font-geist-sans)',
            size: 11,
          },
          color: colors.text.tertiary,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: colors.border.primary,
          drawBorder: false,
        },
        ticks: {
          font: {
            family: 'var(--font-geist-sans)',
            size: 11,
          },
          color: colors.text.tertiary,
          callback: (value: number | string) => `${value}h`,
        },
      },
    },
    plugins: {
      ...baseChartOptions.plugins,
      title: {
        display: true,
        text: '일일 학습 시간',
        font: {
          family: 'var(--font-geist-sans)',
          size: 16,
          weight: 600,
        },
        color: colors.text.primary,
        padding: { top: 10, bottom: 20 },
      },
      legend: {
        display: false,
      },
      filler: {
        propagate: true,
      },
    },
  } as ChartOptions<'line'>,
};

export function createTimeSeriesData(data: TimeSeriesData[]) {
  return {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: '학습 시간 (시간)',
        data: data.map((d) => d.value),
        borderColor: colors.primary[500],
        backgroundColor: `${colors.primary[500]}30`,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };
}

// ===== 6. 강점/약점 분석 (Radar Chart) =====
export const strengthWeaknessChartConfig = {
  type: 'radar' as const,
  options: {
    ...baseChartOptions,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          font: {
            family: 'var(--font-geist-sans)',
            size: 10,
          },
          color: colors.text.tertiary,
          backdropColor: 'transparent',
        },
        grid: {
          color: colors.border.primary,
        },
        pointLabels: {
          font: {
            family: 'var(--font-geist-sans)',
            size: 12,
          },
          color: colors.text.secondary,
        },
      },
    },
    plugins: {
      ...baseChartOptions.plugins,
      title: {
        display: true,
        text: '영역별 강점/약점',
        font: {
          family: 'var(--font-geist-sans)',
          size: 16,
          weight: 600,
        },
        color: colors.text.primary,
        padding: { top: 10, bottom: 20 },
      },
    },
  } as ChartOptions<'radar'>,
};

export function createStrengthWeaknessData(scores: {
  listening: number;
  speaking: number;
  reading: number;
  writing: number;
  grammar: number;
  vocabulary: number;
}) {
  return {
    labels: ['Listening', 'Speaking', 'Reading', 'Writing', 'Grammar', 'Vocabulary'],
    datasets: [
      {
        label: '내 점수',
        data: [
          scores.listening,
          scores.speaking,
          scores.reading,
          scores.writing,
          scores.grammar,
          scores.vocabulary,
        ],
        borderColor: colors.primary[500],
        backgroundColor: `${colors.primary[500]}40`,
        borderWidth: 2,
        pointBackgroundColor: colors.primary[500],
        pointBorderColor: colors.background.primary,
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: '평균',
        data: [70, 70, 70, 70, 70, 70],
        borderColor: colors.neutral[400],
        backgroundColor: `${colors.neutral[400]}20`,
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: colors.neutral[400],
        pointBorderColor: colors.background.primary,
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };
}

// ===== 7. 예측 진도 차트 (Mixed Chart - Line + Bar) =====
export const predictedProgressChartConfig = {
  type: 'line' as const,
  options: {
    ...baseChartOptions,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'var(--font-geist-sans)',
            size: 11,
          },
          color: colors.text.tertiary,
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: colors.border.primary,
          drawBorder: false,
        },
        ticks: {
          font: {
            family: 'var(--font-geist-sans)',
            size: 11,
          },
          color: colors.text.tertiary,
          callback: (value: number | string) => `${value}%`,
        },
      },
    },
    plugins: {
      ...baseChartOptions.plugins,
      title: {
        display: true,
        text: '진도 예측 (AI 기반)',
        font: {
          family: 'var(--font-geist-sans)',
          size: 16,
          weight: 600,
        },
        color: colors.text.primary,
        padding: { top: 10, bottom: 20 },
      },
    },
  } as ChartOptions<'line'>,
};

export function createPredictedProgressData(
  actual: { week: string; progress: number }[],
  predicted: { week: string; progress: number }[]
) {
  return {
    labels: [...actual.map((d) => d.week), ...predicted.map((d) => d.week)],
    datasets: [
      {
        type: 'line' as const,
        label: '실제 진도',
        data: [...actual.map((d) => d.progress), ...Array(predicted.length).fill(null)],
        borderColor: colors.primary[500],
        backgroundColor: colors.primary[500],
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        type: 'line' as const,
        label: '예상 진도',
        data: [
          ...Array(actual.length - 1).fill(null),
          actual[actual.length - 1].progress,
          ...predicted.map((d) => d.progress),
        ],
        borderColor: colors.secondary[500],
        backgroundColor: colors.secondary[500],
        borderWidth: 2,
        borderDash: [8, 4],
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };
}
