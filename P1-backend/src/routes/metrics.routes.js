import { Router } from 'express';
import { getDashboardMetricsController } from '../controllers/metrics.controller.js';

const router = Router();

router.get('/', getDashboardMetricsController);


export default router;