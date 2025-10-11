/**
 * Dashboard Loading State
 *
 * Dashboard 로딩 중 표시되는 스켈레톤 UI
 */

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-slate-900/50 dark:to-gray-900 p-6">
      {/* 애니메이션 배경 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-indigo-300/10 rounded-full blur-3xl animate-float delay-300"></div>
        <div className="absolute bottom-20 left-1/3 w-[400px] h-[400px] bg-violet-300/10 rounded-full blur-3xl animate-float delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto space-y-8">
        {/* 환영 메시지 스켈레톤 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30">
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3 animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 animate-pulse"></div>
          </div>
        </div>

        {/* 통계 카드 그리드 스켈레톤 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="glass dark:glass-dark rounded-2xl p-6 shadow-xl animate-pulse"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>

        {/* 차트 스켈레톤 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30">
          <div className="space-y-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          </div>
        </div>

        {/* 활동 진행률 스켈레톤 */}
        <div className="glass dark:glass-dark rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/30">
          <div className="space-y-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-full animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
                >
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                  <div className="w-20 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 로딩 인디케이터 */}
      <div className="fixed bottom-8 right-8">
        <div className="glass dark:glass-dark rounded-full p-4 shadow-2xl">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
