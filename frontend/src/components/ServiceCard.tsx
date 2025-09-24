// frontend/src/components/ServiceCard.tsx
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

// A interface para definir quais "props" nosso componente aceita
interface ServiceCardProps {
  service: {
    name: string;
    price: number;
    duration: number;
  }
}

export function ServiceCard({ service }: ServiceCardProps) {
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
        <Button className="w-full">Agendar</Button>
      </CardFooter>
    </Card>
  )
}