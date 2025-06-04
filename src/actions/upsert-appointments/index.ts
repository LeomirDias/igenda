"use server";

import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { appointmentsTable, servicesTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { getAvailableTimes } from "../get-available-times";
import { upsertAppointmentSchema } from "./schema";


export const addAppointment = actionClient
    .schema(upsertAppointmentSchema)
    .action(async ({ parsedInput }) => {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session?.user) {
            throw new Error("Unauthorized");
        }
        if (!session?.user.enterprise?.id) {
            throw new Error("Enterprise not found");
        }
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

        // Busca o preço do serviço selecionado
        const service = await db.query.servicesTable.findFirst({
            where: eq(servicesTable.id, parsedInput.serviceId),
        });

        if (!service) {
            throw new Error("Service not found");
        }

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
            enterpriseId: session.user.enterprise.id,
            id: parsedInput.id,
            appointmentPriceInCents: service.servicePriceInCents, // Define o preço do agendamento igual ao preço do serviço
        });

        revalidatePath("/appointments");
        revalidatePath("/dashboard");
    });