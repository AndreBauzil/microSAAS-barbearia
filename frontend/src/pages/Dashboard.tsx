// frontend/src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';

import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale'; 


interface IAppointment {
  id: string;
  customerName: string;
  date: string;
  service: { 
    name: string;
  };
}

export function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedDate) return;

    setIsLoading(true);
    const dateString = format(selectedDate, 'yyyy-MM-dd');

    axios.get(`http://localhost:3333/appointments?date=${dateString}`)
      .then(response => {
        setAppointments(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar agendamentos:", error);
        setAppointments([]); 
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold">Dashboard do Barbeiro</h1>
      </header>

      <main className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1">
          <h2 className="font-bold mb-4 text-lg">Calendário</h2>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            locale={ptBR} 
          />
        </div>

        <div className="col-span-1 lg:col-span-2">
          <h2 className="font-bold mb-4 text-lg">
            Agendamentos para {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : '...'}
          </h2>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Horário</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">Carregando...</TableCell>
                  </TableRow>
                ) : appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">{appointment.customerName}</TableCell>
                      <TableCell>{appointment.service?.name || 'Serviço não encontrado'}</TableCell>
                      <TableCell>{format(new Date(appointment.date), 'HH:mm')}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">Nenhum agendamento para o dia selecionado.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}