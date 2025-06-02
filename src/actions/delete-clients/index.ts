"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/db";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { clientsTable } from "@/db/schema";

export const deleteClient = actionClient
    .schema(
        z.object({
            id: z.string().uuid(),
        }),
    )
    .action(async ({ parsedInput }) => {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session?.user) {
            throw new Error("Unauthorized");
        }
        const client = await db.query.clientsTable.findFirst({
            where: eq(clientsTable.id, parsedInput.id),
        });
        if (!client) {
            throw new Error("Cliente não encontrado");
        }
        if (client.enterpriseId !== session.user.enterprise?.id) {
            throw new Error("Cliente não encontrado");
        }
        await db.delete(clientsTable).where(eq(clientsTable.id, parsedInput.id));
        revalidatePath("/clients");
    });