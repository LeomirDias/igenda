"use server";

import bcrypt from "bcrypt";
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

            // Verificar se já existe uma conta para este usuário
            const existingAccount = await db
                .select()
                .from(accountsTable)
                .where(
                    and(
                        eq(accountsTable.userId, userData.id),
                        eq(accountsTable.providerId, "credentials")
                    )
                )
                .limit(1);

            if (existingAccount.length > 0) {
                return { error: "Usuário já possui uma conta criada" };
            }

            // Fazer hash da senha
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Criar conta na tabela do BetterAuth
            await db.insert(accountsTable).values({
                id: crypto.randomUUID(),
                providerId: "credentials",
                providerAccountId: userData.email,
                userId: userData.id,
                password: hashedPassword, // Senha hasheada
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // Atualizar o usuário para marcar o email como verificado
            await db
                .update(usersTable)
                .set({
                    emailVerified: true,
                    phoneVerified: true,
                    updatedAt: new Date(),
                })
                .where(eq(usersTable.id, userData.id));

            // Deletar verificação usada
            await db
                .delete(verificationsTable)
                .where(eq(verificationsTable.id, verificationData.id));


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