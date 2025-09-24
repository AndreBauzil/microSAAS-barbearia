import { Request, Response } from "express";
import { ServiceServices } from "../services/serviceServices";

const serviceServices = new ServiceServices();

export class ServiceController {
    async findAll(req: Request, res: Response) {
        try {
            const services = await serviceServices.findAll();
            return res.json(services);
        } catch (error) {
            return res.status(500).json({ error: 'Something went wrong' });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const { name, price, duration } = req.body;
            const newService = await serviceServices.create({ name, price, duration });
            return res.status(201).json(newService);
        } catch (error) {
            return res.status(500).json({ error: 'Something went wrong' })
        }
    }
}