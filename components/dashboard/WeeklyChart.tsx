'use client';

import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card } from '@/components/ui';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface LearningTimeEntry {
  date: string; // YYYY-MM-DD
  minutes: number;
}

interface WeeklyChartProps {
  data: LearningTimeEntry[];
  dailyGoal?: number; // 목표 학습 시간 (분)
}

export default function WeeklyChart({
  data = [],
  dailyGoal = 30,
}: WeeklyChartProps) {
  // 최근 7일 데이터 준비
  const chartData = useMemo(() => {
    // 오늘부터 7일 전까지 날짜 생성
    const today = new Date();
    const last7Days: string[] = [];
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      last7Days.push(dateStr);
    }

    // 날짜별 학습 시간 매핑
    const learningMinutes = last7Days.map((dateStr) => {
      const entry = data.find((d) => d.date === dateStr);
      return entry ? entry.minutes : 0;
    });

    // 요일 라벨
    const labels = last7Days.map((dateStr) => {
      const date = new Date(dateStr);
      const dayOfWeek = dayNames[date.getDay()];
      const day = date.getDate();
      return `${dayOfWeek} ${day}일`;
    });

    return {
      labels,
      datasets: [
        {
          label: '학습 시간 (분)',
          data: learningMinutes,
          backgroundColor: learningMinutes.map((minutes) =>
            minutes >= dailyGoal
              ? 'rgba(59, 130, 246, 0.8)' // 목표 달성: Primary Blue
              : 'rgba(229, 231, 235, 0.8)' // 미달성: Gray
          ),
          borderColor: learningMinutes.map((minutes) =>
            minutes >= dailyGoal
              ? 'rgba(59, 130, 246, 1)'
              : 'rgba(209, 213, 219, 1)'
          ),
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    };
  }, [data, dailyGoal]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: (context: { parsed: { y: number } }) => {
            const minutes = context.parsed.y;
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            if (hours > 0) {
              return `${hours}시간 ${mins}분`;
            }
            return `${mins}분`;
          },
          afterLabel: (context: { parsed: { y: number } }) => {
            const minutes = context.parsed.y;
            if (minutes >= dailyGoal) {
              return '✅ 목표 달성!';
            }
            return `(목표까지 ${dailyGoal - minutes}분)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
        },
        ticks: {
          callback: (value: number | string) => `${value}분`,
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  // 통계
  const totalMinutes = data.reduce((sum, entry) => sum + entry.minutes, 0);
  const avgMinutes = data.length > 0 ? Math.round(totalMinutes / 7) : 0;
  const daysAchieved = data.filter((entry) => entry.minutes >= dailyGoal).length;

  return (
    <Card padding="lg">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          주간 학습 시간
        </h3>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <span className="font-medium">총</span>{' '}
            {Math.floor(totalMinutes / 60)}시간 {totalMinutes % 60}분
          </div>
          <div>
            <span className="font-medium">평균</span> {avgMinutes}분/일
          </div>
          <div>
            <span className="font-medium">목표 달성</span> {daysAchieved}/7일
          </div>
        </div>
      </div>

      {/* 차트 */}
      <div className="h-64">
        {data.length > 0 ? (
          <Bar data={chartData} options={options} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <p className="text-sm">아직 학습 기록이 없습니다</p>
              <p className="text-xs mt-1">학습을 시작해보세요!</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
