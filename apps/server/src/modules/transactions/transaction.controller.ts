import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthenticatedRequest } from '../../middleware/auth';
import { TransactionInput } from '@phedc/shared';
import { initializePayment, verifyPayment, verifySignature } from '../payments/paystack.service';
import { generateUniqueToken } from '../tokens/token.service';
import { sendReceiptEmail } from '../notifications/mailer.service';

export const createTransaction = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { meterId, amount } = req.body as TransactionInput;

    const meter = await prisma.meter.findUnique({
      where: { id: meterId },
      include: { customer: true }
    });

    if (!meter) return res.status(404).json({ message: 'Meter not found' });
    if (meter.customer_id !== req.user!.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const payment_ref = `PHEDC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    let paystackData;
    // Simple bypass if Paystack keys are mock/example
    if (process.env.PAYSTACK_SECRET_KEY === 'sk_test_example_change_me') {
      paystackData = { data: { authorization_url: `${process.env.CLIENT_URL}/customer/payment-callback?reference=${payment_ref}` } };
    } else {
      paystackData = await initializePayment(meter.customer.email, amount, payment_ref);
    }

    const transaction = await prisma.transaction.create({
      data: {
        meter_id: meter.id,
        amount,
        payment_ref,
        payment_status: 'pending'
      }
    });

    res.status(201).json({
      transactionId: transaction.id,
      authorizationUrl: paystackData.data.authorization_url,
      reference: payment_ref
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const paystackWebhook = async (req: Request, res: Response) => {
  try {
    // Only verify signature if we actually have a real key configured
    if (process.env.PAYSTACK_WEBHOOK_SECRET !== 'your_paystack_webhook_secret_change_me') {
      const signature = req.headers['x-paystack-signature'] as string;
      if (!verifySignature(req.body, signature)) {
        return res.status(400).send('Invalid signature');
      }
    }

    const event = req.body;

    if (event.event === 'charge.success') {
      const reference = event.data.reference;
      await processSuccessfulPayment(reference);
    }

    res.status(200).send('Webhook received');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

export const verifyPaymentFallback = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { reference } = req.params;
    
    // In a real app we'd call Paystack verify API here, but for this project 
    // we can simulate success if the token doesn't exist yet and webhook missed it.
    // Specially useful for sandbox mode.
    if (process.env.PAYSTACK_SECRET_KEY === 'sk_test_example_change_me') {
      await processSuccessfulPayment(reference);
    } else {
      const paystackRes = await verifyPayment(reference);
      if (paystackRes.data.status === 'success') {
        await processSuccessfulPayment(reference);
      }
    }
    
    const transaction = await prisma.transaction.findUnique({
      where: { payment_ref: reference },
      include: { token: true }
    });

    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    if (transaction.payment_status !== 'successful') {
      return res.status(400).json({ message: 'Payment is not successful' });
    }
    
    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const processSuccessfulPayment = async (reference: string) => {
  return prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.findUnique({
      where: { payment_ref: reference },
      include: {
        meter: {
          include: { tariff: true, customer: true }
        }
      }
    });

    if (!transaction || transaction.payment_status === 'successful') {
      return; // Idempotency check: already processed
    }

    await tx.transaction.update({
      where: { id: transaction.id },
      data: { payment_status: 'successful' }
    });

    const units = Number(transaction.amount) / Number(transaction.meter.tariff.rate_per_kwh);
    const tokenValue = generateUniqueToken();

    const token = await tx.token.create({
      data: {
        transaction_id: transaction.id,
        token_value: tokenValue,
        units
      }
    });

    await tx.meter.update({
      where: { id: transaction.meter.id },
      data: { units_balance: { increment: units } }
    });

    // Send email asynchronously (don't await inside db transaction if possible, but fine for simple app)
    sendReceiptEmail(
      transaction.meter.customer.email,
      transaction.meter.customer.full_name,
      transaction.meter.meter_number,
      Number(transaction.amount),
      units,
      tokenValue
    ).catch(console.error);

    return token;
  });
};

export const getMyTransactions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        meter: {
          customer_id: req.user!.id
        }
      },
      include: { token: true, meter: true },
      orderBy: { created_at: 'desc' }
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
