import crypto from 'crypto';

export const initializePayment = async (email: string, amount: number, reference: string) => {
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amount * 100), // Paystack expects amount in kobo/cents
      reference,
      callback_url: `${process.env.CLIENT_URL}/customer/payment-callback`,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Paystack initialize error:', errorData);
    throw new Error('Failed to initialize payment with Paystack');
  }

  return response.json();
};

export const verifyPayment = async (reference: string) => {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to verify payment with Paystack');
  }

  return response.json();
};

export const verifySignature = (body: any, signature: string) => {
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET!)
    .update(JSON.stringify(body))
    .digest('hex');
  return hash === signature;
};
