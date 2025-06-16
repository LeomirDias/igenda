"use client";

import dayjs from "dayjs";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";

import { getProfessional } from "@/actions/get-professional";
import { getService } from "@/actions/get-service";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAppointmentStore } from "@/stores/appointment-store";

interface ConfirmAppointmentProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ConfirmAppointment = ({ open, onOpenChange }: ConfirmAppointmentProps) => {
    const appointment = useAppointmentStore.getState();
    const [professionalName, setProfessionalName] = useState<string>("");
    const [serviceName, setServiceName] = useState<string>("");
    const [servicePrice, setServicePrice] = useState<number>(0);

    const { execute: executeProfessional } = useAction(getProfessional, {
        onSuccess: (professional) => {
            setProfessionalName(professional.data?.name ?? "");
        },
        onError: (error) => {
            console.error("Erro ao buscar profissional:", error);
        }
    });

    const { execute: executeService } = useAction(getService, {
        onSuccess: (service) => {
            setServiceName(service.data?.name ?? "");
            setServicePrice((service.data?.servicePriceInCents ?? 0) / 100);
        },
        onError: (error) => {
            console.error("Erro ao buscar serviço:", error);
        }
    });

    useEffect(() => {
        if (appointment.professionalId) {
            executeProfessional({ professionalId: appointment.professionalId });
        }
    }, [appointment.professionalId, executeProfessional]);

    useEffect(() => {
        if (appointment.serviceId) {
            executeService({ serviceId: appointment.serviceId });
        }
    }, [appointment.serviceId, executeService]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom">
                <SheetHeader>
                    <SheetTitle>Confirmar Agendamento</SheetTitle>
                    <SheetDescription>Confirme os detalhes do seu agendamento</SheetDescription>
                </SheetHeader>
                <Separator />
                <div className="flex flex-col gap-4 ml-4">
                    <div className="flex flex-col gap-2">
                        <p>Data: {dayjs(appointment.date).format("DD/MM/YYYY")}</p>
                        <p>Horário: {appointment.time}</p>
                        <p>Profissional: {professionalName || "Carregando..."}</p>
                        <p>Serviço: {serviceName || "Carregando..."}</p>
                        <p>Valor: R$ {servicePrice.toFixed(2) || "Carregando..."}</p>
                    </div>
                </div>
                <Separator />
                <SheetFooter>
                    <Button>Confirmar Agendamento</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

export default ConfirmAppointment;