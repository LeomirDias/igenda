"use client";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

import { getAvailableTimes } from "@/actions/get-available-times";
import { Badge } from "@/components/ui/badge";
import { useAppointmentStore } from "@/stores/appointment-store";

const TimePicker = () => {
    const selectedProfessionalId = useAppointmentStore((state) => state.professionalId);
    const selectedDate = useAppointmentStore((state) => state.date);
    const setStoreTime = useAppointmentStore((state) => state.setTime);

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
            console.log(useAppointmentStore.getState());
        } else {
            setStoreTime("");
        }
    };


    return (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-4">
            {availableTimes.data.map((time) => (
                <div key={time.value}>
                    <Badge
                        variant={time.available ? "outline" : "secondary"}
                        className={`text-sm ${time.available
                            ? useAppointmentStore.getState().time === time.value
                                ? 'bg-primary text-primary-foreground cursor-pointer font-normal'
                                : 'cursor-pointer border-primary text-primary font-normal'
                            : 'text-muted-foreground font-normal border-muted-foreground/50'
                            }`}
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