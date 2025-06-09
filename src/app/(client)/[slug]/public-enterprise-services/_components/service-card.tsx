"use client";
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { servicesTable } from "@/db/schema";
import { formatCurrencyInCents } from "@/helpers/currency";
import { useAppointmentStore } from "@/stores/appointment-store";

interface ServiceCardProps {
    service: typeof servicesTable.$inferSelect;
    enterpriseSlug: string;
}

const ServiceCard = ({ service, enterpriseSlug }: ServiceCardProps) => {
    const router = useRouter();
    const setServiceId = useAppointmentStore((state) => state.setServiceId);

    const handleServiceSelect = () => {
        setServiceId(service.id);
        router.push(`/${enterpriseSlug}/public-appointments`);
    };

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
                <Button onClick={handleServiceSelect} className="text-xs">
                    Agendar
                </Button>
            </div>
            <Separator className="w-full" />
        </div>
    );
};

export default ServiceCard;