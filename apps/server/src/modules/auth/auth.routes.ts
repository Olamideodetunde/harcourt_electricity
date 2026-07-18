import { Router } from 'express';
import { register, login, adminLogin, refresh } from './auth.controller';
import { validate } from '../../middleware/validation';
import { RegisterSchema, LoginSchema } from '@phedc/shared';

const router = Router();

router.post('/register', validate(RegisterSchema), register);
router.post('/login', validate(LoginSchema), login);
router.post('/refresh', refresh);

export default router;
