import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthenticatedRequest } from '../../middleware/auth';
import { TariffInput } from '@phedc/shared';

export const getTariffs = async (req: Request, res: Response) => {
  try {
    const tariffs = await prisma.tariff.findMany();
    res.json(tariffs);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateTariff = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { band } = req.params;
    const { ratePerKwh } = req.body as TariffInput;

    const tariff = await prisma.tariff.update({
      where: { band },
      data: { rate_per_kwh: ratePerKwh }
    });

    res.json(tariff);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
