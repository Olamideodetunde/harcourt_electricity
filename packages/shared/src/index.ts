import { z } from 'zod';

export const RegisterSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const MeterSchema = z.object({
  meterNumber: z.string().min(4, "Meter number is required"),
  tariffBand: z.string().min(1, "Tariff band is required"),
});

export const TransactionSchema = z.object({
  meterId: z.string().uuid("Invalid meter ID"),
  amount: z.number().positive("Amount must be greater than 0"),
});

export const TariffSchema = z.object({
  ratePerKwh: z.number().positive("Rate must be greater than 0"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type MeterInput = z.infer<typeof MeterSchema>;
export type TransactionInput = z.infer<typeof TransactionSchema>;
export type TariffInput = z.infer<typeof TariffSchema>;
