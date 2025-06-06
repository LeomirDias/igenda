"use client";
import { Clock, DollarSign, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { deleteService } from "@/actions/delete-service";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { servicesTable } from "@/db/schema";
import { formatCurrencyInCents } from "@/helpers/currency";

import UpsertServiceForm from "./upsert-service-form";

interface ServiceCardProps {
    service: typeof servicesTable.$inferSelect
}


const ServiceCard = ({ service }: ServiceCardProps) => {

    const [isUpsertPRofessionalFormOpen, setIsUpsertProfessionalFormOpen] = useState(false);

    const deleteServiceAction = useAction(deleteService, {
        onSuccess: () => {
            toast.success("Serviço deletado com sucesso!");
        },
        onError: () => {
            toast.error(`Erro ao deletar serviço.`);
        },
    });

    const handleDeleteService = () => {
        if (!service?.id) {
            toast.error("Serviço não encontrado.");
            return;
        }
        deleteServiceAction.execute({ id: service?.id || "" });
    };

    return (
        <Card>
            <CardHeader>
                <div className="h-3 text-sm font-medium">
                    <h3 className="h-3 text-sm font-medium">{service.name}</h3>
                </div>
            </CardHeader>
            <Separator />
            <CardContent className="flex flex-col gap-2">
                <Badge variant="outline">
                    <Clock className="mr-1" />
                    {service.durationInMinutes} minutos
                </Badge>
                <Badge variant="outline">
                    <DollarSign className="mr-1" />
                    {formatCurrencyInCents(service.servicePriceInCents)}
                </Badge>
            </CardContent>
            <Separator />
            <CardFooter className="flex flex-col gap-2">

                <Dialog
                    open={isUpsertPRofessionalFormOpen}
                    onOpenChange={setIsUpsertProfessionalFormOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full">Ver detalhes</Button>
                    </DialogTrigger>
                    <UpsertServiceForm service={service}
                        onSuccess={() => setIsUpsertProfessionalFormOpen(false)}
                    />

                    {service && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" className=" w-full hover:bg-red-500 hover:text-white">
                                    <Trash2 />
                                    Deletar serviço
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Tem certeza que deseja deletar esse serviço?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Essa ação não pode ser desfeita. Todos os dados relacionados a esse serviço serão perdidos permanentemente.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteService}>Deletar</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </Dialog>
            </CardFooter>
        </Card>
    );
}

export default ServiceCard;