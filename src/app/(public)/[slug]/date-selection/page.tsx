"use client";

import { useQuery } from "@tanstack/react-query";
import { ptBR } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { getProfessional } from "@/actions/get-professional";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppointmentStore } from "@/stores/appointment-store";

import NotificationTag from "../../_components/notification-tag";
import TimePicker from "../_components/time-picker";

const DataPicker = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const isMobile = useIsMobile();
  const timePickerRef = useRef<HTMLDivElement>(null);

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const setStoreDate = useAppointmentStore((state) => state.setDate);
  const selectedProfessionalId = useAppointmentStore(
    (state) => state.professionalId,
  );

  const { data: professional } = useQuery({
    queryKey: ["professional", selectedProfessionalId],
    queryFn: () =>
      getProfessional({ professionalId: selectedProfessionalId ?? "" }),
    enabled: !!selectedProfessionalId,
  });

  const isDateAvailable = (date: Date) => {
    if (!selectedProfessionalId || !professional?.data) return false;

    // Verifica se a data não é anterior ao dia atual
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return false;

    const dayOfWeek = date.getDay();
    return (
      dayOfWeek >= professional.data.availableFromWeekDay &&
      dayOfWeek <= professional.data.availableToWeekDay
    );
  };

  const handleSelectDate = (selectedDate: Date | undefined) => {

    setDate(selectedDate);
    if (selectedDate) {
      setStoreDate(selectedDate.toISOString());
      console.log(useAppointmentStore.getState());

      // Scroll automático para mobile quando uma data for selecionada
      if (isMobile && timePickerRef.current) {
        setTimeout(() => {
          timePickerRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100); // Pequeno delay para garantir que o componente foi renderizado
      }
    }
  };

  const handleClickConfirm = () => {
    setIsLoading(true);
    router.push(`/${slug}/client-infos`);
  };

  const handleClose = () => {
    router.push(`/${slug}/professional-selection`);
  };

  return (
    <Sheet open>
      <SheetContent side="right" className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Agendar Horário</SheetTitle>
          <SheetDescription>
            Selecione a data e horário desejados para o seu agendamento.
          </SheetDescription>
        </SheetHeader>
        <div className="flex h-[calc(100vh-8rem)] flex-col gap-6 overflow-y-auto">
          <div className="w-full">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelectDate}
              initialFocus
              locale={ptBR}
              disabled={(date) => !isDateAvailable(date)}
            />
          </div>
          <div className="px-4" ref={timePickerRef}>
            {date === undefined ? (
              <NotificationTag itemForSelection="data" itemForShow="horários" />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2">
                <p className="text-muted-foreground text-sm">
                  Horários disponíveis para a data e profissional selecionados
                </p>
                <TimePicker />
              </div>
            )}
          </div>
        </div>
        <SheetFooter>
          <Button
            type="submit"
            disabled={isLoading || date === undefined}
            onClick={handleClickConfirm}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Confirmar"
            )}
          </Button>
          <SheetClose asChild>
            <Button variant="secondary" onClick={handleClose}>
              Voltar
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default DataPicker;
