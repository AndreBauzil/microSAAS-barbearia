// backend/src/routes/appointmentRoutes.ts
import { Router } from 'express';
import { AppointmentController } from '../controllers/appointmentController';

const appointmentRoutes = Router();
const appointmentController = new AppointmentController();

appointmentRoutes.post('/', appointmentController.create);
appointmentRoutes.get('/', appointmentController.findByDay); 
appointmentRoutes.put('/:id', appointmentController.update);
appointmentRoutes.delete('/:id', appointmentController.delete);

export { appointmentRoutes };