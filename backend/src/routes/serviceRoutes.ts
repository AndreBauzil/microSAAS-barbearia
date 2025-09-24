import { Router } from "express";
import { ServiceController } from "../controllers/serviceController";

const serviceRoutes = Router();
const serviceController = new ServiceController();

serviceRoutes.get('/', serviceController.findAll);

serviceRoutes.post('/', serviceController.create);

export { serviceRoutes };