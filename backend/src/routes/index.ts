// backend/src/routes/index.ts
import { Router } from 'express';

import { serviceRoutes } from './serviceRoutes';
import { appointmentRoutes } from './appointmentRoutes'; 

const routes = Router();

routes.use('/services', serviceRoutes);
routes.use('/appointments', appointmentRoutes); 

export { routes };