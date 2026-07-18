import { Router } from 'express';
import { getMyMeters, registerMeter } from './meter.controller';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validation';
import { MeterSchema } from '@phedc/shared';

const router = Router();

router.get('/', requireAuth, getMyMeters);
router.post('/', requireAuth, validate(MeterSchema), registerMeter);

export default router;
