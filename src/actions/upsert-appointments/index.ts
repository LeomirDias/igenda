"use server";

import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import {
    appointmentsTable,
    clientsTable,
    enterprisesTable,
    professionalsTable,
    servicesTable,
} from "@/db/schema";
import { formatCurrencyInCents } from "@/helpers/currency";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { sendWhatsappMessage } from "@/lib/zapi-service";

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

        // Calcular início e fim do agendamento
        const appointmentStart = dayjs(parsedInput.date)
            .set("hour", parseInt(parsedInput.time.split(":")[0]))
            .set("minute", parseInt(parsedInput.time.split(":")[1]))
            .set("second", 0)
            .millisecond(0);
        const appointmentEnd = appointmentStart.add(service.durationInMinutes, "minute");

        // Buscar empresa ANTES de salvar para definir status e mensagens
        const [enterprise] = await db
            .select()
            .from(enterprisesTable)
            .where(eq(enterprisesTable.id, session.user.enterprise.id));
        if (!enterprise) {
            revalidatePath("/appointments");
            revalidatePath("/dashboard");
            return;
        }

        // Gerar identificador de 4 dígitos
        const identifier = Math.floor(1000 + Math.random() * 9000).toString();

        // Definir status inicial conforme configuração da empresa
        const initialStatus: "scheduled" | "not-confirmed" =
            enterprise.confirmation === "automatic" ? "scheduled" : "not-confirmed";

        await db.insert(appointmentsTable).values({
            clientId: parsedInput.clientId,
            serviceId: parsedInput.serviceId,
            professionalId: parsedInput.professionalId,
            time: parsedInput.time,
            date: appointmentStart.toDate(),
            startTime: appointmentStart.format("HH:mm:ss"),
            endTime: appointmentEnd.format("HH:mm:ss"),
            enterpriseId: session.user.enterprise.id,
            id: parsedInput.id,
            appointmentPriceInCents: service.servicePriceInCents,
            status: initialStatus,
            identifier,
        });

        // Buscar dados relacionados para envio de mensagens
        const [client] = await db
            .select()
            .from(clientsTable)
            .where(eq(clientsTable.id, parsedInput.clientId));
        if (!client) {
            revalidatePath("/appointments");
            revalidatePath("/dashboard");
            return;
        }

        const [professional] = await db
            .select()
            .from(professionalsTable)
            .where(eq(professionalsTable.id, parsedInput.professionalId));
        if (!professional) {
            revalidatePath("/appointments");
            revalidatePath("/dashboard");
            return;
        }

        const formattedDate = appointmentStart.format("DD/MM/YYYY");
        const formattedPrice = formatCurrencyInCents(service.servicePriceInCents);

        if (enterprise.confirmation === "automatic") {
            const address = `${enterprise.address}, ${enterprise.number}`;
            const fullAddress = enterprise.complement
                ? `${address} - ${enterprise.complement}, ${enterprise.city}/${enterprise.state} - CEP: ${enterprise.cep}`
                : `${address}, ${enterprise.city}/${enterprise.state} - CEP: ${enterprise.cep}`;

            // Mensagem para o cliente
            const clientMsg = `Olá, ${client.name}! 👋\n\nSeu agendamento em ${enterprise.name} foi confirmado!. ✅\n\nDados do agendamento:\n• Código do agendamento: #${identifier}\n• Empresa: ${enterprise.name}\n• Serviço: ${service.name}\n• Profissional: ${professional.name}\n• Data: ${formattedDate}\n• Horário: ${parsedInput.time}\n• Valor: ${formattedPrice}\n• Endereço: ${fullAddress}\n\nCaso precise remarcar ou cancelar entre em contato com ${enterprise.name} pelo número ${enterprise.phoneNumber} \n\nAgradecemos a preferência! 💚`;
            await sendWhatsappMessage(client.phoneNumber, clientMsg);

            // Mensagem para a empresa
            const enterpriseMsg = `Olá, ${enterprise.name}! 👋\n\nUm novo agendamento foi confirmado automaticamente. ✅\n\nDados do agendamento:\n• Código do agendamento: #${identifier}\n• Cliente: ${client.name}\n• Telefone do cliente: ${client.phoneNumber}\n• Serviço: ${service.name}\n• Profissional: ${professional.name}\n• Data: ${formattedDate}\n• Horário: ${parsedInput.time}\n• Valor: ${formattedPrice}`;
            await sendWhatsappMessage(enterprise.phoneNumber, enterpriseMsg);
        } else {
            // Confirmação manual: envia mensagem para a empresa com instruções
            const manualMsg = `Olá, ${enterprise.name}!\nCódigo do agendamento: #${identifier} 👋\n\nHá um novo agendamento aguardando confirmação. 📅\n\nDados do agendamento:\n• Cliente: ${client.name}\n• Telefone do cliente: ${client.phoneNumber}\n• Serviço: ${service.name}\n• Profissional: ${professional.name}\n• Data: ${formattedDate}\n• Horário: ${parsedInput.time}\n• Valor: ${formattedPrice}\n\nPara confirmar, responda com: CONFIRMAR ${identifier}.\nPara cancelar, responda com: CANCELAR ${identifier}.`;
            await sendWhatsappMessage(enterprise.phoneNumber, manualMsg);
        }

        revalidatePath("/appointments");
        revalidatePath("/dashboard");
    });

export const updateAppointment = actionClient
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
        if (!parsedInput.id) {
            throw new Error("Appointment ID is required for update");
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
        const appointmentStart = dayjs(parsedInput.date)
            .set("hour", parseInt(parsedInput.time.split(":")[0]))
            .set("minute", parseInt(parsedInput.time.split(":")[1]))
            .set("second", 0)
            .millisecond(0);
        const appointmentEnd = appointmentStart.add(service.durationInMinutes, "minute");
        await db
            .update(appointmentsTable)
            .set({
                clientId: parsedInput.clientId,
                serviceId: parsedInput.serviceId,
                professionalId: parsedInput.professionalId,
                time: parsedInput.time,
                date: appointmentStart.toDate(),
                startTime: appointmentStart.format("HH:mm:ss"),
                endTime: appointmentEnd.format("HH:mm:ss"),
                appointmentPriceInCents: service.servicePriceInCents,
            })
            .where(eq(appointmentsTable.id, parsedInput.id));

        // Buscar dados relacionados para enviar mensagem ao cliente
        const [client] = await db
            .select()
            .from(clientsTable)
            .where(eq(clientsTable.id, parsedInput.clientId));
        if (!client) {
            revalidatePath("/appointments");
            revalidatePath("/dashboard");
            return;
        }

        const [professional] = await db
            .select()
            .from(professionalsTable)
            .where(eq(professionalsTable.id, parsedInput.professionalId));
        if (!professional) {
            revalidatePath("/appointments");
            revalidatePath("/dashboard");
            return;
        }

        const [enterprise] = await db
            .select()
            .from(enterprisesTable)
            .where(eq(enterprisesTable.id, session.user.enterprise.id));
        if (!enterprise) {
            revalidatePath("/appointments");
            revalidatePath("/dashboard");
            return;
        }

        const formattedDate = appointmentStart.format("DD/MM/YYYY");
        const formattedPrice = formatCurrencyInCents(service.servicePriceInCents);

        const address = `${enterprise.address}, ${enterprise.number}`;
        const fullAddress = enterprise.complement
            ? `${address} - ${enterprise.complement}, ${enterprise.city}/${enterprise.state} - CEP: ${enterprise.cep}`
            : `${address}, ${enterprise.city}/${enterprise.state} - CEP: ${enterprise.cep}`;

        const updateMessage = `Olá, ${client.name}!👋\n\nEsta é uma mensagem automática da iGenda de ${enterprise.name}\n\n✏️ Seu agendamento foi atualizado na ${enterprise.name}.\n\nNovos dados do agendamento:\n• Serviço: ${service.name}\n• Profissional: ${professional.name}\n• Data: ${formattedDate}\n• Horário: ${parsedInput.time}\n• Valor: ${formattedPrice}\n• Endereço: ${fullAddress}\n\n📞 Caso precise ajustar novamente ou tirar dúvidas, entre em contato com ${enterprise.name} pelo número ${enterprise.phoneNumber}.\n\nAgradecemos a compreensão!💚`;

        await sendWhatsappMessage(client.phoneNumber, updateMessage);
        revalidatePath("/appointments");
        revalidatePath("/dashboard");
    });