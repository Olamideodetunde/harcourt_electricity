import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';
import { RegisterInput, LoginInput } from '@phedc/shared';

const generateTokens = (userId: string, role: string) => {
  const accessToken = jwt.sign({ userId, role }, process.env.JWT_ACCESS_SECRET!, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId, role }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, password } = req.body as RegisterInput;
    
    const existing = await prisma.customer.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const customer = await prisma.customer.create({
      data: { full_name: fullName, email, phone, password_hash }
    });

    const { accessToken, refreshToken } = generateTokens(customer.id, 'customer');
    res.status(201).json({ user: { id: customer.id, email: customer.email, fullName: customer.full_name, role: 'customer' }, accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginInput;

    const customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, customer.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(customer.id, 'customer');
    res.json({ user: { id: customer.id, email: customer.email, fullName: customer.full_name, role: 'customer' }, accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginInput;

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(admin.id, admin.role);
    res.json({ user: { id: admin.id, email: admin.email, fullName: admin.full_name, role: admin.role }, accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Refresh token required' });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { userId: string, role: string };
    const tokens = generateTokens(decoded.userId, decoded.role);
    res.json(tokens);
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};
