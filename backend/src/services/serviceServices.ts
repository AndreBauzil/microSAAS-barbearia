import { prisma } from "../lib/prisma";

interface ICreateServiceData {
    name: string;
    price: number;
    duration: number;
}

export class ServiceServices {
    async findAll() {
        const services = await prisma.service.findMany();
        return services;
    }

    async create(data: ICreateServiceData) {
        const newService = await prisma.service.create({
            data: {
                name: data.name,
                price: data.price,
                duration: data.duration,
            }
        });
        return newService;
    }
}