"use client";

import { ptBR } from "date-fns/locale";
import * as React from "react";

import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { professionalsTable } from "@/db/schema";

interface CalendarPickerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDateSelect: (date: Date) => void;
    professional: typeof professionalsTable.$inferSelect;
}

export function CalendarPicker({ open, onOpenChange, onDateSelect, professional }: CalendarPickerProps) {
    const [date, setDate] = React.useState<Date>(new Date());

    const handleDateSelect = (newDate: Date | undefined) => {
        if (newDate) {
            setDate(newDate);
            onDateSelect(newDate);
            onOpenChange(false);
        }
    };

    const isDateAvailable = (date: Date) => {
        const dayOfWeek = date.getDay();
        return (
            dayOfWeek >= professional.availableFromWeekDay &&
            dayOfWeek <= professional.availableToWeekDay
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Selecione uma data</DialogTitle>
                </DialogHeader>
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    disabled={(date) =>
                        date < new Date() || !isDateAvailable(date)
                    }
                    locale={ptBR}
                />
            </DialogContent>
        </Dialog>
    );
} 