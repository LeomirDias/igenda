"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

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
    const [isLoading, setIsLoading] = React.useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        appointmentStore[storeKey](value);
        router.push(`/${slug}/${redirectTo}`);
    };

    return (
        <Button
            onClick={handleClick}
            className={className}
            disabled={isLoading}
        >
            {isLoading ? (
                <Loader2 className="animate-spin w-4 h-4" />
            ) : (
                children
            )}
        </Button>
    );
};

export default StoreRedirectButton; 