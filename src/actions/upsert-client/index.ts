"use server";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { clientsTable, servicesTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { upsertClientSchema } from "./schema";

dayjs.extend(utc);

export const upsertClient = actionClient
    .schema(upsertClientSchema)
    .action(async ({ parsedInput }) => {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) throw new Error("Unauthorized");
        if (!session.user.enterprise?.id) throw new Error("Enterprise not found");

        const { id, name, email, phoneNumber } = parsedInput;

        // Se `id` estiver presente, atualiza o serviço existente
        let clientId = id;

        if (clientId) {
            await db
                .update(clientsTable)
                .set({
                    name,
                    email,
                    phoneNumber,
                    updatedAt: new Date(),
                })
                .where(eq(clientsTable.id, clientId));
        } else {
            const [client] = await db
                .insert(clientsTable)
                .values({
                    name,
                    email,
                    phoneNumber,
                    enterpriseId: session.user.enterprise.id,
                })
                .returning({ id: clientsTable.id });

            clientId = client.id;
        }

        revalidatePath("/clients");
    });
