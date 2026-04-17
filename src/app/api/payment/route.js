import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function POST(req) {
  try {
    const { action, amount, orderId, paymentId, signature } = await req.json();

    // ACTION 1: Create Order
    if (action === 'create_order') {
      const options = {
        amount: amount * 100, // Razorpay works in paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      return NextResponse.json(order);
    }

    // ACTION 2: Verify Payment
    if (action === 'verify_payment') {
      const body = orderId + "|" + paymentId;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature === signature) {
        return NextResponse.json({ success: true, message: "Payment verified" });
      } else {
        return NextResponse.json({ success: false, message: "Signature verification failed" }, { status: 400 });
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("Razorpay Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
