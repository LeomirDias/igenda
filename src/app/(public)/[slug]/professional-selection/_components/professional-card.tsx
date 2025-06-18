"use client";

import { useParams } from "next/navigation";

import NotificationTag from "@/app/(public)/_components/notification-tag";
import StoreRedirectButton from "@/app/(public)/_components/store-redirect-button";
import { Separator } from "@/components/ui/separator";
import { professionalsTable } from "@/db/schema";

interface ProfessionalCardProps {
    professionals: typeof professionalsTable.$inferSelect[],
}

const ProfessionalCard = ({ professionals }: ProfessionalCardProps) => {
    const params = useParams()
    const slug = params.slug as string

    return (
        <div>
            <NotificationTag itemForSelection="profissional" itemForShow="data" />
            <div className="space-y-3 mt-4">
                {professionals.map((professional: typeof professionalsTable.$inferSelect) => (
                    <div key={professional.id} className="flex flex-col gap-3">
                        <div>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <p className="font-semibold text-md text-foreground">{professional.name}</p>
                                    </div>
                                    <p className="font-semibold text-primary text-xs">{professional.specialty}</p>
                                </div>
                                <StoreRedirectButton
                                    storeKey="setProfessionalId"
                                    value={professional.id}
                                    redirectTo="date-selection"
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

export default ProfessionalCard;