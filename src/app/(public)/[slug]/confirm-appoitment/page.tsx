"use client";

import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { createAppointment } from "@/actions/create-appointments";
import { getEnterpriseBySlug } from "@/actions/get-enterprise-by-slug";
import { getProfessional } from "@/actions/get-professional";
import { getService } from "@/actions/get-service";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAppointmentStore } from "@/stores/appointment-store";

const ConfirmAppointment = () => {
    const router = useRouter();
    const params = useParams()
    const slug = params.slug as string
    const appointment = useAppointmentStore.getState();
    const [professionalName, setProfessionalName] = useState<string>("");
    const [serviceName, setServiceName] = useState<string>("");
    const [servicePrice, setServicePrice] = useState<number>(0);
    const [enterpriseId, setEnterpriseId] = useState<string>("");
    const [serviceDuration, setServiceDuration] = useState<number>(0);

    const { execute: executeGetEnterprise } = useAction(getEnterpriseBySlug, {
        onSuccess: (enterprise) => {
            setEnterpriseId(enterprise.data?.id ?? "");
        },
        onError: (error) => {
            console.error("Erro ao buscar empresa:", error);
            toast.error("Erro ao buscar empresa");
            router.push(`/${slug}`);
        }
    });

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
            setServiceDuration(service.data?.durationInMinutes ?? 0);
        },
        onError: (error) => {
            console.error("Erro ao buscar serviço:", error);
        }
    });

    const { execute: executeAddAppointment } = useAction(createAppointment, {
        onSuccess: () => {
            router.push(`/${slug}/successful-scheduling`);
        },
        onError: () => {
            toast.error("Erro ao criar agendamento. Por favor, tente novamente.");
            router.push(`/${slug}`);
        }
    });

    useEffect(() => {
        executeGetEnterprise({ slug });
    }, [executeGetEnterprise, slug]);

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

    const handleClickConfirm = () => {
        if (!appointment.clientId || !appointment.serviceId || !appointment.professionalId || !appointment.date || !appointment.time || !enterpriseId) {
            toast.error("Dados do agendamento incompleto, por favor, tente novamente.");
            router.push(`/${slug}`);
            return;
        }

        executeAddAppointment({
            clientId: appointment.clientId,
            serviceId: appointment.serviceId,
            professionalId: appointment.professionalId,
            date: appointment.date,
            time: appointment.time,
            enterpriseId: enterpriseId
        });
    }

    return (
        <Sheet open>
            <SheetContent side="bottom">
                <SheetHeader>
                    <SheetTitle>Quase lá!</SheetTitle>
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
                        <p>Duração: {serviceDuration} minutos</p>
                    </div>
                </div>
                <Separator />
                <SheetFooter>
                    <Button type="submit" onClick={handleClickConfirm}>Confirmar agendamento</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

export default ConfirmAppointment;