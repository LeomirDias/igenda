"use client";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

import { getAvailableTimes } from "@/actions/get-available-times";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAppointmentStore } from "@/stores/appointment-store";

const TimePicker = () => {
    const selectedProfessionalId = useAppointmentStore((state) => state.professionalId);
    const selectedDate = useAppointmentStore((state) => state.date);
    const setStoreTime = useAppointmentStore((state) => state.setTime);
    const selectedTime = useAppointmentStore((state) => state.time);

    const { data: availableTimes } = useQuery({
        queryKey: ["available-times", selectedDate, selectedProfessionalId],
        queryFn: () =>
            getAvailableTimes({
                date: dayjs(selectedDate).format("YYYY-MM-DD"),
                professionalId: selectedProfessionalId ?? "",
            }),
        enabled: !!selectedDate && !!selectedProfessionalId,
    });

    if (!availableTimes?.data || !Array.isArray(availableTimes.data)) {
        return null;
    }

    const handleSelectTime = (selectedTime: string | undefined) => {
        if (selectedTime) {
            setStoreTime(selectedTime);
        } else {
            setStoreTime("");
        }
    };

    return (
        <div className="grid grid-cols-5 sm:flex sm:flex-wrap gap-2 mt-4 w-full items-center justify-center">
            {availableTimes.data.map((time) => (
                <div key={time.value}>
                    <Badge
                        variant={selectedTime === time.value ? "default" : "outline"}
                        className={cn(
                            "w-[70px] text-sm font-normal transition-all duration-200 p-2 border-1 border-gray-300",
                            time.available
                                ? "cursor-pointer hover:scale-105"
                                : "bg-white text-red-500 border-red-500 cursor-not-allowed"
                        )}
                        onClick={() => time.available && handleSelectTime(time.value)}
                    >
                        {time.label}
                    </Badge>
                </div>
            ))}
        </div>
    );
}

export default TimePicker;