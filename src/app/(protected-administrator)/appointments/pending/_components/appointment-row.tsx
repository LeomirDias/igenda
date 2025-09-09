"use client";

import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { cancelAppointment } from "@/actions/cancel-appointment";
import { confirmAppointment } from "@/actions/confirm-appointment";
import { markAppointmentCompleted } from "@/actions/mark-appointment-completed";
import { markAppointmentNoShow } from "@/actions/mark-appointment-no-show";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AppointmentRow({
    type,
    date,
    appointmentId,
    title,
    clientName,
    professionalName,
    time,
    priceInCents,
}: {
    type: "confirm" | "conclude";
    appointmentId: string;
    title: string;
    clientName: string;
    professionalName: string;
    time: string;
    date: string;
    priceInCents: number;
}) {
    const [justification, setJustification] = useState("");
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

    const { execute: executeConfirm, status: confirmStatus } = useAction(confirmAppointment, {
        onSuccess: () => {
            toast.success("Agendamento confirmado com sucesso!");
        },
        onError: () => toast.error("Falha ao confirmar agendamento."),
    });

    const { execute: executeCancel, status: cancelStatus } = useAction(cancelAppointment, {
        onSuccess: () => {
            toast.success("Agendamento cancelado com sucesso!");
            setIsCancelDialogOpen(false);
            setJustification("");
        },
        onError: () => toast.error("Falha ao cancelar agendamento."),
    });

    const { execute: executeMarkCompleted, status: completedStatus } = useAction(markAppointmentCompleted, {
        onSuccess: () => {
            toast.success("Agendamento marcado como finalizado!");
        },
        onError: () => toast.error("Falha ao marcar agendamento como finalizado."),
    });

    const { execute: executeMarkNoShow, status: noShowStatus } = useAction(markAppointmentNoShow, {
        onSuccess: () => {
            toast.success("Agendamento marcado como falta!");
        },
        onError: () => toast.error("Falha ao marcar agendamento como falta."),
    });

    const price = (priceInCents / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    const handleConfirm = () => {
        executeConfirm({ id: appointmentId });
    };

    const handleCancel = () => {
        executeCancel({
            id: appointmentId,
            justification: justification.trim() || undefined
        });
    };

    const handleMarkCompleted = () => {
        executeMarkCompleted({ id: appointmentId });
    };

    const handleMarkNoShow = () => {
        executeMarkNoShow({ id: appointmentId });
    };

    return (
        <Card className="border-border">
            <CardContent className="flex items-center justify-between p-4">
                <div>
                    <p className="text-lg font-bold">{title}</p>
                    <p className="text-sm text-muted-foreground mb-4">{clientName}</p>
                    <p className="text-xs text-muted-foreground mb-0.5">Profissional: {professionalName}</p>
                    <p className="text-xs mb-0.5">{date} às {time}</p>
                    <p className="text-xs">{price}</p>
                </div>
                <div className="flex gap-2">
                    {type === "confirm" ? (
                        <>
                            <Button
                                disabled={confirmStatus === "executing"}
                                onClick={handleConfirm}
                            >
                                Confirmar
                            </Button>
                            <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" disabled={cancelStatus === "executing"}>
                                        Recusar
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Cancelar Agendamento</DialogTitle>
                                        <DialogDescription>
                                            Tem certeza que deseja cancelar este agendamento?
                                            Você pode adicionar uma justificativa opcional.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="justification">Justificativa (opcional)</Label>
                                            <Input
                                                id="justification"
                                                placeholder="Digite o motivo do cancelamento..."
                                                value={justification}
                                                onChange={(e) => setJustification(e.target.value)}
                                                maxLength={500}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsCancelDialogOpen(false)}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={handleCancel}
                                            disabled={cancelStatus === "executing"}
                                        >
                                            {cancelStatus === "executing" ? "Cancelando..." : "Confirmar Cancelamento"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </>
                    ) : (
                        <>
                            <Button
                                disabled={completedStatus === "executing"}
                                onClick={handleMarkCompleted}
                            >
                                {completedStatus === "executing" ? "Finalizando..." : "Finalizado"}
                            </Button>
                            <Button
                                variant="outline"
                                disabled={noShowStatus === "executing"}
                                onClick={handleMarkNoShow}
                            >
                                {noShowStatus === "executing" ? "Marcando..." : "Falta"}
                            </Button>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}


