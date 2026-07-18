import { Router } from 'express';
import { getMe } from './customer.controller';
import { requireAuth } from '../../middleware/auth';

const router = Router();

router.get('/', requireAuth, getMe);

export default router;
