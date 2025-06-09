"use client";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { professionalsTable } from "@/db/schema";
import { useAppointmentStore } from "@/stores/appointment-store";

import { CalendarPicker } from "./calendar-picker";

interface ProfessionalCardProps {
    professional: typeof professionalsTable.$inferSelect;
    enterpriseSlug: string;
}

const ProfessionalCard = ({ professional, enterpriseSlug }: ProfessionalCardProps) => {
    const router = useRouter();
    const setProfessionalId = useAppointmentStore((state) => state.setProfessionalId);
    const setDate = useAppointmentStore((state) => state.setDate);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const handleServiceSelect = () => {
        setProfessionalId(professional.id);
        setIsCalendarOpen(true);
    };

    const handleDateSelect = (date: Date) => {
        setDate(dayjs(date).format("YYYY-MM-DD"));
        router.push(`/${enterpriseSlug}/public-enterprise-services`);
    };

    const professionalInitials = professional.name
        .split(" ")
        .map((name) => name[0])
        .join("");

    return (
        <>
            <div
                onClick={handleServiceSelect}
                className="flex flex-col items-center justify-center gap-2 hover:bg-accent cursor-pointer transition-colors"
            >
                <Avatar className={`h-10 w-10 relative ${isCalendarOpen ? 'border-2 border-primary' : ''}`}>
                    {professional.avatarImageURL ? (
                        <Image
                            src={professional.avatarImageURL}
                            alt={professional.name}
                            fill
                            style={{ objectFit: "cover" }}
                            className="rounded-full"
                        />
                    ) : (
                        <AvatarFallback className={isCalendarOpen ? 'border-2 border-primary' : ''}>{professionalInitials}</AvatarFallback>
                    )}
                </Avatar>
                <h3 className={`text-sm font-medium ${isCalendarOpen ? 'text-primary' : ''}`}>{professional.name.split(' ')[0]}</h3>
            </div>
            <CalendarPicker
                open={isCalendarOpen}
                onOpenChange={setIsCalendarOpen}
                onDateSelect={handleDateSelect}
                professional={professional}
            />
        </>
    );
};

export default ProfessionalCard;