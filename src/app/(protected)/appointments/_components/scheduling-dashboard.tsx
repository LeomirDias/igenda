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
import { Clock, User, MapPin } from "lucide-react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(weekday);
dayjs.extend(isBetween);

import { professionalsTable, appointmentsTable } from "@/db/schema";

type AppointmentWithRelations = typeof appointmentsTable.$inferSelect & {
  client: {
    id: string;
    name: string;
    email: string;
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
}: {
  professionals: (typeof professionalsTable.$inferSelect)[];
  appointments: AppointmentWithRelations[];
  services: { id: string; name: string }[];
}) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

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
    const matchesDoctor =
      !selectedDoctor || appointment.professional.id === selectedDoctor;
    const matchesService =
      !selectedService || appointment.service.id === selectedService;
    const matchesSearch =
      !searchTerm ||
      appointment.client.name.toLowerCase().includes(searchTerm.toLowerCase());
    return inDay && matchesDoctor && matchesService && matchesSearch;
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
    const cardWidth = 240;
    const gap = 8; // Aumentado o gap para melhor separação
    const totalWidth = totalInGroup * cardWidth + (totalInGroup - 1) * gap;
    const startX = 20; // Margem fixa à esquerda em vez de centralizar
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

  return (
    <div className="flex h-screen bg-white">
      {/* Barra Lateral */}
      <div className="w-80 overflow-y-auto border-r border-gray-200 p-6">
        {/* Calendário */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">Calendário</h2>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>
        {/* Filtros */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Filtros</h3>
          <div className="space-y-2">
            <Label htmlFor="search">Buscar</Label>
            <Input
              id="search"
              placeholder="Nome do paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctor">Profissional</Label>
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o profissional" />
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
              <SelectTrigger>
                <SelectValue placeholder="Selecione o serviço" />
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
        </div>
      </div>

      {/* Área Principal - Timeline do Dia */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Agendamentos -{" "}
            {date
              ?.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })
              .replace(/^\w/, (c) => c.toUpperCase())}
          </h1>
        </div>
        {/* Timeline do dia */}
        <div className="flex-1 overflow-y-auto">
          <div className="relative">
            <div className="flex">
              {/* Coluna de horários */}
              <div className="flex w-20 flex-col">
                {timeSlots.map((time) => (
                  <div
                    key={time}
                    className="flex items-center justify-center border-b border-gray-100 text-xs font-medium text-gray-600"
                    style={{ height: `${SLOT_HEIGHT}px` }}
                  >
                    {time}
                  </div>
                ))}
              </div>
              {/* Coluna dos agendamentos */}
              <div className="relative flex-1">
                {/* Linhas de grade */}
                {timeSlots.map((_, idx) => (
                  <div
                    key={idx}
                    className="absolute right-0 left-0 border-b border-gray-100"
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
                      className={`absolute flex cursor-pointer items-center justify-center border-l-4 transition-shadow hover:shadow-md ${
                        isPast
                          ? "border-green-300 bg-green-50"
                          : "border-blue-300 bg-blue-50"
                      }`}
                      style={{
                        top: `${top}px`,
                        left: `${left}px`,
                        height: `${SLOT_HEIGHT - 4}px`,
                        width: `240px`,
                      }}
                    >
                      <div className="flex flex-col justify-center px-1.5 text-center">
                        <h4 className="truncate text-xs font-semibold">
                          {appointment.service.name}
                        </h4>
                        <div className="flex items-center justify-center">
                          <div className="flex items-center justify-center text-xs text-gray-600">
                            <span className="truncate text-xs">
                              R${" "}
                              {(
                                appointment.service.servicePriceInCents / 100
                              ).toFixed(2)}{" "}
                              - {appointment.time.substring(0, 5)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-center text-xs text-gray-600">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
