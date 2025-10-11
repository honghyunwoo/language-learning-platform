/**
 * Stripe Checkout Session API
 * 결제 페이지 생성
 */

import { NextRequest, NextResponse } from 'next/server';

// 실제 구현 시 Stripe SDK를 사용
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2024-11-20.acacia',
// });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email, priceId, planId, billingCycle, successUrl, cancelUrl } = body;

    // 입력 검증
    if (!userId || !email || !priceId || !planId || !billingCycle || !successUrl || !cancelUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 실제 구현 시:
    // 1. Stripe Customer 생성 또는 기존 customer 조회
    // const customer = await stripe.customers.create({
    //   email,
    //   metadata: {
    //     userId,
    //   },
    // });

    // 2. Checkout Session 생성
    // const session = await stripe.checkout.sessions.create({
    //   customer: customer.id,
    //   payment_method_types: ['card'],
    //   line_items: [
    //     {
    //       price: priceId,
    //       quantity: 1,
    //     },
    //   ],
    //   mode: 'subscription',
    //   success_url: successUrl,
    //   cancel_url: cancelUrl,
    //   metadata: {
    //     userId,
    //     planId,
    //     billingCycle,
    //   },
    // });

    // 3. Firestore에 결제 시도 기록
    // await db.collection('pendingPayments').doc(session.id).set({
    //   userId,
    //   email,
    //   planId,
    //   billingCycle,
    //   sessionId: session.id,
    //   status: 'pending',
    //   createdAt: new Date(),
    // });

    // 개발 환경용 Mock 응답
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        url: `${successUrl}?session_id=mock_session_id`,
        sessionId: 'mock_session_id',
      });
    }

    // 프로덕션에서는 실제 Stripe 세션 URL 반환
    // return NextResponse.json({
    //   url: session.url,
    //   sessionId: session.id,
    // });

    return NextResponse.json(
      { error: 'Stripe integration not configured' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
