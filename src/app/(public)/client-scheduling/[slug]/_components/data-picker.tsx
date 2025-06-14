import { ptBR } from "date-fns/locale";
import { useState } from "react";

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { useAppointmentStore } from "@/stores/appointment-store";

import NotificationTag from "./notification-tag";

interface DataPickerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DataPicker = ({ open, onOpenChange }: DataPickerProps) => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const setStoreDate = useAppointmentStore((state) => state.setDate);

    const handleSelectDate = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        if (selectedDate) {
            setStoreDate(selectedDate.toISOString());
            console.log(useAppointmentStore.getState());
        } else {
            setStoreDate("");
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom">
                <SheetHeader>
                    <SheetTitle>Agendar Horário</SheetTitle>
                    <SheetDescription>
                        Selecione a data e horário desejados para o seu agendamento.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-6">
                    <div>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleSelectDate}
                            initialFocus
                            locale={ptBR}
                            className="w-full"
                        />
                    </div>
                    <div className="px-4">
                        {date === undefined ? (
                            <NotificationTag itemForSelection="data" itemForShow="horários" />
                        ) : (
                            <p className="text-sm text-muted-foreground">Horários disponíveis para a data e profissional selecionados</p>
                        )}
                    </div>
                </div>
                <SheetFooter>
                    <Button type="submit" disabled={date === undefined}>Confirmar Agendamento</Button>
                    <SheetClose asChild>
                        <Button variant="outline">Fechar</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default DataPicker;