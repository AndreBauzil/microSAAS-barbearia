// frontend/src/components/ServiceCard.tsx
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

interface IService {
  name: string;
  price: number;
  duration: number;
}

interface ServiceCardProps {
  service: IService;
  onScheduleClick: (service: IService) => void; 
}

export function ServiceCard({ service, onScheduleClick }: ServiceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{service.name}</CardTitle>
        <CardDescription>Duração: {service.duration} minutos</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">
          R$ {service.price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => onScheduleClick(service)}>
          Agendar
        </Button>
      </CardFooter>
    </Card>
  )
}