/**
 * Stripe Webhook Handler
 * Stripe 이벤트(결제 성공, 구독 취소 등)를 처리
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// import Stripe from 'stripe';
// import { db } from '@/lib/firebase/config';
// import { doc, setDoc, updateDoc } from 'firebase/firestore';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2024-11-20.acacia',
// });

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
    }

    // 실제 구현 시:
    // 1. Webhook 서명 검증
    // let event: Stripe.Event;
    // try {
    //   event = stripe.webhooks.constructEvent(
    //     body,
    //     signature,
    //     process.env.STRIPE_WEBHOOK_SECRET!
    //   );
    // } catch (err) {
    //   console.error('Webhook signature verification failed:', err);
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    // }

    // 2. 이벤트 타입별 처리
    // switch (event.type) {
    //   case 'checkout.session.completed': {
    //     const session = event.data.object as Stripe.Checkout.Session;
    //     await handleCheckoutSessionCompleted(session);
    //     break;
    //   }
    //   case 'customer.subscription.created': {
    //     const subscription = event.data.object as Stripe.Subscription;
    //     await handleSubscriptionCreated(subscription);
    //     break;
    //   }
    //   case 'customer.subscription.updated': {
    //     const subscription = event.data.object as Stripe.Subscription;
    //     await handleSubscriptionUpdated(subscription);
    //     break;
    //   }
    //   case 'customer.subscription.deleted': {
    //     const subscription = event.data.object as Stripe.Subscription;
    //     await handleSubscriptionDeleted(subscription);
    //     break;
    //   }
    //   case 'invoice.payment_succeeded': {
    //     const invoice = event.data.object as Stripe.Invoice;
    //     await handleInvoicePaymentSucceeded(invoice);
    //     break;
    //   }
    //   case 'invoice.payment_failed': {
    //     const invoice = event.data.object as Stripe.Invoice;
    //     await handleInvoicePaymentFailed(invoice);
    //     break;
    //   }
    //   default:
    //     console.log(`Unhandled event type: ${event.type}`);
    // }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

// ===== 이벤트 핸들러 함수들 (실제 구현 시 사용) =====

// async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
//   const userId = session.metadata?.userId;
//   const planId = session.metadata?.planId;
//   const billingCycle = session.metadata?.billingCycle;
//
//   if (!userId || !planId || !billingCycle) {
//     console.error('Missing metadata in checkout session');
//     return;
//   }
//
//   // Firestore에 고객 정보 저장
//   await setDoc(doc(db, 'stripeCustomers', userId), {
//     userId,
//     email: session.customer_email,
//     stripeCustomerId: session.customer,
//     subscriptionId: session.subscription,
//     currentPlan: planId,
//     billingCycle,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   });
//
//   // 결제 기록 저장
//   await setDoc(doc(db, 'paymentRecords', session.id), {
//     userId,
//     stripePaymentIntentId: session.payment_intent,
//     amount: session.amount_total! / 100,
//     currency: session.currency,
//     status: 'succeeded',
//     planId,
//     billingCycle,
//     createdAt: new Date(),
//   });
//
//   console.log(`✅ Checkout completed for user ${userId}`);
// }

// async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
//   const userId = subscription.metadata?.userId;
//
//   if (!userId) {
//     console.error('Missing userId in subscription metadata');
//     return;
//   }
//
//   await updateDoc(doc(db, 'stripeCustomers', userId), {
//     subscriptionId: subscription.id,
//     subscriptionStatus: subscription.status,
//     updatedAt: new Date(),
//   });
//
//   console.log(`✅ Subscription created for user ${userId}`);
// }

// async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
//   const userId = subscription.metadata?.userId;
//
//   if (!userId) {
//     console.error('Missing userId in subscription metadata');
//     return;
//   }
//
//   await updateDoc(doc(db, 'stripeCustomers', userId), {
//     subscriptionStatus: subscription.status,
//     updatedAt: new Date(),
//   });
//
//   console.log(`✅ Subscription updated for user ${userId}`);
// }

// async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
//   const userId = subscription.metadata?.userId;
//
//   if (!userId) {
//     console.error('Missing userId in subscription metadata');
//     return;
//   }
//
//   await updateDoc(doc(db, 'stripeCustomers', userId), {
//     subscriptionStatus: 'canceled',
//     currentPlan: 'free',
//     updatedAt: new Date(),
//   });
//
//   console.log(`✅ Subscription canceled for user ${userId}`);
// }

// async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
//   const userId = invoice.subscription_details?.metadata?.userId;
//
//   if (!userId) {
//     console.error('Missing userId in invoice metadata');
//     return;
//   }
//
//   await setDoc(doc(db, 'paymentRecords', invoice.id), {
//     userId,
//     stripePaymentIntentId: invoice.payment_intent,
//     amount: invoice.amount_paid / 100,
//     currency: invoice.currency,
//     status: 'succeeded',
//     createdAt: new Date(),
//   });
//
//   console.log(`✅ Invoice payment succeeded for user ${userId}`);
// }

// async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
//   const userId = invoice.subscription_details?.metadata?.userId;
//
//   if (!userId) {
//     console.error('Missing userId in invoice metadata');
//     return;
//   }
//
//   await updateDoc(doc(db, 'stripeCustomers', userId), {
//     subscriptionStatus: 'past_due',
//     updatedAt: new Date(),
//   });
//
//   // 이메일 알림 발송 등 추가 처리
//
//   console.log(`❌ Invoice payment failed for user ${userId}`);
// }
