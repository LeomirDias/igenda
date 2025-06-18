"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useAppointmentStore } from "@/stores/appointment-store";

type StoreKey = "setClientId" | "setServiceId" | "setProfessionalId" | "setDate" | "setTime";

interface StoreRedirectButtonProps {
    storeKey: StoreKey;
    value: string;
    redirectTo: string;
    slug: string;
    children: React.ReactNode;
    className?: string;
}

const StoreRedirectButton = ({
    storeKey,
    value,
    redirectTo,
    slug,
    children,
    className
}: StoreRedirectButtonProps) => {
    const router = useRouter();
    const appointmentStore = useAppointmentStore();

    const handleClick = () => {
        // Chama o setter apropriado baseado na storeKey
        appointmentStore[storeKey](value);
        console.log(useAppointmentStore.getState());

        // Redireciona para a página especificada com o slug
        router.push(`/${slug}/${redirectTo}`);
    };

    return (
        <Button
            onClick={handleClick}
            className={className}
        >
            {children}
        </Button>
    );
};

export default StoreRedirectButton; 