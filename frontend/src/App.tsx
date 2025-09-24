// frontend/src/App.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';

import { ServiceCard } from './components/ServiceCard'; 

interface IService {
  id: string;
  name: string;
  price: number;
  duration: number;
}

function App() {
  const [services, setServices] = useState<IService[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3333/services')
      .then(response => {
        setServices(response.data);
      })
      .catch(error => {
        console.error("Houve um erro ao buscar os serviços:", error);
      });
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold">Barbearia do Dev</h1>
      </header>

      <main className="p-8">
        <h2 className="text-3xl font-bold mb-6">Nossos Serviços</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </main>
    </div>
  )
}

export default App;