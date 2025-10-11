import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '개인정보 처리방침 - 영어의 정석',
  description: '영어의 정석 플랫폼의 개인정보 수집 및 이용에 관한 방침',
  robots: 'noindex',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <Link
            href="/"
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            ← 홈으로 돌아가기
          </Link>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* 제목 */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            개인정보 처리방침
          </h1>
          <p className="text-sm text-gray-600">
            최종 수정일: 2025년 10월 11일
          </p>
        </div>

        {/* 섹션 1: 개요 */}
        <section className="mb-8 rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            1. 개요
          </h2>
          <p className="mb-4 text-gray-700">
            영어의 정석(이하 "서비스")은 이용자의 개인정보를 매우 중요하게
            생각하며, 개인정보보호법을 준수합니다. 본 방침은 서비스 이용 과정에서
            수집되는 개인정보의 항목, 이용 목적, 보관 기간 등을 명시합니다.
          </p>
        </section>

        {/* 섹션 2: 수집하는 개인정보 */}
        <section className="mb-8 rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            2. 수집하는 개인정보 항목
          </h2>

          <h3 className="mb-2 font-semibold text-gray-900">
            2.1 회원가입 시
          </h3>
          <ul className="mb-4 ml-6 list-disc text-gray-700">
            <li>필수: 이메일 주소, 비밀번호</li>
            <li>선택: 닉네임, 프로필 사진</li>
          </ul>

          <h3 className="mb-2 font-semibold text-gray-900">
            2.2 소셜 로그인 시 (Google OAuth)
          </h3>
          <ul className="mb-4 ml-6 list-disc text-gray-700">
            <li>Google 계정 이메일, 이름, 프로필 사진</li>
          </ul>

          <h3 className="mb-2 font-semibold text-gray-900">
            2.3 서비스 이용 과정에서 자동 수집
          </h3>
          <ul className="mb-4 ml-6 list-disc text-gray-700">
            <li>학습 활동 기록 (Activity 완료, 점수, 소요 시간)</li>
            <li>학습 진행 상황 (주차별 진도율)</li>
            <li>커뮤니티 활동 (게시글, 댓글, 스터디 그룹 가입)</li>
            <li>접속 로그 (IP 주소, 접속 시간, 서비스 이용 기록)</li>
          </ul>
        </section>

        {/* 섹션 3: 개인정보 이용 목적 */}
        <section className="mb-8 rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            3. 개인정보의 이용 목적
          </h2>
          <ul className="ml-6 list-disc space-y-2 text-gray-700">
            <li>회원 관리: 회원가입, 본인 확인, 로그인 인증</li>
            <li>
              서비스 제공: 맞춤형 학습 콘텐츠 추천, 진행 상황 추적,
              커뮤니티 기능 제공
            </li>
            <li>
              서비스 개선: 이용 패턴 분석, 신규 기능 개발, 품질 향상
            </li>
            <li>
              고객 지원: 문의 응대, 공지사항 전달, 서비스 관련 알림
            </li>
            <li>보안: 부정 이용 방지, 비인가 접근 차단</li>
          </ul>
        </section>

        {/* 섹션 4: 개인정보 보관 기간 */}
        <section className="mb-8 rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            4. 개인정보의 보관 기간
          </h2>
          <ul className="ml-6 list-disc space-y-2 text-gray-700">
            <li>
              회원 탈퇴 시: 즉시 파기 (법령에 따라 보관이 필요한 경우 예외)
            </li>
            <li>학습 기록: 회원 탈퇴 후 30일 이내 파기</li>
            <li>
              접속 로그: 통신비밀보호법에 따라 3개월 보관 후 파기
            </li>
            <li>
              법령에 따른 보관:
              <ul className="ml-6 mt-2 list-circle text-sm">
                <li>계약 또는 청약철회 기록: 5년</li>
                <li>대금결제 및 재화 공급 기록: 5년</li>
                <li>소비자 불만 또는 분쟁 처리 기록: 3년</li>
              </ul>
            </li>
          </ul>
        </section>

        {/* 섹션 5: 개인정보 제3자 제공 */}
        <section className="mb-8 rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            5. 개인정보의 제3자 제공
          </h2>
          <p className="mb-4 text-gray-700">
            원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
            다만, 다음의 경우는 예외로 합니다:
          </p>
          <ul className="ml-6 list-disc space-y-2 text-gray-700">
            <li>이용자가 사전에 동의한 경우</li>
            <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
          </ul>
        </section>

        {/* 섹션 6: 개인정보 처리 위탁 */}
        <section className="mb-8 rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            6. 개인정보 처리 위탁
          </h2>
          <p className="mb-4 text-gray-700">
            서비스 이용을 위해 다음의 제3자 서비스에 개인정보 처리를 위탁합니다:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border-b px-4 py-2">수탁업체</th>
                  <th className="border-b px-4 py-2">위탁 업무</th>
                  <th className="border-b px-4 py-2">보관 기간</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b px-4 py-2">Google Firebase</td>
                  <td className="border-b px-4 py-2">인증, 데이터베이스, 호스팅</td>
                  <td className="border-b px-4 py-2">회원 탈퇴 시까지</td>
                </tr>
                <tr>
                  <td className="border-b px-4 py-2">Vercel</td>
                  <td className="border-b px-4 py-2">웹 호스팅, CDN</td>
                  <td className="border-b px-4 py-2">서비스 이용 기간</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 섹션 7: 이용자 권리 */}
        <section className="mb-8 rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            7. 이용자의 권리와 행사 방법
          </h2>
          <p className="mb-4 text-gray-700">
            이용자는 언제든지 다음의 권리를 행사할 수 있습니다:
          </p>
          <ul className="ml-6 list-disc space-y-2 text-gray-700">
            <li>개인정보 열람 요구</li>
            <li>개인정보 정정 요구</li>
            <li>개인정보 삭제 요구</li>
            <li>개인정보 처리 정지 요구</li>
            <li>회원 탈퇴 (개인정보 파기 요청)</li>
          </ul>
          <p className="mt-4 text-gray-700">
            권리 행사는 대시보드의 "내 프로필" 메뉴에서 직접 수행하거나,
            고객센터를 통해 요청할 수 있습니다.
          </p>
        </section>

        {/* 섹션 8: 쿠키 및 로컬 스토리지 */}
        <section className="mb-8 rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            8. 쿠키 및 로컬 스토리지 사용
          </h2>
          <p className="mb-4 text-gray-700">
            서비스는 다음의 목적으로 쿠키 및 로컬 스토리지를 사용합니다:
          </p>
          <ul className="ml-6 list-disc space-y-2 text-gray-700">
            <li>로그인 세션 유지 (Firebase Authentication Token)</li>
            <li>학습 진행 상황 로컬 캐시 (React Query Persister)</li>
            <li>오프라인 학습 지원 (Service Worker Cache)</li>
          </ul>
          <p className="mt-4 text-gray-700">
            이용자는 브라우저 설정을 통해 쿠키 및 로컬 스토리지 사용을 거부할 수 있으나,
            이 경우 일부 서비스 이용에 제한이 있을 수 있습니다.
          </p>
        </section>

        {/* 섹션 9: 개인정보 보호책임자 */}
        <section className="mb-8 rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            9. 개인정보 보호책임자
          </h2>
          <p className="mb-4 text-gray-700">
            개인정보 처리에 관한 문의사항이 있으시면 아래로 연락주시기 바랍니다:
          </p>
          <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
            <p className="mb-2"><strong>개인정보 보호책임자:</strong> 영어의 정석 운영팀</p>
            <p className="mb-2"><strong>이메일:</strong> privacy@example.com</p>
            <p><strong>응답 시간:</strong> 영업일 기준 3일 이내</p>
          </div>
        </section>

        {/* 섹션 10: 방침 변경 */}
        <section className="rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            10. 개인정보 처리방침 변경
          </h2>
          <p className="text-gray-700">
            본 방침은 법령 및 서비스 변경에 따라 수정될 수 있습니다.
            중요한 변경 사항은 홈페이지 공지사항을 통해 최소 7일 전에 공지합니다.
          </p>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="border-t bg-white py-8">
        <div className="mx-auto max-w-4xl px-4 text-center text-sm text-gray-600">
          <p>© 2025 영어의 정석. All rights reserved.</p>
          <div className="mt-2">
            <Link href="/about" className="text-indigo-600 hover:text-indigo-800">
              소개
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
