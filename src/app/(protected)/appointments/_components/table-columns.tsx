"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { appointmentsTable } from "@/db/schema";

import AppointmentsTableActions from "./table-actions";

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

export const appointmentsTableColumns: ColumnDef<AppointmentWithRelations>[] = [
    {
        id: "client",
        accessorKey: "client.name",
        header: "Cleinte",
    },
    {
        id: "professional",
        accessorKey: "professional.name",
        header: "Profissional",
        cell: (params) => {
            const appointment = params.row.original;
            return `${appointment.professional.name}`;
        },
    },
    {
        id: "service",
        accessorKey: "service.name",
        header: "Serviço",
        cell: (params) => {
            const appointment = params.row.original;
            return `${appointment.service.name}`;
        },
    },
    {
        id: "date",
        accessorKey: "date",
        header: "Data e Hora",
        cell: (params) => {
            const appointment = params.row.original;
            return format(new Date(appointment.date), "dd/MM/yyyy 'às' HH:mm", {
                locale: ptBR,
            });
        },
    },
    {
        id: "specialty",
        accessorKey: "professional.specialty",
        header: "Especialidade",
    },
    {
        id: "price",
        accessorKey: "service.servicePriceInCents",
        header: "Valor",
        cell: (params) => {
            const appointment = params.row.original;
            const price = appointment.service.servicePriceInCents / 100;
            return new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
            }).format(price);
        },
    },
    {
        id: "actions",
        cell: (params) => {
            const appointment = params.row.original;
            return <AppointmentsTableActions appointment={appointment} />;
        },
    },
];