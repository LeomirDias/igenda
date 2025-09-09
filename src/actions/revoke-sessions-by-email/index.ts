"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { sessionsTable, usersTable } from "@/db/schema";
import { actionClient } from "@/lib/next-safe-action";

import { revokeSessionsByEmailSchema } from "./schema";

export const revokeSessionsByEmail = actionClient
    .schema(revokeSessionsByEmailSchema)
    .action(async ({ parsedInput }) => {
        const { email } = parsedInput;

        try {
            // Buscar o usuário pelo email
            const user = await db.query.usersTable.findFirst({
                where: eq(usersTable.email, email),
            });

            if (!user) {
                throw new Error("Usuário não encontrado");
            }

            // Deletar todas as sessões do usuário
            await db
                .delete(sessionsTable)
                .where(eq(sessionsTable.userId, user.id));

            return {
                success: true,
                message: "Todas as sessões do usuário foram revogadas com sucesso",
                userId: user.id,
            };
        } catch (error) {
            console.error("Erro ao revogar sessões:", error);
            throw error;
        }
    });
