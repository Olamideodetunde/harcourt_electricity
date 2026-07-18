import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { userId: string, role: string };

    let userExists = false;
    if (decoded.role === 'customer') {
      const customer = await prisma.customer.findUnique({ where: { id: decoded.userId } });
      if (customer) userExists = true;
    } else {
      const admin = await prisma.admin.findUnique({ where: { id: decoded.userId } });
      if (admin) userExists = true;
    }

    if (!userExists) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'superadmin' && req.user?.role !== 'staff') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
