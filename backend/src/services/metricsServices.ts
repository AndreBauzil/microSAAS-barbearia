// backend/src/services/metricsServices.ts
// backend/src/services/metricsServices.ts
import { prisma } from "../lib/prisma";
import { startOfDay, subDays, format, startOfWeek, endOfWeek, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export class MetricsServices {
  async getWeeklyRevenue(date: Date) {
    const start = startOfWeek(date);
    const end = endOfWeek(date);

    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: start,
          lt: end,
        },
      },
      include: {
        service: {
          select: { price: true },
        },
      },
    });

    const totalRevenue = appointments.reduce((sum, app) => sum + app.service.price, 0);

    return {
      totalRevenue,
      appointmentsCount: appointments.length,
      startDate: start,
      endDate: end
    };
  }

  async getRevenueChartData(referenceDate: Date) {
    // Pega a data base e gera os 7 dias anteriores
    const days = Array.from({ length: 7 }).map((_, i) => subDays(referenceDate, i)).reverse();
    const chartData = [];

    for (const day of days) {
      const start = startOfDay(day);
      const end = endOfDay(day); 

      const appointments = await prisma.appointment.findMany({
        where: {
          date: { gte: start, lte: end },
          status: { not: 'CANCELED' } 
        },
        include: { service: { select: { price: true } } },
      });

      // Dinheiro Real
      const dailyRevenueCompleted = appointments
        .filter(app => app.status === 'COMPLETED')
        .reduce((sum, app) => sum + app.service.price, 0);

      // Dinheiro Previsto
      const dailyRevenueProjected = appointments
        .filter(app => app.status === 'SCHEDULED')
        .reduce((sum, app) => sum + app.service.price, 0);

      chartData.push({
        day: format(day, 'EEE', { locale: ptBR }),
        date: format(day, 'dd/MM'),
        revenue: dailyRevenueCompleted, 
        projectedRevenue: dailyRevenueProjected, 
      });
    }

    return chartData;
  }
}