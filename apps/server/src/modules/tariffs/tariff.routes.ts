import { Router } from 'express';
import { getTariffs, updateTariff } from './tariff.controller';
import { requireAuth, requireAdmin } from '../../middleware/auth';
import { validate } from '../../middleware/validation';
import { TariffSchema } from '@phedc/shared';

const router = Router();

// Public/Customer readable
router.get('/', getTariffs);

// Admin only
router.put('/:band', requireAuth, requireAdmin, validate(TariffSchema), updateTariff);

export default router;
