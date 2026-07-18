import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthenticatedRequest } from '../../middleware/auth';

export const getCustomers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const customers = await prisma.customer.findMany({
      include: { meters: true }
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMeters = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const meters = await prisma.meter.findMany({
      include: { customer: true, tariff: true }
    });
    res.json(meters);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRevenueReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { payment_status: 'successful' },
      select: { amount: true, created_at: true }
    });
    
    const totalRevenue = transactions.reduce((acc, curr) => acc + Number(curr.amount), 0);
    
    res.json({ totalRevenue, count: transactions.length, transactions });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getConsumptionReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tokens = await prisma.token.findMany({
      include: { transaction: { include: { meter: true } } }
    });
    
    const totalUnits = tokens.reduce((acc, curr) => acc + Number(curr.units), 0);
    
    res.json({ totalUnits, count: tokens.length, tokens });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
