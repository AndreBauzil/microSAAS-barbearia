// backend/src/controllers/metricsController.ts
import { Request, Response } from 'express';
import { MetricsServices } from '../services/metricsServices';

const metricsServices = new MetricsServices();

export class MetricsController {
  async getWeeklyRevenue(req: Request, res: Response) {
    try {
      const { date } = req.query;
      const referenceDate = date && typeof date === 'string' ? new Date(date) : new Date();

      const metrics = await metricsServices.getWeeklyRevenue(referenceDate);
      return res.json(metrics);
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }

  async getRevenueChartData(req: Request, res: Response) {
    try {
      const metrics = await metricsServices.getRevenueChartData();
      return res.json(metrics);
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }
}