"use client";
import { Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { servicesTable } from "@/db/schema";
import { formatCurrencyInCents } from "@/helpers/currency";

interface ServiceCardProps {
    service: typeof servicesTable.$inferSelect
}


const ServiceCard = ({ service }: ServiceCardProps) => {

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-row gap-2 items-center justify-between w-full">
                <div className="flex flex-col gap-2">
                    <h3 className="text-md font-medium">{service.name}</h3>
                    <div className="flex flex-row gap-2 items-center">
                        <Badge variant="default" className="text-xs p-1">
                            {formatCurrencyInCents(service.servicePriceInCents)}
                        </Badge>
                        <Badge variant="secondary" className="text-xs p-1">
                            <Clock className="mr-1" />
                            {service.durationInMinutes} min
                        </Badge>
                    </div>
                </div>
                <Button className="text-xs">Agendar</Button>
            </div>
            <Separator className="w-full" />
        </div>

    );
}

export default ServiceCard;