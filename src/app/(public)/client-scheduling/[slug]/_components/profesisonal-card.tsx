"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SlugPageHeader, SlugPageHeaderContent, SlugPageTitle } from "@/components/ui/slug-page-container";
import { professionalsTable } from "@/db/schema";
import { useAppointmentStore } from "@/stores/appointment-store";

import DataPicker from "./data-picker";

interface ProfessionalCardProps {
    professionals: typeof professionalsTable.$inferSelect[],
}

const ProfessionalCard = ({ professionals }: ProfessionalCardProps) => {
    const appointmentStore = useAppointmentStore();
    const [isDataPickerOpen, setIsDataPickerOpen] = useState(false);

    const handleSelectProfessional = (professionalId: string) => {
        appointmentStore.setProfessionalId(professionalId);
        console.log(useAppointmentStore.getState());
        setIsDataPickerOpen(true);
    }

    return (
        <div>
            <SlugPageHeader>
                <SlugPageHeaderContent>
                    <SlugPageTitle>Profissionais</SlugPageTitle>
                </SlugPageHeaderContent>
            </SlugPageHeader>

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
                                <Button onClick={() => handleSelectProfessional(professional.id)} className="text-xs h-8 w-16">
                                    Agendar
                                </Button>
                            </div>
                        </div>
                        <Separator />
                    </div>
                ))}
                <DataPicker
                    open={isDataPickerOpen}
                    onOpenChange={setIsDataPickerOpen}
                />
            </div>
        </div>
    )
}

export default ProfessionalCard;