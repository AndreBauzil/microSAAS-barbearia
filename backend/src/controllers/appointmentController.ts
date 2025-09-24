// backend/src/controllers/appointmentController.ts
import { Request, Response } from 'express';
import { AppointmentServices } from '../services/appointmentServices';

const appointmentServices = new AppointmentServices();

export class AppointmentController {
  async create(req: Request, res: Response) {
    try {
      const { customerName, date, serviceId } = req.body;

      // Validação simples dos dados de entrada
      if (!customerName || !date || !serviceId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const appointment = await appointmentServices.create({ 
        customerName, 
        date: new Date(date), 
        serviceId 
      });

      return res.status(201).json(appointment);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }

  async findByDay(req: Request, res: Response) {
    try {
      const { date } = req.query; // Data da query string

      if (!date || typeof date !== 'string') {
        return res.status(400).json({ error: 'Date query parameter is required' });
      }

      const appointments = await appointmentServices.findByDay(date);
      return res.json(appointments);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }
  
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { customerName, date } = req.body;
      const appointment = await appointmentServices.update(id, {
        customerName,
        date: date ? new Date(date) : undefined,
      });
      return res.json(appointment);
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await appointmentServices.delete(id);
      return res.status(204).send(); // 204 = No Content
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }
}