// backend/src/services/metricsServices.ts
// backend/src/services/metricsServices.ts
import { prisma } from "../lib/prisma";
import { startOfDay, subDays, format, startOfWeek, endOfWeek } from 'date-fns';
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

  async getRevenueChartData() {
    const today = new Date();
    const days = Array.from({ length: 7 }).map((_, i) => subDays(today, i)).reverse();

    const chartData = [];

    for (const day of days) {
      const start = startOfDay(day);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);

      const appointments = await prisma.appointment.findMany({
        where: {
          date: { gte: start, lt: end },
        },
        include: { service: { select: { price: true } } },
      });

      const dailyRevenue = appointments.reduce((sum, app) => sum + app.service.price, 0);

      chartData.push({
        day: format(day, 'EEE', { locale: ptBR }),
        date: format(day, 'dd/MM'),
        revenue: dailyRevenue,
      });
    }

    return chartData;
  }
}