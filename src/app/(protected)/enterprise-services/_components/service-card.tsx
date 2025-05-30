"use client";
import { DollarSign } from "lucide-react";

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
                    <DollarSign className="mr-1" />
                    {formatCurrencyInCents(service.servicePriceInCents)}
                </Badge>
            </CardContent>
            <Separator />
            <CardFooter>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="w-full">Ver detalhes</Button>
                    </DialogTrigger>
                    <UpsertServiceForm />
                </Dialog>
            </CardFooter>
        </Card>
    );
}

export default ServiceCard;