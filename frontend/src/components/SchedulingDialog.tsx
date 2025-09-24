// frontend/src/components/SchedulingDialog.tsx
import { useState, useEffect, useMemo } from "react"; 

import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

import axios from "axios";
import { format, startOfDay } from "date-fns"; 

interface SchedulingDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  service: {
    id: string;
    name: string;
    price: number;
    duration: number;
  } | null;
}

// Lista de todos os horários de funcionamento
const businessHours = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

export function SchedulingDialog({ isOpen, onOpenChange, service }: SchedulingDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [dailyAppointments, setDailyAppointments] = useState<{ date: string }[]>([]);

  // Buscar agendamentos sempre que a data selecionada mudar
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


  const handleScheduleSubmit = async () => {
    if (!service || !selectedDate || !selectedTime || !customerName) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const appointmentDate = new Date(selectedDate);
    appointmentDate.setHours(hours, minutes);

    try {
      await axios.post('http://localhost:3333/appointments', {
        customerName,
        date: appointmentDate.toISOString(),
        serviceId: service.id,
      });
      alert(`Agendamento para "${service.name}" realizado com sucesso!`);
      onOpenChange(false);
      setSelectedTime(null);
      setCustomerName("");
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      alert("Houve um erro ao realizar o agendamento. Tente novamente.");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl grid-cols-2">
        <div>
          <DialogHeader>
            <DialogTitle>Agendar Horário</DialogTitle>
            <DialogDescription>
              Serviço: <span className="font-bold">{service?.name}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="customerName">Seu Nome</Label>
            <Input 
              id="customerName" 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Digite seu nome completo" 
            />
          </div>

          <div className="py-4">
            <h3 className="font-bold mb-2">Selecione o Horário</h3>
            <div className="grid grid-cols-4 gap-2">
              {availableTimeSlots.map(time => (
                <Button 
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
              {availableTimeSlots.length === 0 && (
                <p className="col-span-4 text-sm text-muted-foreground">Não há horários disponíveis para este dia.</p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={handleScheduleSubmit} disabled={!selectedTime || !customerName}>
              Confirmar Agendamento
            </Button>
          </DialogFooter>
        </div>
        
        <div className="flex justify-center items-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            // Desabilita a seleção de datas passadas
            disabled={(date) => date < startOfDay(new Date())}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}