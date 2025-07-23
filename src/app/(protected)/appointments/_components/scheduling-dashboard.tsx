"use client";

import { useState, useEffect } from "react";
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  User,
  Filter,
  Expand,
  ShoppingBag,
  Users,
  Phone,
  SquareUser,
  Edit2,
  X,
} from "lucide-react";
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
    durationInMinutes: number;
  };
};

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
  enterpriseId: string;
}) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedProfessional, setSelectedProfessional] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editingAppointmentId, setEditingAppointmentId] = useState<
    string | null
  >(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState<{
    totalAppointments: number;
    totalRevenue: number | null;
  }>({ totalAppointments: 0, totalRevenue: 0 });

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

  // Componente da barra lateral
  const SidebarContent = () => (
    <div className="flex h-full flex-col items-center space-y-6 p-4 text-center">
      {/* Calendário */}
      <div>
        <h2 className="text-foreground text-md mb-4">Calendário</h2>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="border-border rounded-md border"
        />
      </div>

      {/* Filtros */}
      <div className="w-full space-y-4">
        <h3 className="text-foreground text-md mb-4">Filtros</h3>
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
            className="hover:border-destructive hover:bg-destructive/10 hover:text-destructive w-full text-sm"
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
    </div>
  );

  return (
    <div className="bg-background flex h-screen w-full">
      {/* Área Principal - Timeline do Dia */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4">
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

          <div className="flex flex-row gap-2">
            <AddAppointmentButton
              clients={clients}
              professionals={professionals}
              services={services}
            />
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="default" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Timeline do dia - Mobile*/}
        <div className="lg:hidden">
          <div className="flex flex-col gap-4 p-4">
            {/* Container com scroll para os cards */}
            <div
              className="flex flex-col gap-4 overflow-y-auto"
              style={{ maxHeight: "calc(100dvh - 110px)" }}
            >
              {filteredAppointments
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((appointment) => {
                  // Valor formatado
                  const price = (
                    appointment.service.servicePriceInCents / 100
                  ).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  });
                  return (
                    <Card
                      key={appointment.id}
                      className="bg-background border-border relative flex flex-col items-center justify-start shadow-sm"
                    >
                      {/* Esquerda: Horário + Badge */}
                      <div className="flex w-full flex-row items-center justify-between gap-2 px-4">
                        <div className="flex min-w-[70px] flex-row items-center gap-2">
                          <span className="bg-primary border-primary text-md rounded-sm p-2 leading-none font-bold text-white">
                            {appointment.time.substring(0, 5)}
                          </span>
                          <Badge className="bg-primary/25 border-primary text-primary rounded-xl border-1">
                            Agendado
                          </Badge>
                        </div>
                        <span className="text-md text-primary font-bold">
                          {price}
                        </span>
                      </div>

                      <div className="flex w-full flex-col px-4">
                        <div className="mb-3 flex flex-col gap-2">
                          <div className="text-foreground flex items-center gap-2">
                            <SquareUser className="text-muted-foreground h-4 w-4" />
                            <span className="flex items-center gap-1 text-sm font-medium">
                              {appointment.client.name}{" "}
                              <p className="text-muted-foreground text-xs">
                                Cliente
                              </p>
                            </span>
                          </div>
                          <div className="text-foreground flex items-center gap-2">
                            <Phone className="text-muted-foreground h-4 w-4" />
                            <span className="flex items-center gap-1 text-sm font-medium">
                              {appointment.client.phoneNumber}{" "}
                              <p className="text-muted-foreground text-xs">
                                Contato
                              </p>
                            </span>
                          </div>
                        </div>

                        <div className="mb-3 flex flex-col gap-2">
                          <div className="text-foreground flex items-center gap-2">
                            <User className="text-muted-foreground h-4 w-4" />
                            <span className="flex items-center gap-1 text-sm font-medium">
                              {appointment.professional.name}{" "}
                              <p className="text-muted-foreground text-xs">
                                Profissional
                              </p>
                            </span>
                          </div>
                          <div className="text-foreground flex items-center gap-2">
                            <ShoppingBag className="text-muted-foreground h-4 w-4" />
                            <span className="flex items-center gap-1 text-sm font-medium">
                              {appointment.service.name}{" "}
                              <p className="text-muted-foreground text-xs">
                                Serviço
                              </p>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Botão de edição */}
                      <div className="absolute right-2 bottom-2 flex flex-col">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAppointmentId(appointment.id);
                          }}
                          variant="link"
                          className="cursor-pointer"
                        >
                          <Edit2 className="text-primary h-5 w-5" />
                        </Button>
                        <Button variant="link" className="cursor-pointer">
                          <p className="text-red-500">
                            <X className="h-5 w-5" />
                          </p>
                        </Button>
                      </div>
                    </Card>
                  );
                })}
            </div>

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

        {/* Timeline do dia - PC*/}
        <div className="mt-4 hidden lg:flex">
          {/* Container com scroll para os cards */}
          <div
            className="grid w-full grid-cols-3 gap-4 overflow-y-auto px-4"
            style={{ maxHeight: "calc(100dvh - 110px)" }}
          >
            {filteredAppointments
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((appointment) => {
                // Valor formatado
                const price = (
                  appointment.service.servicePriceInCents / 100
                ).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                });
                return (
                  <Card
                    key={appointment.id}
                    className="bg-background border-border hover:bg-muted/50 relative transition-colors"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary rounded-md px-3 py-1 font-semibold text-white">
                            {appointment.time.substring(0, 5)}
                          </div>
                          <Badge className="bg-primary/25 border-primary text-primary rounded-xl border-1">
                            Agendado
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-green-400">
                            {price}
                          </p>
                          <p className="text-muted-foreground flex items-center gap-1 text-sm">
                            <Clock className="h-3 w-3" />
                            {appointment.service.durationInMinutes} min
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="flex flex-row items-center justify-start gap-4">
                        <div className="mb-3 flex flex-col gap-2">
                          <div className="text-foreground flex items-center gap-2">
                            <SquareUser className="text-muted-foreground h-4 w-4" />
                            <span className="flex items-center gap-1 text-sm font-medium">
                              {appointment.client.name}{" "}
                              <p className="text-muted-foreground text-xs">
                                Cliente
                              </p>
                            </span>
                          </div>
                          <div className="text-foreground flex items-center gap-2">
                            <Phone className="text-muted-foreground h-4 w-4" />
                            <span className="flex items-center gap-1 text-sm font-medium">
                              {appointment.client.phoneNumber}{" "}
                              <p className="text-muted-foreground text-xs">
                                Contato
                              </p>
                            </span>
                          </div>
                        </div>

                        <div className="mb-3 flex flex-col gap-2">
                          <div className="text-foreground flex items-center gap-2">
                            <User className="text-muted-foreground h-4 w-4" />
                            <span className="flex items-center gap-1 text-sm font-medium">
                              {appointment.professional.name}{" "}
                              <p className="text-muted-foreground text-xs">
                                Profissional
                              </p>
                            </span>
                          </div>
                          <div className="text-foreground flex items-center gap-2">
                            <ShoppingBag className="text-muted-foreground h-4 w-4" />
                            <span className="flex items-center gap-1 text-sm font-medium">
                              {appointment.service.name}{" "}
                              <p className="text-muted-foreground text-xs">
                                Serviço
                              </p>
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    {/* Botão de edição */}
                    <div className="absolute right-2 bottom-2 flex flex-col">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingAppointmentId(appointment.id);
                        }}
                        variant="link"
                        className="cursor-pointer"
                      >
                        <Edit2 className="text-primary h-5 w-5" />
                      </Button>
                      <Button variant="link" className="cursor-pointer">
                        <p className="text-red-500">
                          <X className="h-5 w-5" />
                        </p>
                      </Button>
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
  );
}
