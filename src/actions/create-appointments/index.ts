"use server";

import dayjs from "dayjs";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import {
  appointmentsTable,
  enterprisesTable,
  servicesTable,
} from "@/db/schema";
import { actionClient } from "@/lib/next-safe-action";

import { getAvailableTimes } from "../get-available-times";
import { createAppointmentSchema } from "./schema";

export const createAppointment = actionClient
  .schema(createAppointmentSchema)
  .action(async ({ parsedInput }) => {
    const availableTimes = await getAvailableTimes({
      professionalId: parsedInput.professionalId,
      date: dayjs(parsedInput.date).format("YYYY-MM-DD"),
    });

    if (!availableTimes?.data) {
      throw new Error("No available times");
    }

    const isTimeAvailable = availableTimes.data?.some(
      (time) => time.value === parsedInput.time && time.available,
    );

    if (!isTimeAvailable) {
      throw new Error("Time not available");
    }

    const service = await db.query.servicesTable.findFirst({
      where: eq(servicesTable.id, parsedInput.serviceId),
    });

    if (!service) {
      throw new Error("Service not found");
    }

    const enterprise = await db.query.enterprisesTable.findFirst({
      where: eq(enterprisesTable.id, parsedInput.enterpriseId),
    });

    const appointmentDateTime = dayjs(parsedInput.date)
      .set("hour", parseInt(parsedInput.time.split(":")[0]))
      .set("minute", parseInt(parsedInput.time.split(":")[1]))
      .toDate();

    await db.insert(appointmentsTable).values({
      clientId: parsedInput.clientId,
      serviceId: parsedInput.serviceId,
      professionalId: parsedInput.professionalId,
      time: parsedInput.time,
      date: appointmentDateTime,
      enterpriseId: parsedInput.enterpriseId,
      appointmentPriceInCents: service.servicePriceInCents,
      status: "not-confirmed",
    });
  });
