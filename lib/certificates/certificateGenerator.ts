/**
 * Certificate Generator - 인증서 발급 시스템
 * 영어의 정석 - LinkedIn 연동 가능한 PDF 인증서 생성
 */

import { CEFRLevel } from '@/lib/types/activity';
import { getCEFRLevel } from '@/lib/cefr/levels';

// ===== 인증서 타입 =====
export type CertificateType = 'completion' | 'achievement' | 'proficiency' | 'special';

// ===== 인증서 데이터 =====
export interface CertificateData {
  id: string;
  type: CertificateType;
  recipientName: string;
  userId: string;
  level: CEFRLevel;
  courseName: string;
  completionDate: Date;
  issueDate: Date;
  score?: number; // 0-100
  grade?: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C';
  hoursCompleted?: number;
  activitiesCompleted?: number;
  verificationCode: string;
  linkedInShareUrl?: string;
}

// ===== 인증서 템플릿 =====
export interface CertificateTemplate {
  width: number;
  height: number;
  backgroundColor: string;
  borderColor: string;
  logoUrl?: string;
  layout: 'classic' | 'modern' | 'minimal';
}

// ===== 인증서 생성기 (서버사이드) =====
export async function generateCertificateData(
  userId: string,
  recipientName: string,
  level: CEFRLevel,
  score: number,
  hoursCompleted: number,
  activitiesCompleted: number
): Promise<CertificateData> {
  const levelDef = getCEFRLevel(level);
  const now = new Date();

  // 검증 코드 생성 (실제로는 더 복잡한 암호화 필요)
  const verificationCode = generateVerificationCode(userId, level, now);

  return {
    id: `cert_${userId}_${level}_${now.getTime()}`,
    type: 'completion',
    recipientName,
    userId,
    level,
    courseName: `English Proficiency - ${levelDef?.koreanName || level}`,
    completionDate: now,
    issueDate: now,
    score,
    grade: calculateGrade(score),
    hoursCompleted,
    activitiesCompleted,
    verificationCode,
  };
}

// ===== 성적 계산 =====
function calculateGrade(score: number): 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'B+';
  if (score >= 80) return 'B';
  if (score >= 75) return 'C+';
  return 'C';
}

// ===== 검증 코드 생성 =====
function generateVerificationCode(userId: string, level: CEFRLevel, date: Date): string {
  // 실제로는 더 안전한 암호화 방식 사용 필요
  const timestamp = date.getTime().toString(36);
  const userHash = userId.substring(0, 4).toUpperCase();
  const levelCode = level.replace('.', '');

  return `ELP-${userHash}-${levelCode}-${timestamp}`;
}

// ===== LinkedIn 공유 URL 생성 =====
export function generateLinkedInShareUrl(certificate: CertificateData): string {
  const baseUrl = 'https://www.linkedin.com/profile/add';

  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: `영어의 정석 - ${certificate.courseName}`,
    organizationId: '', // LinkedIn Organization ID (필요시 추가)
    issueYear: certificate.issueDate.getFullYear().toString(),
    issueMonth: (certificate.issueDate.getMonth() + 1).toString(),
    certUrl: `https://yourdomain.com/verify/${certificate.verificationCode}`,
    certId: certificate.verificationCode,
  });

  return `${baseUrl}?${params.toString()}`;
}

// ===== 인증서 검증 =====
export async function verifyCertificate(verificationCode: string): Promise<{
  valid: boolean;
  certificate?: CertificateData;
  error?: string;
}> {
  try {
    // 실제로는 데이터베이스에서 검증 코드로 인증서 조회
    // 여기서는 간단한 예시만 제공

    // 검증 코드 형식 확인
    if (!verificationCode.startsWith('ELP-')) {
      return {
        valid: false,
        error: '잘못된 인증서 코드 형식입니다',
      };
    }

    // 실제 구현에서는 Firestore 등에서 조회
    // const certificate = await db.collection('certificates').where('verificationCode', '==', verificationCode).get();

    return {
      valid: true,
      // certificate: certificateData,
    };
  } catch (error) {
    return {
      valid: false,
      error: '인증서 검증 중 오류가 발생했습니다',
    };
  }
}

// ===== 인증서 메타데이터 =====
export interface CertificateMetadata {
  id: string;
  recipientName: string;
  level: CEFRLevel;
  issueDate: Date;
  verificationCode: string;
  pdfUrl?: string;
  linkedInShared: boolean;
}

// ===== 인증서 목록 조회 (사용자별) =====
export async function getUserCertificates(userId: string): Promise<CertificateMetadata[]> {
  // 실제로는 Firestore에서 조회
  // const snapshot = await db.collection('certificates').where('userId', '==', userId).get();
  // return snapshot.docs.map(doc => doc.data() as CertificateMetadata);

  return [];
}

// ===== 인증서 발급 자격 확인 =====
export function isEligibleForCertificate(
  level: CEFRLevel,
  completionRate: number,
  averageScore: number
): {
  eligible: boolean;
  reason?: string;
} {
  // 완료율 80% 이상
  if (completionRate < 80) {
    return {
      eligible: false,
      reason: '레벨 완료율이 80% 미만입니다',
    };
  }

  // 평균 점수 75점 이상
  if (averageScore < 75) {
    return {
      eligible: false,
      reason: '평균 점수가 75점 미만입니다',
    };
  }

  return {
    eligible: true,
  };
}

// ===== 인증서 템플릿 선택 =====
export function getCertificateTemplate(type: CertificateType): CertificateTemplate {
  const templates: Record<CertificateType, CertificateTemplate> = {
    completion: {
      width: 297, // A4 landscape (mm)
      height: 210,
      backgroundColor: '#ffffff',
      borderColor: '#3b82f6',
      layout: 'classic',
    },
    achievement: {
      width: 297,
      height: 210,
      backgroundColor: '#f8fafc',
      borderColor: '#f59e0b',
      layout: 'modern',
    },
    proficiency: {
      width: 297,
      height: 210,
      backgroundColor: '#ffffff',
      borderColor: '#8b5cf6',
      layout: 'classic',
    },
    special: {
      width: 297,
      height: 210,
      backgroundColor: '#fef3c7',
      borderColor: '#ef4444',
      layout: 'modern',
    },
  };

  return templates[type];
}

// ===== 인증서 HTML 생성 (PDF 변환용) =====
export function generateCertificateHTML(certificate: CertificateData): string {
  const levelDef = getCEFRLevel(certificate.level);

  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A4 landscape;
      margin: 0;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: 'Noto Serif KR', serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      width: 297mm;
      height: 210mm;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .certificate {
      width: 280mm;
      height: 195mm;
      background: white;
      padding: 20mm;
      border: 5px solid ${levelDef?.color || '#3b82f6'};
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo {
      font-size: 48px;
      font-weight: bold;
      color: ${levelDef?.color || '#3b82f6'};
      margin-bottom: 10px;
    }
    .title {
      font-size: 36px;
      color: #1f2937;
      margin: 20px 0;
    }
    .subtitle {
      font-size: 18px;
      color: #6b7280;
      margin-bottom: 30px;
    }
    .recipient {
      font-size: 32px;
      color: #1f2937;
      font-weight: bold;
      margin: 20px 0;
      border-bottom: 2px solid ${levelDef?.color || '#3b82f6'};
      display: inline-block;
      padding-bottom: 10px;
    }
    .content {
      text-align: center;
      line-height: 1.8;
    }
    .achievement {
      font-size: 18px;
      color: #374151;
      margin: 20px 0;
    }
    .stats {
      display: flex;
      justify-content: space-around;
      margin: 30px 0;
    }
    .stat {
      text-align: center;
    }
    .stat-value {
      font-size: 28px;
      font-weight: bold;
      color: ${levelDef?.color || '#3b82f6'};
    }
    .stat-label {
      font-size: 14px;
      color: #6b7280;
      margin-top: 5px;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      font-size: 14px;
      color: #9ca3af;
    }
    .verification {
      margin-top: 20px;
      font-size: 12px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="header">
      <div class="logo">📚 영어의 정석</div>
      <div class="title">Certificate of Completion</div>
      <div class="subtitle">This is to certify that</div>
    </div>

    <div class="content">
      <div class="recipient">${certificate.recipientName}</div>

      <div class="achievement">
        has successfully completed the<br>
        <strong>${certificate.courseName}</strong><br>
        demonstrating proficiency at <strong>${levelDef?.name || certificate.level}</strong> level
      </div>

      <div class="stats">
        <div class="stat">
          <div class="stat-value">${certificate.score}%</div>
          <div class="stat-label">Final Score</div>
        </div>
        <div class="stat">
          <div class="stat-value">${certificate.grade}</div>
          <div class="stat-label">Grade</div>
        </div>
        <div class="stat">
          <div class="stat-value">${certificate.hoursCompleted}h</div>
          <div class="stat-label">Hours Completed</div>
        </div>
        <div class="stat">
          <div class="stat-value">${certificate.activitiesCompleted}</div>
          <div class="stat-label">Activities</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div>Issued on ${certificate.issueDate.toLocaleDateString('ko-KR')}</div>
      <div class="verification">
        Verification Code: <strong>${certificate.verificationCode}</strong><br>
        Verify at: https://yourdomain.com/verify/${certificate.verificationCode}
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
