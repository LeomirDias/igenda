"use server";

import crypto from "crypto";
import { and, eq, gt } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { accountsTable, usersTable, verificationsTable } from "@/db/schema";
import { actionClient } from "@/lib/next-safe-action";

const schema = z.object({
    token: z.string().min(1, "Token é obrigatório"),
    password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
});

export const verifyTokenAndSetPassword = actionClient
    .schema(schema)
    .action(async ({ parsedInput }) => {
        try {
            const { token, password } = parsedInput;

            // Buscar verificação pelo token
            const verification = await db
                .select()
                .from(verificationsTable)
                .where(
                    and(
                        eq(verificationsTable.value, token),
                        gt(verificationsTable.expiresAt, new Date())
                    )
                )
                .limit(1);

            if (!verification.length) {
                return { error: "Token inválido ou expirado" };
            }

            const verificationData = verification[0];

            // Buscar usuário pelo email (identifier)
            const user = await db
                .select()
                .from(usersTable)
                .where(eq(usersTable.email, verificationData.identifier))
                .limit(1);

            if (!user.length) {
                return { error: "Usuário não encontrado" };
            }

            const userData = user[0];

            // Criar conta na tabela do BetterAuth
            await db.insert(accountsTable).values({
                id: crypto.randomUUID(),
                accountId: crypto.randomUUID(),
                providerId: "credentials",
                userId: userData.id,
                password: password, // BetterAuth fará o hash automaticamente
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // Deletar verificação usada
            await db
                .delete(verificationsTable)
                .where(eq(verificationsTable.id, verificationData.id));

            await db
                .update(usersTable)
                .set({
                    phoneVerified: true,
                    emailVerified: true,
                })
                .where(eq(usersTable.id, accountsTable.userId));

            return {
                success: true,
                user: {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    role: userData.role,
                }
            };
        } catch (error) {
            console.error("Erro ao verificar token e definir senha:", error);
            return { error: "Erro interno do servidor" };
        }
    }); 