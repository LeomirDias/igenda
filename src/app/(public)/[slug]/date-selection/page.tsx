"use client";

import { ptBR } from "date-fns/locale";
import { useParams, useRouter } from "next/navigation";
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

import NotificationTag from "../../_components/notification-tag";
import TimePicker from "../_components/time-picker";



const DataPicker = () => {
    const router = useRouter()
    const params = useParams()
    const slug = params.slug as string

    const [date, setDate] = useState<Date | undefined>(undefined);

    const setStoreDate = useAppointmentStore((state) => state.setDate);

    const handleSelectDate = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        if (selectedDate) {
            setStoreDate(selectedDate.toISOString());
            console.log(useAppointmentStore.getState());
        }
    };

    const handleClickConfirm = () => {
        router.push(`/${slug}/client-infos`);
    }

    return (
        <Sheet open>
            <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle>Agendar Horário</SheetTitle>
                    <SheetDescription>
                        Selecione a data e horário desejados para o seu agendamento.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-6 h-[calc(100vh-8rem)] overflow-y-auto">
                    <div>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleSelectDate}
                            initialFocus
                            locale={ptBR}
                            styles={{
                                head_cell: {
                                    width: "100%",
                                    textTransform: "capitalize",
                                },
                                cell: {
                                    width: "100%",
                                },
                                button: {
                                    width: "100%",
                                },
                                nav_button_previous: {
                                    width: "32px",
                                    height: "32px",
                                },
                                nav_button_next: {
                                    width: "32px",
                                    height: "32px",
                                },
                                caption: {
                                    textTransform: "capitalize",
                                },
                            }}
                        />
                    </div>
                    <div className="px-4">
                        {date === undefined ? (
                            <NotificationTag itemForSelection="data" itemForShow="horários" />
                        ) : (
                            <div className="flex flex-col gap-2 items-center justify-center">
                                <p className="text-sm text-muted-foreground">Horários disponíveis para a data e profissional selecionados</p>
                                <TimePicker />
                            </div>
                        )}
                    </div>
                </div>
                <SheetFooter>
                    <Button type="submit" disabled={date === undefined} onClick={handleClickConfirm}>Confirmar</Button>
                    <SheetClose asChild>
                        <Button variant="outline">Fechar</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default DataPicker;