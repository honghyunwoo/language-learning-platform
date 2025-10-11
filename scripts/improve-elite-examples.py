#!/usr/bin/env python3
"""
Elite Track 예문 개선 스크립트

Week 10-16의 템플릿 반복 예문을 자연스러운 비즈니스 영어로 교체
"""

import json
import os
from pathlib import Path

# Week별 개선된 예문 데이터
IMPROVED_EXAMPLES = {
    "10": {
        "baseline": [
            {"level": "intermediate", "sentence": "We need to establish a baseline before measuring improvement.", "translation": "개선을 측정하기 전에 기준선을 설정해야 합니다.", "notes": "성과 측정 시작"},
            {"level": "advanced", "sentence": "The baseline metrics show a 20% gap from our target performance.", "translation": "기준 지표는 목표 성과와 20% 격차를 보여준다.", "notes": "데이터 분석"},
            {"level": "expert", "sentence": "Without a reliable baseline, any performance comparison becomes meaningless.", "translation": "신뢰할 수 있는 기준선 없이는 모든 성과 비교가 무의미해진다.", "notes": "방법론적 중요성"}
        ],
        "variance": [
            {"level": "intermediate", "sentence": "There's significant variance in sales figures across different regions.", "translation": "지역별 판매 수치에 상당한 편차가 있습니다.", "notes": "데이터 차이"},
            {"level": "advanced", "sentence": "We need to analyze the variance to understand what's driving these differences.", "translation": "이러한 차이를 유발하는 요인을 이해하기 위해 분산을 분석해야 한다.", "notes": "통계 분석"},
            {"level": "expert", "sentence": "High variance in customer satisfaction scores indicates inconsistent service delivery.", "translation": "고객 만족도 점수의 높은 분산은 일관되지 않은 서비스 제공을 나타낸다.", "notes": "품질 관리"}
        ],
        "outlier": [
            {"level": "intermediate", "sentence": "This data point is an outlier and should be investigated.", "translation": "이 데이터 포인트는 이상값이므로 조사해야 합니다.", "notes": "데이터 검증"},
            {"level": "advanced", "sentence": "We removed several outliers to get a more accurate average.", "translation": "더 정확한 평균을 얻기 위해 여러 이상값을 제거했다.", "notes": "데이터 정제"},
            {"level": "expert", "sentence": "Outliers often reveal important insights about system failures or opportunities.", "translation": "이상값은 종종 시스템 실패나 기회에 대한 중요한 통찰력을 드러낸다.", "notes": "분석 철학"}
        ],
        "trendline": [
            {"level": "intermediate", "sentence": "The trendline shows steady growth over the past six months.", "translation": "추세선은 지난 6개월 동안 꾸준한 성장을 보여줍니다.", "notes": "시계열 분석"},
            {"level": "advanced", "sentence": "If the current trendline continues, we'll exceed our annual target.", "translation": "현재 추세선이 계속되면 연간 목표를 초과할 것이다.", "notes": "예측"},
            {"level": "expert", "sentence": "Trendline analysis helps distinguish between random fluctuations and systemic changes.", "translation": "추세선 분석은 무작위 변동과 체계적 변화를 구분하는 데 도움이 된다.", "notes": "통계적 의미"}
        ],
        "confidence interval": [
            {"level": "intermediate", "sentence": "The confidence interval gives us a range of likely values.", "translation": "신뢰 구간은 가능한 값의 범위를 제공합니다.", "notes": "통계 기본"},
            {"level": "advanced", "sentence": "At 95% confidence interval, the true value lies between 45 and 55.", "translation": "95% 신뢰 구간에서 실제 값은 45에서 55 사이에 있다.", "notes": "정밀한 표현"},
            {"level": "expert", "sentence": "Narrow confidence intervals indicate more precise estimates from larger sample sizes.", "translation": "좁은 신뢰 구간은 더 큰 표본 크기로부터 더 정밀한 추정치를 나타낸다.", "notes": "통계적 정밀도"}
        ],
        "margin of error": [
            {"level": "intermediate", "sentence": "The survey has a margin of error of plus or minus 3%.", "translation": "설문 조사는 플러스 마이너스 3%의 오차 범위를 가집니다.", "notes": "조사 결과"},
            {"level": "advanced", "sentence": "With a smaller margin of error, we can make more confident decisions.", "translation": "더 작은 오차 범위로 더 확신 있는 결정을 내릴 수 있다.", "notes": "의사 결정 품질"},
            {"level": "expert", "sentence": "Understanding margin of error prevents overinterpreting small differences in data.", "translation": "오차 범위를 이해하면 데이터의 작은 차이를 과대 해석하는 것을 방지한다.", "notes": "해석 원칙"}
        ],
        "median": [
            {"level": "intermediate", "sentence": "The median salary is $75,000, which is more representative than the average.", "translation": "중앙값 급여는 $75,000로 평균보다 더 대표적입니다.", "notes": "급여 분석"},
            {"level": "advanced", "sentence": "We use median instead of mean when the data has extreme values.", "translation": "데이터에 극단값이 있을 때 평균 대신 중앙값을 사용한다.", "notes": "통계 방법 선택"},
            {"level": "expert", "sentence": "Median income provides a clearer picture of economic reality than mean income.", "translation": "중앙값 소득은 평균 소득보다 경제 현실의 더 명확한 그림을 제공한다.", "notes": "경제 분석"}
        ],
        "percentile": [
            {"level": "intermediate", "sentence": "Your score is in the 90th percentile, meaning you scored higher than 90% of test takers.", "translation": "당신의 점수는 90번째 백분위수로, 시험 응시자의 90%보다 높은 점수를 받았다는 의미입니다.", "notes": "시험 결과"},
            {"level": "advanced", "sentence": "We focus on the 75th percentile for setting performance targets.", "translation": "우리는 성과 목표 설정을 위해 75번째 백분위수에 집중한다.", "notes": "목표 설정"},
            {"level": "expert", "sentence": "Percentile rankings help normalize performance across different scales and populations.", "translation": "백분위수 순위는 다양한 척도와 모집단 전반에 걸쳐 성과를 정규화하는 데 도움이 된다.", "notes": "비교 방법론"}
        ],
        "delta": [
            {"level": "intermediate", "sentence": "What's the delta between this quarter and last quarter?", "translation": "이번 분기와 지난 분기 사이의 델타(변화량)는 얼마인가요?", "notes": "변화 측정"},
            {"level": "advanced", "sentence": "The delta in conversion rate is 2.3 percentage points.", "translation": "전환율의 델타는 2.3 퍼센트 포인트이다.", "notes": "정확한 수치"},
            {"level": "expert", "sentence": "Tracking delta over time reveals acceleration or deceleration in key metrics.", "translation": "시간 경과에 따른 델타 추적은 주요 지표의 가속 또는 감속을 드러낸다.", "notes": "변화 속도 분석"}
        ],
        "uplift": [
            {"level": "intermediate", "sentence": "The new campaign generated a 15% uplift in sales.", "translation": "새 캠페인이 매출에서 15% 상승 효과를 냈습니다.", "notes": "마케팅 성과"},
            {"level": "advanced", "sentence": "We measured the uplift by comparing test group against control group.", "translation": "우리는 테스트 그룹과 대조 그룹을 비교하여 상승 효과를 측정했다.", "notes": "A/B 테스트"},
            {"level": "expert", "sentence": "Incremental uplift analysis isolates the true impact of interventions from baseline trends.", "translation": "증분 상승 효과 분석은 개입의 실제 영향을 기준 추세로부터 분리한다.", "notes": "인과 관계 분석"}
        ],
        "downtime": [
            {"level": "intermediate", "sentence": "The server downtime lasted for two hours yesterday.", "translation": "서버 다운타임이 어제 두 시간 동안 지속되었습니다.", "notes": "시스템 장애"},
            {"level": "advanced", "sentence": "We need to minimize downtime during the system upgrade.", "translation": "시스템 업그레이드 중 다운타임을 최소화해야 한다.", "notes": "유지보수 계획"},
            {"level": "expert", "sentence": "Unplanned downtime costs significantly more than scheduled maintenance windows.", "translation": "계획되지 않은 다운타임은 예정된 유지보수 시간보다 훨씬 더 많은 비용이 든다.", "notes": "비용 분석"}
        ],
        "throughput": [
            {"level": "intermediate", "sentence": "Our system can handle a throughput of 1000 transactions per second.", "translation": "우리 시스템은 초당 1000건의 트랜잭션 처리량을 처리할 수 있습니다.", "notes": "시스템 용량"},
            {"level": "advanced", "sentence": "Improving throughput is our top priority for this quarter.", "translation": "처리량 향상이 이번 분기의 최우선 과제이다.", "notes": "성과 목표"},
            {"level": "expert", "sentence": "Throughput optimization requires balancing speed, quality, and resource utilization.", "translation": "처리량 최적화는 속도, 품질, 자원 활용의 균형을 맞추어야 한다.", "notes": "시스템 설계 원칙"}
        ],
        "bottleneck": [
            {"level": "intermediate", "sentence": "The approval process is the main bottleneck in our workflow.", "translation": "승인 프로세스가 우리 워크플로의 주요 병목 현상입니다.", "notes": "프로세스 문제"},
            {"level": "advanced", "sentence": "We identified three bottlenecks that are slowing down production.", "translation": "생산을 늦추는 세 가지 병목 현상을 식별했다.", "notes": "문제 진단"},
            {"level": "expert", "sentence": "Theory of Constraints teaches that improving non-bottleneck resources doesn't increase overall throughput.", "translation": "제약 이론은 병목이 아닌 자원을 개선해도 전체 처리량이 증가하지 않는다고 가르친다.", "notes": "경영 이론"}
        ],
        "benchmark": [
            {"level": "intermediate", "sentence": "We use industry benchmarks to evaluate our performance.", "translation": "우리는 성과를 평가하기 위해 업계 벤치마크를 사용합니다.", "notes": "성과 비교"},
            {"level": "advanced", "sentence": "Our customer satisfaction score exceeds the benchmark by 12 points.", "translation": "우리의 고객 만족도 점수는 벤치마크를 12점 초과한다.", "notes": "경쟁 우위"},
            {"level": "expert", "sentence": "Benchmarking against best-in-class competitors drives continuous improvement.", "translation": "최고 수준의 경쟁자를 벤치마킹하는 것은 지속적인 개선을 촉진한다.", "notes": "경영 전략"}
        ],
        "anomaly": [
            {"level": "intermediate", "sentence": "We detected an anomaly in the sales data for last Tuesday.", "translation": "지난 화요일 판매 데이터에서 이상 현상을 감지했습니다.", "notes": "데이터 모니터링"},
            {"level": "advanced", "sentence": "Our anomaly detection system flagged several unusual transactions.", "translation": "우리의 이상 탐지 시스템이 몇 가지 비정상적인 거래를 표시했다.", "notes": "자동화 시스템"},
            {"level": "expert", "sentence": "Machine learning excels at identifying subtle anomalies that humans might miss.", "translation": "머신 러닝은 인간이 놓칠 수 있는 미묘한 이상 현상을 식별하는 데 탁월하다.", "notes": "AI 응용"}
        ]
    }
}

def improve_week_examples(week_num):
    """Week 파일의 examples 섹션 개선"""
    week_str = str(week_num)

    if week_str not in IMPROVED_EXAMPLES:
        print(f"[SKIP] Week {week_num}: 개선 데이터 없음")
        return False

    file_path = f"C:\\Users\\hynoo\\Downloads\\elite_track_weeks9-16_plus_placement\\week-{week_num}-vocabulary-elite.json"

    if not os.path.exists(file_path):
        print(f"[ERROR] Week {week_num}: 파일 없음")
        return False

    # JSON 파일 읽기
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # examples 섹션 교체
    improved_examples = IMPROVED_EXAMPLES[week_str]

    for word, examples in improved_examples.items():
        if word in data['content']['examples']:
            data['content']['examples'][word] = [
                {
                    "level": ex['level'],
                    "sentence": ex['sentence'],
                    "translation": ex['translation'],
                    "notes": ex['notes'],
                    "audioUrl": data['content']['examples'][word][i]['audioUrl']
                }
                for i, ex in enumerate(examples)
            ]

    # JSON 파일 쓰기
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"[OK] Week {week_num}: {len(improved_examples)} 단어 개선 완료")
    return True

def main():
    """메인 실행"""
    print("Elite Track 예문 개선 시작\n")

    success_count = 0

    for week in range(10, 17):
        if improve_week_examples(week):
            success_count += 1

    print(f"\n완료: {success_count}개 Week 개선")

if __name__ == '__main__':
    main()
