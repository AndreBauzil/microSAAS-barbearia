// backend/src/routes/index.ts
import { Router } from 'express';

import { serviceRoutes } from './serviceRoutes';
import { appointmentRoutes } from './appointmentRoutes'; 
import { metricsRoutes } from './metricsRoutes';

const routes = Router();

routes.use('/services', serviceRoutes);
routes.use('/appointments', appointmentRoutes);
routes.use('/metrics', metricsRoutes); 

export { routes };