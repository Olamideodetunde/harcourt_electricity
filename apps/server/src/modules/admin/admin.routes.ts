import { Router } from 'express';
import { getCustomers, getMeters, getRevenueReport, getConsumptionReport } from './admin.controller';
import { requireAuth, requireAdmin } from '../../middleware/auth';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/customers', getCustomers);
router.get('/meters', getMeters);
router.get('/reports/revenue', getRevenueReport);
router.get('/reports/consumption', getConsumptionReport);

export default router;
