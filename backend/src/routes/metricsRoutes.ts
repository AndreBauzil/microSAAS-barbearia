// backend/src/routes/metricsRoutes.ts
import { Router } from 'express';
import { MetricsController } from '../controllers/metricsController';

const metricsRoutes = Router();
const metricsController = new MetricsController();

metricsRoutes.get('/weekly-revenue', metricsController.getWeeklyRevenue);
metricsRoutes.get('/revenue-chart', metricsController.getRevenueChartData); 

export { metricsRoutes };