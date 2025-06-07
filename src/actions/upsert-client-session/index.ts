"use server";

import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/db";
import { clientSessionsTable } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";
import { addMinutes } from "date-fns";
import { upsertSessionSchema, SessionResponse } from "./types";
import { eq } from "drizzle-orm";

export const upsertClientSession = actionClient
    .schema(upsertSessionSchema)
    .action(async ({ parsedInput }): Promise<SessionResponse> => {
        try {
            const now = new Date();
            const expiresAt = addMinutes(now, 30); // Expira em 30 minutos

            // Verifica se já existe uma sessão para este cliente
            const existingSession = await db.query.clientSessionsTable.findFirst({
                where: eq(clientSessionsTable.clientId, parsedInput.clientId),
            });

            if (existingSession) {
                // Atualiza a sessão existente
                const token = uuidv4();
                await db
                    .update(clientSessionsTable)
                    .set({
                        token,
                        expiresAt,
                        updatedAt: now,
                    })
                    .where(eq(clientSessionsTable.clientId, parsedInput.clientId));

                return { success: true, token, expiresAt };
            } else {
                // Cria uma nova sessão
                const token = uuidv4();
                await db.insert(clientSessionsTable).values({
                    token,
                    clientId: parsedInput.clientId,
                    enterpriseId: parsedInput.enterpriseId,
                    expiresAt,
                    createdAt: now,
                    updatedAt: now,
                });

                return { success: true, token, expiresAt };
            }
        } catch (error) {
            console.error("Error creating client session:", error);
            return { success: false, message: "Falha ao criar sessão do cliente" };
        }
    }); 