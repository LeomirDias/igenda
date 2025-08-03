import dayjs from "dayjs";
import { and, eq, gte, lt } from "drizzle-orm";

import { db } from "@/db";
import { appointmentsTable, clientsTable, enterprisesTable, servicesTable } from "@/db/schema";
import { sendWhatsappMessage } from "@/lib/zapi-service";

export async function GET() {
    const today = dayjs().startOf("day").toDate();
    const tomorrow = dayjs().add(1, "day").startOf("day").toDate();

    // Busca agendamentos para hoje com status confirmado
    const appointments = await db
        .select({
            appointmentId: appointmentsTable.id,
            time: appointmentsTable.time,
            date: appointmentsTable.date,
            client: clientsTable,
            service: servicesTable,
            enterprise: enterprisesTable,
        })
        .from(appointmentsTable)
        .innerJoin(clientsTable, eq(clientsTable.id, appointmentsTable.clientId))
        .innerJoin(servicesTable, eq(servicesTable.id, appointmentsTable.serviceId))
        .innerJoin(enterprisesTable, eq(enterprisesTable.id, servicesTable.enterpriseId))
        .where(
            and(
                gte(appointmentsTable.date, today),
                lt(appointmentsTable.date, tomorrow),
                eq(appointmentsTable.status, "scheduled") // ajuste conforme sua lógica
            )
        );

    // Envia mensagem para cada cliente
    for (const appointment of appointments) {
        const { client, time, service, enterprise } = appointment;

        if (!client.phoneNumber) continue;

        const formattedDate = dayjs(appointment.date).format("DD/MM/YYYY");
        const message = `📅 *Lembrete de Agendamento - ${enterprise.name}*\n\n` +
            `Olá ${client.name}! 👋\n\n` +
            `Você tem um agendamento para *${service.name}* hoje, ${formattedDate} às *${time}*.\n\n` +
            `Se precisar reagendar ou cancelar, entre em contato com ${enterprise.name} pelo número ${enterprise.phoneNumber} .\n\nAgradecemos pela preferência!\n\nAtenciosamente, equipe iGenda!💚`;

        await sendWhatsappMessage(client.phoneNumber, message);
    }

    return Response.json({ status: "Lembretes enviados com sucesso" });
}
