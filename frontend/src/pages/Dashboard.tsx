// frontend/src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';

import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"; 
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

import { AppointmentDialog } from "@/components/AppointmentDialog"; 
import { WeeklyRevenueChart } from "@/components/WeeklyRevenueChart";

import { MoreHorizontal } from "lucide-react"; 
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale'; 

interface IAppointment {
  id: string;
  customerName: string;
  date: string;
  serviceId: string; 
  service: {
    name: string;
  };
}

export function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<IAppointment | null>(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState<IAppointment | null>(null);

  const [upcomingAppointments, setUpcomingAppointments] = useState<IAppointment[]>([]);

  const fetchAppointments = () => {
    if (!selectedDate) return;
    setIsLoading(true);
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    axios.get(`http://localhost:3333/appointments?date=${dateString}`)
      .then(response => setAppointments(response.data))
      .catch(error => {
        console.error("Erro ao buscar agendamentos:", error);
        setAppointments([]);
      })
      .finally(() => setIsLoading(false));
  };
  const handleCancelClick = (appointment: IAppointment) => {
    setAppointmentToDelete(appointment);
    setIsAlertDialogOpen(true);
  };
  const handleDeleteAppointment = async () => {
    if (!appointmentToDelete) return;

    try {
        await axios.delete(`http://localhost:3333/appointments/${appointmentToDelete.id}`);

        // Atualiza a lista de agendamentos para refletir a exclusão
        setAppointments(prev => prev.filter(app => app.id !== appointmentToDelete.id));

    } catch (error) {
        console.error("Erro ao cancelar agendamento:", error);
        alert("Não foi possível cancelar o agendamento.");
    } finally {
        setIsAlertDialogOpen(false);
        setAppointmentToDelete(null);
    }
  };
  const handleEditClick = (appointment: IAppointment) => {
    setAppointmentToEdit(appointment);
    setIsEditDialogOpen(true);
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);
  useEffect(() => {
    axios.get(`http://localhost:3333/appointments/upcoming`)
      .then(response => {
        setUpcomingAppointments(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar próximos agendamentos:", error);
      });
  }, []);


  return (
    <div className="min-h-screen bg-background">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold">Dashboard do Barbeiro</h1>
      </header>

      <main className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 flex flex-col gap-8">
          <div>
            <h2 className="font-bold mb-4 text-lg">Calendário</h2>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              locale={ptBR}
            />
          </div>

          <div>
            <h2 className="font-bold mb-4 text-lg">Próximos Agendamentos</h2>
            <div className="border rounded-lg p-4 space-y-4 max-h-96 overflow-y-auto">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map(app => (
                  <div key={app.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-bold">{app.customerName}</p>
                      <p className="text-sm text-muted-foreground">{app.service.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{format(new Date(app.date), 'HH:mm')}</p>
                      <p className="text-sm text-muted-foreground">{format(new Date(app.date), 'dd/MM/yy')}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum agendamento futuro.</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-2 flex flex-col gap-8">
            <WeeklyRevenueChart />

          <div>
            <h2 className="font-bold mb-4 text-lg">
              Agendamentos para {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : '...'}
            </h2>

            <div className="border rounded-lg p-2">
              <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead className="text-right">Ações</TableHead> 
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
                            <TableCell className="text-right"> {/* Célula das Ações */}
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Abrir menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditClick(appointment)}>
                                      Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleCancelClick(appointment)} 
                                        className="text-red-600 focus:bg-red-100 focus:text-red-700"
                                    >
                                        Cancelar
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
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
        </div>
      </main>

      <AppointmentDialog 
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        service={{ // Obj de serviço
          id: appointmentToEdit?.serviceId || '',
          name: appointmentToEdit?.service.name || '',
        }}
        initialData={appointmentToEdit} 
        onSuccess={fetchAppointments} 
      />

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                      Esta ação não pode ser desfeita. O agendamento de <span className="font-bold">{appointmentToDelete?.customerName}</span> será permanentemente cancelado.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Voltar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAppointment} className="bg-destructive hover:bg-destructive/90">
                      Sim, cancelar
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>

    </div> 
  );
}