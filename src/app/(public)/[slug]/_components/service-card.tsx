"use client";

import { Clock } from "lucide-react";
import { useParams } from 'next/navigation'

import StoreRedirectButton from "@/app/(public)/_components/store-redirect-button";
import { Separator } from "@/components/ui/separator";
import { servicesTable } from "@/db/schema";

import NotificationTag from "../../_components/notification-tag";


interface ServiceCardProps {
    services: typeof servicesTable.$inferSelect[]
}

const ServiceCard = ({ services }: ServiceCardProps) => {

    const params = useParams()
    const slug = params.slug as string

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(price)
    }

    return (
        <div>
            <NotificationTag itemForSelection="serviço" itemForShow="profissionais" />
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
                                <StoreRedirectButton
                                    storeKey="setServiceId"
                                    value={service.id}
                                    redirectTo="professional-selection"
                                    slug={slug}
                                    className="text-xs h-8 w-16"
                                >
                                    Agendar
                                </StoreRedirectButton>
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