"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { usersSubscriptionTable, usersTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { updateUserDataSchema } from "./schema";


export const updateUserData = actionClient
    .schema(updateUserDataSchema)
    .action(async ({ parsedInput }) => {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        const { docNumber, phone } = parsedInput;

        // Buscar status de assinatura na tabela usersSubscriptionTable
        const subscription = await db.query.usersSubscriptionTable.findFirst({
            where: eq(usersSubscriptionTable.docNumber, docNumber),
        });

        // Verificar se o CPF existe na tabela de assinaturas
        if (!subscription) {
            throw new Error("CPF não encontrado.");
        }

        // Atualizar usuário
        await db.update(usersTable)
            .set({
                docNumber,
                phone,
                subscriptionStatus: subscription?.subscriptionStatus ?? null,
                updatedAt: new Date(),
            })
            .where(eq(usersTable.id, session.user.id));

        revalidatePath("/dashboard");
    }); 