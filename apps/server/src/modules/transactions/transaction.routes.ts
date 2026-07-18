import { Router } from 'express';
import { createTransaction, verifyPaymentFallback, getMyTransactions } from './transaction.controller';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validation';
import { TransactionSchema } from '@phedc/shared';

const router = Router();

router.post('/', requireAuth, validate(TransactionSchema), createTransaction);
router.get('/', requireAuth, getMyTransactions);
router.get('/:reference/verify', requireAuth, verifyPaymentFallback);

export default router;
