import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes';
import customerRoutes from './modules/customers/customer.routes';
import meterRoutes from './modules/meters/meter.routes';
import tariffRoutes from './modules/tariffs/tariff.routes';
import transactionRoutes from './modules/transactions/transaction.routes';
import adminRoutes from './modules/admin/admin.routes';
import { paystackWebhook } from './modules/transactions/transaction.controller';
import { adminLogin } from './modules/auth/auth.controller';
import { validate } from './middleware/validation';
import { LoginSchema } from '@phedc/shared';

const router = Router();

router.post('/payments/webhook', paystackWebhook); // Webhook needs to be mapped

router.use('/auth', authRoutes);
router.post('/admin/auth/login', validate(LoginSchema), adminLogin);

router.use('/me', customerRoutes);
router.use('/me/meters', meterRoutes);
router.use('/meters', meterRoutes);
router.use('/tariffs', tariffRoutes);
router.use('/transactions', transactionRoutes);
router.use('/admin', adminRoutes);

export default router;
