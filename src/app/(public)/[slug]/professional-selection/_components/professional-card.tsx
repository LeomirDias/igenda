"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getProfessionalsByService } from "@/actions/associate-professionals-to-service";
import NotificationTag from "@/app/(public)/_components/notification-tag";
import StoreRedirectButton from "@/app/(public)/_components/store-redirect-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { professionalsTable } from "@/db/schema";
import { useAppointmentStore } from "@/stores/appointment-store";

const ProfessionalCard = () => {
    const params = useParams();
    const slug = params.slug as string;
    const [professionals, setProfessionals] = useState<typeof professionalsTable.$inferSelect[]>([]);
    const { serviceId } = useAppointmentStore();

    const { execute: fetchProfessionals } = useAction(getProfessionalsByService, {
        onSuccess: (response) => {
            if (!response.data) return;
            setProfessionals(response.data);
        },
        onError: (error: { error?: { serverError?: string } }) => {
            toast.error(error.error?.serverError || "Erro ao buscar profissionais");
        }
    });

    useEffect(() => {
        if (serviceId) {
            fetchProfessionals({ serviceId });
        }
    }, [serviceId, fetchProfessionals]);

    return (
        <div>
            <div className="space-y-3 mt-4 mb-4">
                {professionals.map((professional) => (
                    <div key={professional.id} className="flex flex-col gap-3">
                        <div>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-16 w-16 relative border-1 border-gray-200 rounded-full">
                                            {professional?.avatarImageURL ? (
                                                <Image
                                                    src={professional?.avatarImageURL}
                                                    alt={professional?.name}
                                                    fill
                                                    style={{ objectFit: "cover" }}
                                                    className="rounded-full"
                                                />
                                            ) : (
                                                <AvatarFallback>{professional.name.split(" ").map((name: string) => name[0]).join("")}</AvatarFallback>
                                            )}
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <p className="font-semibold text-md text-foreground">{professional.name}</p>
                                            <p className="font-semibold text-primary text-xs">{professional.specialty}</p>
                                        </div>
                                    </div>
                                </div>
                                <StoreRedirectButton
                                    storeKey="setProfessionalId"
                                    value={professional.id}
                                    redirectTo="date-selection"
                                    slug={slug}
                                    className="text-xs h-8 w-16"
                                >
                                    Selecionar
                                </StoreRedirectButton>
                            </div>
                        </div>
                    </div>
                ))}
                {professionals.length === 0 && (
                    <p className="text-center text-muted-foreground">
                        Nenhum profissional disponível para este serviço.
                    </p>
                )}
            </div>
            <NotificationTag itemForSelection="profissional" itemForShow="data" />
        </div>
    );
}

export default ProfessionalCard;