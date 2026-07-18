import { Response } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthenticatedRequest } from '../../middleware/auth';
import { MeterInput } from '@phedc/shared';

export const getMyMeters = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const meters = await prisma.meter.findMany({
      where: { customer_id: req.user!.id },
      include: { tariff: true }
    });
    res.json(meters);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const registerMeter = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { meterNumber, tariffBand } = req.body as MeterInput;
    
    // Check if meter exists
    const existing = await prisma.meter.findUnique({ where: { meter_number: meterNumber } });
    if (existing) {
      return res.status(400).json({ message: 'Meter number already registered' });
    }

    // Verify tariff band
    const tariff = await prisma.tariff.findUnique({ where: { band: tariffBand } });
    if (!tariff) {
      return res.status(400).json({ message: 'Invalid tariff band' });
    }

    const meter = await prisma.meter.create({
      data: {
        customer_id: req.user!.id,
        meter_number: meterNumber,
        tariff_band: tariffBand,
        units_balance: 0.00
      }
    });

    res.status(201).json(meter);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
