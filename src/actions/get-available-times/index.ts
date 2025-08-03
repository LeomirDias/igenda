"use server";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { professionalsTable } from "@/db/schema";
import { generateTimeSlots } from "@/helpers/time";
import { actionClient } from "@/lib/next-safe-action";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export const getAvailableTimes = actionClient
  .schema(
    z.object({
      professionalId: z.string(),
      date: z.string().date(), // YYYY-MM-DD,
    }),
  )
  .action(async ({ parsedInput }) => {
    const professional = await db.query.professionalsTable.findFirst({
      where: eq(professionalsTable.id, parsedInput.professionalId),
    });
    if (!professional) {
      throw new Error("Profissional não encontrado");
    }
    const selectedDayOfWeek = dayjs(parsedInput.date).day();
    const professionalIsAvailable =
      selectedDayOfWeek >= professional.availableFromWeekDay &&
      selectedDayOfWeek <= professional.availableToWeekDay;
    if (!professionalIsAvailable) {
      return [];
    }
    const appointments = await db.query.appointmentsTable.findMany({
      where: (appointment, { and, eq, ne }) =>
        and(
          eq(appointment.professionalId, parsedInput.professionalId),
          ne(appointment.status, "canceled"),
        ),
    });
    const appointmentsOnSelectedDate = appointments
      .filter((appointment) => {
        return dayjs(appointment.date).isSame(parsedInput.date, "day");
      })
      .map((appointment) => dayjs(appointment.date).format("HH:mm:ss"));
    const timeSlots = generateTimeSlots();

    // Converte os horários do banco (UTC) para horário local
    const professionalAvailableFrom = dayjs()
      .utc()
      .set("hour", Number(professional.availableFromTime.split(":")[0]))
      .set("minute", Number(professional.availableFromTime.split(":")[1]))
      .set("second", 0)
      .local();

    const professionalAvailableTo = dayjs()
      .utc()
      .set("hour", Number(professional.availableToTime.split(":")[0]))
      .set("minute", Number(professional.availableToTime.split(":")[1]))
      .set("second", 0)
      .local();

    const professionalTimeSlots = timeSlots.filter((time) => {
      const timeHour = Number(time.split(":")[0]);
      const timeMinute = Number(time.split(":")[1]);

      // Compara diretamente os horários
      const slotTime = timeHour * 60 + timeMinute;
      const fromTime = professionalAvailableFrom.hour() * 60 + professionalAvailableFrom.minute();
      const toTime = professionalAvailableTo.hour() * 60 + professionalAvailableTo.minute();

      return slotTime >= fromTime && slotTime <= toTime;
    });
    return professionalTimeSlots.map((time) => {
      return {
        value: time,
        available: !appointmentsOnSelectedDate.includes(time),
        label: time.substring(0, 5),
      };
    });
  });
