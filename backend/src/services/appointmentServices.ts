// backend/src/services/appointmentServices.ts
import { prisma } from "../lib/prisma";
import { startOfDay, endOfDay } from 'date-fns'; 

interface ICreateAppointmentData {
  customerName: string;
  date: Date;
  serviceId: string;
}
interface IUpdateAppointmentData {
    customerName?: string;
    date?: Date;
}

export class AppointmentServices {
    async create(data: ICreateAppointmentData) {
        const appointment = await prisma.appointment.create({
            data: {
                customerName: data.customerName,
                date: data.date,
                serviceId: data.serviceId,
            }
        });
        return appointment;
    }

    async findByDay(dateString: string) {
        const startDate = new Date(`${dateString}T00:00:00.000Z`);
        const endDate = new Date(`${dateString}T23:59:59.999Z`);
    
        const appointments = await prisma.appointment.findMany({
          where: {
            date: {
              gte: startDate,
              lt: endDate,
            },
          },
          // Seção para incluir os dados do serviço relacionado
          include: {
            service: {
              select: {
                name: true, 
              },
            },
          },
          orderBy: {
            date: 'asc' 
          }
        });
    
        return appointments;
    }

    async update(id: string, data: IUpdateAppointmentData) {
        const appointment = await prisma.appointment.update({
          where: { id },
          data,
        });
        return appointment;
    }
    
    async delete(id: string) {
        await prisma.appointment.delete({
          where: { id },
        });
        return; 
    }

    async findUpcoming() {
        const today = startOfDay(new Date()); 

        const appointments = await prisma.appointment.findMany({
            where: {
                date: {
                    gte: today, 
                },
            },
            include: { 
                service: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                date: 'asc', // Ordena pelo mais próximo
            },
        });
        return appointments;
    }
}