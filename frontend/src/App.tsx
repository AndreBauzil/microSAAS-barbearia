import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import axios from 'axios';

import { api } from './lib/api'

import { Button } from './components/ui/button'; 
import { Toaster } from "@/components/ui/toaster"
import { ServiceCard } from './components/ServiceCard';
import { AppointmentDialog } from './components/AppointmentDialog';

interface IService {
  id: string;
  name: string;
  price: number;
  duration: number;
}

function App() {
  const [services, setServices] = useState<IService[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<IService | null>(null);

  useEffect(() => {
    api.get('/services') 
      .then(response => {
        setServices(response.data);
      })
      .catch(error => {
        console.error("Houve um erro ao buscar os serviços:", error);
      });
  }, []);

  const handleScheduleClick = (service: IService) => {
    setSelectedService(service);
    setIsDialogOpen(true);
  };

  const handleSuccess = () => {}

  return (
    <div className="bg-background min-h-screen">
      <header className="p-4 border-b bg-card">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Barbearia do Dev</h1>
          <Button asChild variant="outline">
            <Link to="/dashboard">Acessar Dashboard</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <section className="text-center py-12">
          <h2 className="text-4xl font-bold tracking-tight">Agende seu Corte</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Escolha um dos nossos serviços abaixo e selecione o melhor horário para você. Simples, rápido e fácil.
          </p>
        </section>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                onScheduleClick={() => handleScheduleClick(service)} 
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t mt-12 py-6">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Barbearia do Dev. Todos os direitos reservados.</p>
        </div>
      </footer>

      <AppointmentDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        service={selectedService}
        onSuccess={handleSuccess} 
      />

      <Toaster />
    </div>
  )
}

export default App;