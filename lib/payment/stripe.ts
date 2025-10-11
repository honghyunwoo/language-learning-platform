/**
 * Stripe Payment Integration - 결제 시스템
 * 프리미엄 구독 및 일회성 결제 처리
 */

import { CEFRLevel } from '@/lib/types/activity';

// ===== 가격 플랜 =====
export type PricingPlan = 'free' | 'basic' | 'premium' | 'enterprise';

export interface PricingTier {
  id: PricingPlan;
  name: string;
  koreanName: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
    currency: 'KRW' | 'USD';
  };
  stripePriceId: {
    monthly: string;
    yearly: string;
  };
  features: {
    name: string;
    included: boolean;
    description?: string;
  }[];
  limits: {
    maxActivitiesPerWeek: number | 'unlimited';
    aiConversationMinutes: number | 'unlimited';
    certificatesPerYear: number | 'unlimited';
    advancedAnalytics: boolean;
    personalizedPath: boolean;
    prioritySupport: boolean;
  };
  popular?: boolean;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    koreanName: '무료',
    description: '기본 학습 기능 체험',
    price: {
      monthly: 0,
      yearly: 0,
      currency: 'KRW',
    },
    stripePriceId: {
      monthly: '',
      yearly: '',
    },
    features: [
      { name: '주 2개 Activity 학습', included: true },
      { name: 'AI 대화 파트너 (10분/월)', included: true },
      { name: '기본 통계', included: true },
      { name: '학습 일지', included: true },
      { name: '커뮤니티 접근', included: true },
      { name: '개인화 학습 경로', included: false },
      { name: '고급 분석', included: false },
      { name: '무제한 AI 대화', included: false },
      { name: '수료증 발급', included: false },
    ],
    limits: {
      maxActivitiesPerWeek: 2,
      aiConversationMinutes: 10,
      certificatesPerYear: 0,
      advancedAnalytics: false,
      personalizedPath: false,
      prioritySupport: false,
    },
  },
  {
    id: 'basic',
    name: 'Basic',
    koreanName: '베이직',
    description: '체계적인 영어 학습 시작',
    price: {
      monthly: 19000,
      yearly: 190000, // 2개월 무료
      currency: 'KRW',
    },
    stripePriceId: {
      monthly: 'price_basic_monthly_krw', // 실제 Stripe Price ID로 교체
      yearly: 'price_basic_yearly_krw',
    },
    features: [
      { name: '주 6개 Activity 학습', included: true },
      { name: 'AI 대화 파트너 (60분/월)', included: true },
      { name: '기본 통계', included: true },
      { name: '학습 일지', included: true },
      { name: '커뮤니티 접근', included: true },
      { name: '개인화 학습 경로', included: true },
      { name: '고급 분석', included: false },
      { name: '무제한 AI 대화', included: false },
      { name: '수료증 발급 (연 2회)', included: true },
    ],
    limits: {
      maxActivitiesPerWeek: 6,
      aiConversationMinutes: 60,
      certificatesPerYear: 2,
      advancedAnalytics: false,
      personalizedPath: true,
      prioritySupport: false,
    },
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    koreanName: '프리미엄',
    description: '전문가 수준 학습 경험',
    price: {
      monthly: 39000,
      yearly: 390000, // 2개월 무료
      currency: 'KRW',
    },
    stripePriceId: {
      monthly: 'price_premium_monthly_krw',
      yearly: 'price_premium_yearly_krw',
    },
    features: [
      { name: '무제한 Activity 학습', included: true },
      { name: '무제한 AI 대화 파트너', included: true },
      { name: '고급 분석 및 AI 피드백', included: true },
      { name: '학습 일지', included: true },
      { name: '커뮤니티 접근', included: true },
      { name: '개인화 학습 경로', included: true },
      { name: '1:1 튜터링 (월 1회)', included: true },
      { name: '무제한 수료증 발급', included: true },
      { name: '우선 지원', included: true },
    ],
    limits: {
      maxActivitiesPerWeek: 'unlimited',
      aiConversationMinutes: 'unlimited',
      certificatesPerYear: 'unlimited',
      advancedAnalytics: true,
      personalizedPath: true,
      prioritySupport: true,
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    koreanName: '기업',
    description: '기업 맞춤형 솔루션',
    price: {
      monthly: 0, // 문의 필요
      yearly: 0,
      currency: 'KRW',
    },
    stripePriceId: {
      monthly: '',
      yearly: '',
    },
    features: [
      { name: '모든 Premium 기능', included: true },
      { name: '팀 대시보드', included: true },
      { name: '진도 추적 및 리포트', included: true },
      { name: '맞춤형 커리큘럼', included: true },
      { name: 'SSO 통합', included: true },
      { name: '전담 계정 매니저', included: true },
      { name: 'API 접근', included: true },
      { name: '온프레미스 옵션', included: true },
    ],
    limits: {
      maxActivitiesPerWeek: 'unlimited',
      aiConversationMinutes: 'unlimited',
      certificatesPerYear: 'unlimited',
      advancedAnalytics: true,
      personalizedPath: true,
      prioritySupport: true,
    },
  },
];

// ===== 결제 세션 타입 =====
export interface CreateCheckoutSessionParams {
  userId: string;
  email: string;
  planId: PricingPlan;
  billingCycle: 'monthly' | 'yearly';
  successUrl: string;
  cancelUrl: string;
}

export interface StripeCustomer {
  id: string;
  userId: string;
  email: string;
  stripeCustomerId: string;
  subscriptionId?: string;
  subscriptionStatus?: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  currentPlan: PricingPlan;
  billingCycle: 'monthly' | 'yearly';
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  planId: PricingPlan;
  billingCycle: 'monthly' | 'yearly';
  createdAt: Date;
}

// ===== Stripe Checkout Session 생성 =====
export async function createCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<{ url: string; sessionId: string } | { error: string }> {
  try {
    const plan = PRICING_TIERS.find((p) => p.id === params.planId);

    if (!plan || plan.id === 'free' || plan.id === 'enterprise') {
      return { error: 'Invalid plan for checkout' };
    }

    const priceId =
      params.billingCycle === 'monthly'
        ? plan.stripePriceId.monthly
        : plan.stripePriceId.yearly;

    // 실제 구현에서는 /api/stripe/create-checkout-session 엔드포인트 호출
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: params.userId,
        email: params.email,
        priceId,
        planId: params.planId,
        billingCycle: params.billingCycle,
        successUrl: params.successUrl,
        cancelUrl: params.cancelUrl,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message || 'Failed to create checkout session' };
    }

    const data = await response.json();
    return { url: data.url, sessionId: data.sessionId };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// ===== 고객 포털 세션 생성 (구독 관리) =====
export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
): Promise<{ url: string } | { error: string }> {
  try {
    const response = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message || 'Failed to create portal session' };
    }

    const data = await response.json();
    return { url: data.url };
  } catch (error) {
    console.error('Error creating portal session:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// ===== 사용량 확인 (현재 플랜 한도) =====
export function checkUsageLimits(
  plan: PricingPlan,
  usage: {
    activitiesThisWeek: number;
    aiMinutesThisMonth: number;
    certificatesThisYear: number;
  }
): {
  canAccessActivity: boolean;
  canUseAIConversation: boolean;
  canIssueCertificate: boolean;
  limits: PricingTier['limits'];
} {
  const tier = PRICING_TIERS.find((p) => p.id === plan);

  if (!tier) {
    // 기본값: Free 플랜
    return {
      canAccessActivity: false,
      canUseAIConversation: false,
      canIssueCertificate: false,
      limits: PRICING_TIERS[0].limits,
    };
  }

  const canAccessActivity =
    tier.limits.maxActivitiesPerWeek === 'unlimited' ||
    usage.activitiesThisWeek < tier.limits.maxActivitiesPerWeek;

  const canUseAIConversation =
    tier.limits.aiConversationMinutes === 'unlimited' ||
    usage.aiMinutesThisMonth < tier.limits.aiConversationMinutes;

  const canIssueCertificate =
    tier.limits.certificatesPerYear === 'unlimited' ||
    usage.certificatesThisYear < tier.limits.certificatesPerYear;

  return {
    canAccessActivity,
    canUseAIConversation,
    canIssueCertificate,
    limits: tier.limits,
  };
}

// ===== 할인 쿠폰 검증 =====
export interface CouponCode {
  code: string;
  discountPercent: number;
  validUntil: Date;
  maxUses: number;
  currentUses: number;
  applicablePlans: PricingPlan[];
}

export async function validateCoupon(code: string, planId: PricingPlan): Promise<{
  valid: boolean;
  discountPercent?: number;
  error?: string;
}> {
  try {
    const response = await fetch('/api/stripe/validate-coupon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, planId }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { valid: false, error: error.message };
    }

    const data = await response.json();
    return { valid: true, discountPercent: data.discountPercent };
  } catch (error) {
    console.error('Error validating coupon:', error);
    return { valid: false, error: 'Failed to validate coupon' };
  }
}

// ===== 가격 계산 =====
export function calculatePrice(
  planId: PricingPlan,
  billingCycle: 'monthly' | 'yearly',
  discountPercent: number = 0
): {
  originalPrice: number;
  discountedPrice: number;
  savings: number;
  currency: string;
} {
  const plan = PRICING_TIERS.find((p) => p.id === planId);

  if (!plan) {
    return {
      originalPrice: 0,
      discountedPrice: 0,
      savings: 0,
      currency: 'KRW',
    };
  }

  const originalPrice = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
  const discount = Math.round(originalPrice * (discountPercent / 100));
  const discountedPrice = originalPrice - discount;

  // 연간 결제 시 추가 절약 금액 (월간 * 12와의 차이)
  let savings = discount;
  if (billingCycle === 'yearly') {
    const monthlyTotal = plan.price.monthly * 12;
    savings = monthlyTotal - discountedPrice;
  }

  return {
    originalPrice,
    discountedPrice,
    savings,
    currency: plan.price.currency,
  };
}

// ===== 플랜 비교 =====
export function comparePlans(planIds: PricingPlan[]): {
  feature: string;
  values: Record<PricingPlan, string | boolean>;
}[] {
  const allFeatures = new Set<string>();
  const plans = PRICING_TIERS.filter((p) => planIds.includes(p.id));

  plans.forEach((plan) => {
    plan.features.forEach((feature) => {
      allFeatures.add(feature.name);
    });
  });

  const comparison: {
    feature: string;
    values: Record<string, string | boolean>;
  }[] = [];

  allFeatures.forEach((featureName) => {
    const row: { feature: string; values: Record<string, string | boolean> } = {
      feature: featureName,
      values: {},
    };

    plans.forEach((plan) => {
      const feature = plan.features.find((f) => f.name === featureName);
      row.values[plan.id] = feature ? feature.included : false;
    });

    comparison.push(row);
  });

  return comparison;
}

// ===== 구독 업그레이드/다운그레이드 =====
export async function updateSubscription(
  userId: string,
  newPlanId: PricingPlan,
  newBillingCycle: 'monthly' | 'yearly'
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/stripe/update-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        newPlanId,
        newBillingCycle,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating subscription:', error);
    return { success: false, error: 'Failed to update subscription' };
  }
}

// ===== 환불 처리 =====
export async function requestRefund(
  paymentIntentId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/stripe/refund', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentIntentId,
        reason,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error requesting refund:', error);
    return { success: false, error: 'Failed to request refund' };
  }
}
