import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SquareUser,
  Phone,
  User,
  ShoppingBag,
  Edit2,
  X,
  Clock,
} from "lucide-react";
import dayjs from "dayjs";
import { AppointmentWithRelations } from "./scheduling-dashboard";
import React from "react";

interface AppointmentCardProps {
  appointment: AppointmentWithRelations;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isMobile?: boolean;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onEdit,
  onDelete,
  isMobile,
}) => {
  const price = (appointment.service.servicePriceInCents / 100).toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    },
  );

  if (isMobile) {
    return (
      <Card className="bg-background border-border relative flex flex-col items-center justify-start shadow-sm">
        <div className="flex w-full flex-row items-center justify-between gap-2 px-4">
          <div className="flex min-w-[70px] flex-row items-center gap-2">
            <span className="bg-primary border-primary text-md rounded-sm p-2 leading-none font-bold text-white">
              {appointment.time.substring(0, 5)}
            </span>
            <Badge className="bg-primary/25 border-primary text-primary rounded-xl border-1">
              Agendado
            </Badge>
          </div>
          <span className="text-md text-primary font-bold">{price}</span>
        </div>
        <div className="flex w-full flex-col px-4">
          <div className="mb-3 flex flex-col gap-2">
            <div className="text-foreground flex items-center gap-2">
              <SquareUser className="text-muted-foreground h-4 w-4" />
              <span className="flex items-center gap-1 text-sm font-medium">
                {appointment.client.name}{" "}
                <p className="text-muted-foreground text-xs">Cliente</p>
              </span>
            </div>
            <div className="text-foreground flex items-center gap-2">
              <Phone className="text-muted-foreground h-4 w-4" />
              <span className="flex items-center gap-1 text-sm font-medium">
                {appointment.client.phoneNumber}{" "}
                <p className="text-muted-foreground text-xs">Contato</p>
              </span>
            </div>
          </div>
          <div className="mb-3 flex flex-col gap-2">
            <div className="text-foreground flex items-center gap-2">
              <User className="text-muted-foreground h-4 w-4" />
              <span className="flex items-center gap-1 text-sm font-medium">
                {appointment.professional.name}{" "}
                <p className="text-muted-foreground text-xs">Profissional</p>
              </span>
            </div>
            <div className="text-foreground flex items-center gap-2">
              <ShoppingBag className="text-muted-foreground h-4 w-4" />
              <span className="flex items-center gap-1 text-sm font-medium">
                {appointment.service.name}{" "}
                <p className="text-muted-foreground text-xs">Serviço</p>
              </span>
            </div>
          </div>
        </div>
        <div className="absolute right-2 bottom-2 flex flex-col">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(appointment.id);
            }}
            variant="link"
            className="cursor-pointer"
          >
            <Edit2 className="text-primary h-5 w-5" />
          </Button>
          <Button
            onClick={() => onDelete(appointment.id)}
            variant="link"
            className="cursor-pointer"
          >
            <p className="text-red-500">
              <X className="h-5 w-5" />
            </p>
          </Button>
        </div>
      </Card>
    );
  }

  // Desktop
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
            <p className="text-lg font-semibold text-green-400">{price}</p>
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
                <p className="text-muted-foreground text-xs">Cliente</p>
              </span>
            </div>
            <div className="text-foreground flex items-center gap-2">
              <Phone className="text-muted-foreground h-4 w-4" />
              <span className="flex items-center gap-1 text-sm font-medium">
                {appointment.client.phoneNumber}{" "}
                <p className="text-muted-foreground text-xs">Contato</p>
              </span>
            </div>
          </div>
          <div className="mb-3 flex flex-col gap-2">
            <div className="text-foreground flex items-center gap-2">
              <User className="text-muted-foreground h-4 w-4" />
              <span className="flex items-center gap-1 text-sm font-medium">
                {appointment.professional.name}{" "}
                <p className="text-muted-foreground text-xs">Profissional</p>
              </span>
            </div>
            <div className="text-foreground flex items-center gap-2">
              <ShoppingBag className="text-muted-foreground h-4 w-4" />
              <span className="flex items-center gap-1 text-sm font-medium">
                {appointment.service.name}{" "}
                <p className="text-muted-foreground text-xs">Serviço</p>
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <div className="absolute right-2 bottom-2 flex flex-col">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(appointment.id);
          }}
          variant="link"
          className="cursor-pointer"
        >
          <Edit2 className="text-primary h-5 w-5" />
        </Button>
        <Button
          onClick={() => onDelete(appointment.id)}
          variant="link"
          className="cursor-pointer"
        >
          <p className="text-red-500">
            <X className="h-5 w-5" />
          </p>
        </Button>
      </div>
    </Card>
  );
};

export type { AppointmentWithRelations };
