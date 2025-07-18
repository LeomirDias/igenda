"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, MapPin, Pencil, Menu } from "lucide-react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isBetween from "dayjs/plugin/isBetween";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import UpsertAppointmentForm from "./upsert-appointment-form";
dayjs.extend(weekday);
dayjs.extend(isBetween);

import {
  professionalsTable,
  appointmentsTable,
  servicesTable,
  clientsTable,
} from "@/db/schema";
import AddAppointmentButton from "./add-appointment-button";
import { Button } from "@/components/ui/button";

type AppointmentWithRelations = typeof appointmentsTable.$inferSelect & {
  client: {
    id: string;
    name: string;
    phoneNumber: string;
  };
  professional: {
    id: string;
    name: string;
    specialty: string;
  };
  service: {
    id: string;
    name: string;
    servicePriceInCents: number;
  };
};

// Gerar horários de 5h às 23h em intervalos de 30 minutos
const timeSlots = Array.from({ length: (23 - 5) * 2 + 1 }, (_, i) => {
  const hour = 5 + Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
});

const SLOT_HEIGHT = 60; // Altura fixa para cada slot de 30 minutos

function getWeekDays(date: Date) {
  const startOfWeek = dayjs(date).weekday(0); // domingo
  return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));
}

export function SchedulingDashboard({
  professionals,
  appointments,
  services,
  clients,
}: {
  professionals: (typeof professionalsTable.$inferSelect)[];
  appointments: AppointmentWithRelations[];
  services: (typeof servicesTable.$inferSelect)[];
  clients: (typeof clientsTable.$inferSelect)[];
}) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedProfessional, setSelectedProfessional] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editingAppointmentId, setEditingAppointmentId] = useState<
    string | null
  >(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Função para calcular a posição do card na timeline
  const getAppointmentPosition = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const startMinutes = (hours - 5) * 60 + minutes;
    const top = (startMinutes / 30) * SLOT_HEIGHT;
    return { top };
  };

  // Filtro dos agendamentos para o dia selecionado e filtros laterais
  const filteredAppointments = appointments.filter((appointment) => {
    const appDate = dayjs(appointment.date);
    const inDay = date ? appDate.isSame(dayjs(date), "day") : true;
    const matchesProfessional =
      !selectedProfessional ||
      appointment.professional.id === selectedProfessional;
    const matchesService =
      !selectedService || appointment.service.id === selectedService;
    const matchesSearch =
      !searchTerm ||
      appointment.client.name.toLowerCase().includes(searchTerm.toLowerCase());
    return inDay && matchesProfessional && matchesService && matchesSearch;
  });

  // Agrupar agendamentos por horário
  const appointmentsByTime = filteredAppointments.reduce(
    (acc, appointment) => {
      if (!acc[appointment.time]) {
        acc[appointment.time] = [];
      }
      acc[appointment.time].push(appointment);
      return acc;
    },
    {} as Record<string, AppointmentWithRelations[]>,
  );

  // Função para calcular a posição horizontal de cada card
  const getHorizontalPosition = (appointment: AppointmentWithRelations) => {
    const timeGroup = appointmentsByTime[appointment.time];
    const index = timeGroup.findIndex((a) => a.id === appointment.id);
    const totalInGroup = timeGroup.length;
    const cardWidth = 180; // Largura base para mobile
    const gap = 6;
    const startX = 10;
    return startX + index * (cardWidth + gap);
  };

  // Função para verificar se o agendamento é passado
  const isAppointmentPast = (appointment: AppointmentWithRelations) => {
    const now = dayjs();
    const appointmentDateTime =
      dayjs(appointment.date).format("YYYY-MM-DD") + " " + appointment.time;
    const appointmentTime = dayjs(appointmentDateTime, "YYYY-MM-DD HH:mm:ss");
    return appointmentTime.isBefore(now);
  };

  // Componente da barra lateral
  const SidebarContent = () => (
    <div className="flex h-full flex-col space-y-6 overflow-y-auto p-4">
      {/* Calendário */}
      <div>
        <h2 className="text-foreground mb-4 text-lg font-semibold">
          Calendário
        </h2>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="border-border rounded-md border"
        />
      </div>

      {/* Filtros */}
      <div className="space-y-4">
        <h3 className="text-foreground text-lg font-semibold">Filtros</h3>
        <div className="space-y-2">
          <Label htmlFor="search">Cliente</Label>
          <Input
            id="search"
            placeholder="Nome do cliente..."
            value={searchTerm}
            className="w-full"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="professional">Profissional</Label>
          <Select
            value={selectedProfessional}
            onValueChange={setSelectedProfessional}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Busque por profissional" />
            </SelectTrigger>
            <SelectContent>
              {professionals.map((professional) => (
                <SelectItem key={professional.id} value={professional.id}>
                  {professional.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="service">Serviço</Label>
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Busque por serviço" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Button
            type="button"
            variant="outline"
            className="hover:border-destructive hover:bg-destructive/10 hover:text-destructive text-sm"
            onClick={() => {
              setSearchTerm("");
              setSelectedProfessional("");
              setSelectedService("");
            }}
          >
            Resetar filtros
          </Button>
        </div>
      </div>

      <AddAppointmentButton
        clients={clients}
        professionals={professionals}
        services={services}
      />
    </div>
  );

  return (
    <div className="bg-background flex h-screen w-full">
      {/* Barra Lateral - Desktop */}
      <div className="lg:border-border hidden lg:flex lg:w-72 lg:flex-col lg:border-r">
        <SidebarContent />
      </div>

      {/* Área Principal - Timeline do Dia */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="border-border flex items-center justify-between border-b p-4 lg:p-6">
          <div className="flex items-center gap-4">
            {/* Botão do menu mobile */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            <div>
              <h1 className="text-foreground text-xl font-bold lg:text-2xl">
                Agendamentos
              </h1>
              <p className="text-muted-foreground text-sm lg:text-base">
                {date
                  ?.toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                  .replace(/^\w/, (c) => c.toUpperCase())}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline do dia */}
        <div className="flex-1 overflow-auto">
          <div className="relative">
            <div className="flex">
              {/* Coluna de horários */}
              <div className="flex w-12 flex-col lg:w-16">
                {timeSlots.map((time) => (
                  <div
                    key={time}
                    className="text-muted-foreground flex items-center justify-center text-xs font-medium"
                    style={{ height: `${SLOT_HEIGHT}px` }}
                  >
                    <span className="hidden lg:inline">{time}</span>
                    <span className="lg:hidden">{time.substring(0, 2)}</span>
                  </div>
                ))}
              </div>

              {/* Coluna dos agendamentos */}
              <div className="relative flex-1 overflow-auto">
                {/* Linhas de grade */}
                {timeSlots.map((_, idx) => (
                  <div
                    key={idx}
                    className="border-border absolute right-0 left-0 border-b"
                    style={{ top: idx * SLOT_HEIGHT, height: 0 }}
                  />
                ))}

                {/* Cards de agendamento */}
                {filteredAppointments.map((appointment) => {
                  const { top } = getAppointmentPosition(appointment.time);
                  const left = getHorizontalPosition(appointment);
                  const isPast = isAppointmentPast(appointment);
                  return (
                    <Card
                      key={appointment.id}
                      className={`absolute mt-1 flex cursor-default items-center justify-center border-l-4 transition-shadow hover:shadow-md lg:w-[200px] ${
                        isPast
                          ? "border-green-500/50 bg-green-500/10 dark:bg-green-500/5"
                          : "border-primary/50 bg-primary/10 dark:bg-primary/5"
                      }`}
                      style={{
                        top: `${top}px`,
                        left: `${left}px`,
                        height: `${SLOT_HEIGHT - 8}px`,
                        width: `180px`,
                        maxWidth: `calc(100vw - 80px)`,
                      }}
                    >
                      {/* Botão de edição */}
                      <button
                        className="group hover:bg-background/80 absolute top-1 right-1 z-10 cursor-pointer rounded-full p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingAppointmentId(appointment.id);
                        }}
                        title="Editar agendamento"
                        type="button"
                      >
                        <Pencil className="text-muted-foreground h-3 w-3 transition-transform duration-150 group-hover:scale-110" />
                      </button>

                      <div className="flex w-full flex-col justify-center px-1.5 text-center">
                        <h4 className="text-foreground truncate text-xs font-semibold">
                          {appointment.service.name}
                        </h4>
                        <div className="flex items-center justify-center">
                          <div className="text-muted-foreground flex items-center justify-center text-xs">
                            <span className="truncate text-xs">
                              {appointment.professional.name} -{" "}
                              {appointment.time.substring(0, 5)}
                            </span>
                          </div>
                        </div>
                        <div className="text-muted-foreground flex items-center justify-center text-xs">
                          <span className="truncate text-xs">
                            {appointment.client.name} -{" "}
                            {appointment.client.phoneNumber.replace(
                              /^(\d{2})(\d{1})(\d{4})(\d{4})$/,
                              "($1) $2 $3-$4",
                            )}
                          </span>
                        </div>
                      </div>
                    </Card>
                  );
                })}

                {/* Dialog de edição */}
                <Dialog
                  open={!!editingAppointmentId}
                  onOpenChange={(open) => {
                    if (!open) setEditingAppointmentId(null);
                  }}
                >
                  <DialogContent className="sm:max-w-[500px]">
                    {editingAppointmentId && (
                      <UpsertAppointmentForm
                        isOpen={!!editingAppointmentId}
                        clients={clients}
                        professionals={professionals}
                        services={services}
                        appointment={(() => {
                          const a = appointments.find(
                            (ap) => ap.id === editingAppointmentId,
                          );
                          if (!a) return undefined;
                          return {
                            id: a.id,
                            clientId: a.client.id,
                            professionalId: a.professional.id,
                            serviceId: a.service.id,
                            date:
                              typeof a.date === "string"
                                ? a.date
                                : dayjs(a.date).format("YYYY-MM-DD"),
                            time: a.time,
                          };
                        })()}
                        onSuccess={() => setEditingAppointmentId(null)}
                      />
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
