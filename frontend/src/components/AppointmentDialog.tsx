// frontend/src/components/AppointmentDialog.tsx
import { useState, useEffect, useMemo } from "react";

import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

import { Label } from "./ui/label";
import { Button } from "./ui/button";

import axios from "axios";
import { format, startOfDay } from "date-fns";

interface InitialData {
  id: string;
  customerName: string;
  date: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELED';
}

interface AppointmentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  service: { id: string; name: string; } | null;
  initialData?: InitialData | null; 
  onSuccess: () => void; 
}

const businessHours = [ "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00" ];

export function AppointmentDialog({ isOpen, onOpenChange, service, initialData, onSuccess }: AppointmentDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [dailyAppointments, setDailyAppointments] = useState<{ date: string }[]>([]);
  const [status, setStatus] = useState<'SCHEDULED' | 'COMPLETED' | 'CANCELED'>('SCHEDULED');

  const { toast } = useToast()

  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData) {
      setCustomerName(initialData.customerName);
      const initialDate = new Date(initialData.date);
      setSelectedDate(initialDate);
      setSelectedTime(format(initialDate, 'HH:mm'));
      setStatus(initialData.status); 
    } else {
      setCustomerName("");
      setSelectedDate(new Date());
      setSelectedTime(null);
    }
  }, [initialData, isOpen]); // Roda quando os dados iniciais ou a visibilidade mudam

  useEffect(() => {
    if (!selectedDate) {
      return;
    }

    const dateString = format(selectedDate, 'yyyy-MM-dd');
    
    axios.get(`http://localhost:3333/appointments?date=${dateString}`)
      .then(response => {
        setDailyAppointments(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar agendamentos do dia:", error);
      });

  }, [selectedDate]);

  const availableTimeSlots = useMemo(() => {
    const bookedTimes = dailyAppointments.map(appointment => 
      format(new Date(appointment.date), 'HH:mm')
    );
    
    return businessHours.filter(time => !bookedTimes.includes(time));
  }, [dailyAppointments]);

  const handleSubmit = async () => {
      if (!selectedDate || !selectedTime || !customerName) {
        // Substitua o alert()
        toast({
        title: "Erro de Validação",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
        })
      return;
    }

    const [hours, minutes] = selectedTime.split(':').map(Number);
    const appointmentDate = new Date(selectedDate);
    appointmentDate.setHours(hours, minutes);

    const appointmentData = {
      customerName,
      date: appointmentDate.toISOString(),
      serviceId: service?.id,
      status,
    };

    try {
      if (isEditMode) {
        // MODO EDIÇÃO: PUT
        await axios.put(`http://localhost:3333/appointments/${initialData.id}`, appointmentData);
        toast({
          title: "Sucesso!",
          description: "O agendamento foi atualizado com sucesso.",
        })
      } else {
        // MODO CRIAÇÃO: POST
        await axios.post('http://localhost:3333/appointments', appointmentData);
        toast({
          title: "Sucesso!",
          description: `Agendamento para "${service?.name}" realizado com sucesso.`,
        })
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro no Servidor",
        description: "Houve um erro ao salvar o agendamento. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Editar Agendamento' : 'Agendar Horário'}</DialogTitle>
          <DialogDescription>
            Serviço: <span className="font-bold">{service?.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="customerName">Seu Nome</Label>
            <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          </div>

          {isEditMode && (
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SCHEDULED">Agendado</SelectItem>
                  <SelectItem value="COMPLETED">Concluído</SelectItem>
                  <SelectItem value="CANCELED">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div>
              <Label>Data</Label>
              <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" disabled={(date) => date < startOfDay(new Date())}/>
          </div>
          <div>
              <Label>Horário</Label>
              <div className="grid grid-cols-4 gap-2">
                  {businessHours.map(time => (
                      <Button key={time} variant={selectedTime === time ? "default" : "outline"} onClick={() => setSelectedTime(time)}>
                        {time}
                      </Button>
                  ))}
              </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!selectedTime || !customerName}>
            {isEditMode ? 'Salvar Alterações' : 'Confirmar Agendamento'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}