"use client";
import { Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SlugPageHeader, SlugPageHeaderContent, SlugPageTitle } from "@/components/ui/slug-page-container";
import { servicesTable } from "@/db/schema";
import { useAppointmentStore } from "@/stores/appointment-store";


interface ServiceCardProps {
    services: typeof servicesTable.$inferSelect[]
}

const ServiceCard = ({ services }: ServiceCardProps) => {
    const appointmentStore = useAppointmentStore();

    const handleSelectService = (serviceId: string) => {
        appointmentStore.setServiceId(serviceId);
        console.log(useAppointmentStore.getState());
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(price)
    }

    return (
        <div>
            <SlugPageHeader>
                <SlugPageHeaderContent>
                    <SlugPageTitle>Serviços</SlugPageTitle>
                </SlugPageHeaderContent>
            </SlugPageHeader>

            <div className="space-y-3 mt-4">
                {services.map((service: typeof servicesTable.$inferSelect) => (
                    <div key={service.id} className="flex flex-col gap-3">
                        <div>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <p className="font-semibold text-md text-foreground">{service.name}</p>
                                    </div>
                                    <div className="flex items-center space-x-4 text-xs">
                                        <p className="font-semibold text-primary">{formatPrice(service.servicePriceInCents / 100)}</p>
                                        <div className="flex items-center space-x-1 text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            <p>{service.durationInMinutes} min</p>
                                        </div>
                                    </div>
                                </div>
                                <Button onClick={() => handleSelectService(service.id)} className="text-xs h-8 w-16">
                                    Agendar
                                </Button>
                            </div>
                        </div>
                        <Separator />
                    </div>
                ))}

            </div>
        </div>
    )
}

export default ServiceCard;