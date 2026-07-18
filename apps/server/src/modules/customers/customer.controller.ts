import { Response } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthenticatedRequest } from '../../middleware/auth';

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.user!.id },
      select: { id: true, full_name: true, email: true, phone: true, created_at: true }
    });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
