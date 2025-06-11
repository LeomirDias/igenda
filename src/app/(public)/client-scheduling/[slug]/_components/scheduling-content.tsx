"use client";

import { professionalsTable, servicesTable } from "@/db/schema";
import { useAppointmentStore } from "@/stores/appointment-store";

import NotificationTag from "./notification-tag";
import ProfessionalCard from "./profesisonal-card";
import ServiceCard from "./service-card";

interface SchedulingContentProps {
    services: typeof servicesTable.$inferSelect[];
    professionals: typeof professionalsTable.$inferSelect[];
}

const SchedulingContent = ({ services, professionals }: SchedulingContentProps) => {
    const { serviceId } = useAppointmentStore();

    if (!serviceId) {
        return (
            <>
                <ServiceCard services={services} />
                <NotificationTag itemForSelection="serviço" itemForShow="profissionais" />
            </>
        );
    }

    return <ProfessionalCard professionals={professionals} />;
};

export default SchedulingContent; 