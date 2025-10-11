/**
 * PDF Generator (Client-side)
 * jsPDF와 html2canvas를 사용한 클라이언트 사이드 PDF 생성
 */

'use client';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CertificateData, generateCertificateHTML } from './certificateGenerator';

// ===== HTML을 PDF로 변환 =====
export async function generatePDFFromHTML(
  htmlContent: string,
  fileName: string = 'certificate.pdf'
): Promise<Blob> {
  // 임시 div 생성
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '0';
  document.body.appendChild(tempDiv);

  try {
    // HTML을 캔버스로 변환
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      logging: false,
      width: 1122, // A4 landscape 297mm = 1122px at 96dpi
      height: 794, // A4 landscape 210mm = 794px at 96dpi
    });

    // jsPDF 생성 (A4 landscape)
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // 캔버스를 PDF에 추가
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);

    // Blob 반환
    return pdf.output('blob');
  } finally {
    // 임시 div 제거
    document.body.removeChild(tempDiv);
  }
}

// ===== 인증서 PDF 생성 =====
export async function generateCertificatePDF(
  certificate: CertificateData
): Promise<Blob> {
  const htmlContent = generateCertificateHTML(certificate);
  return generatePDFFromHTML(htmlContent, `certificate_${certificate.id}.pdf`);
}

// ===== PDF 다운로드 =====
export function downloadPDF(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

// ===== 인증서 다운로드 (통합 함수) =====
export async function downloadCertificate(certificate: CertificateData): Promise<void> {
  try {
    const pdfBlob = await generateCertificatePDF(certificate);
    const fileName = `Certificate_${certificate.recipientName}_${certificate.level}_${certificate.issueDate.getFullYear()}.pdf`;
    downloadPDF(pdfBlob, fileName);
  } catch (error) {
    console.error('인증서 생성 중 오류:', error);
    throw new Error('인증서 생성에 실패했습니다');
  }
}

// ===== PDF 미리보기 (새 창) =====
export async function previewCertificatePDF(certificate: CertificateData): Promise<void> {
  try {
    const pdfBlob = await generateCertificatePDF(certificate);
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');

    // 5초 후 URL 해제 (메모리 누수 방지)
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  } catch (error) {
    console.error('인증서 미리보기 중 오류:', error);
    throw new Error('인증서 미리보기에 실패했습니다');
  }
}

// ===== Base64 인코딩 =====
export async function certificateToBase64(certificate: CertificateData): Promise<string> {
  const pdfBlob = await generateCertificatePDF(certificate);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(pdfBlob);
  });
}

// ===== Firebase Storage 업로드 (optional) =====
export async function uploadCertificateToStorage(
  certificate: CertificateData,
  uploadFn: (blob: Blob, path: string) => Promise<string>
): Promise<string> {
  try {
    const pdfBlob = await generateCertificatePDF(certificate);
    const path = `certificates/${certificate.userId}/${certificate.id}.pdf`;
    const downloadUrl = await uploadFn(pdfBlob, path);
    return downloadUrl;
  } catch (error) {
    console.error('인증서 업로드 중 오류:', error);
    throw new Error('인증서 업로드에 실패했습니다');
  }
}
