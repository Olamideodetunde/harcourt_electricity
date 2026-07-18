import crypto from 'crypto';
import { prisma } from '../../lib/prisma';

export const generateUniqueToken = (): string => {
  // Generate 20 random digits
  let token = '';
  for (let i = 0; i < 20; i++) {
    token += crypto.randomInt(0, 10).toString();
  }
  // Format as XXXX-XXXX-XXXX-XXXX-XXXX
  return token.match(/.{1,4}/g)!.join('-');
};

export const applyTokenToMeter = async (meterId: string, tokenValue: string) => {
  return prisma.$transaction(async (tx) => {
    const token = await tx.token.findFirst({
      where: {
        token_value: tokenValue,
        transaction: {
          meter_id: meterId,
        },
      },
    });

    if (!token) {
      throw new Error('Invalid token for this meter');
    }

    if (token.is_used) {
      throw new Error('Token has already been used');
    }

    // Apply token
    await tx.token.update({
      where: { id: token.id },
      data: { is_used: true, used_at: new Date() },
    });

    const meter = await tx.meter.update({
      where: { id: meterId },
      data: {
        units_balance: {
          increment: token.units,
        },
      },
    });

    return { token, meter };
  });
};
