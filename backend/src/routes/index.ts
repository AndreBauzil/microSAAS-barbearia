import { Router } from "express";
import { serviceRoutes } from "./serviceRoutes";

const routes = Router();

routes.use('/services', serviceRoutes)

export { routes };