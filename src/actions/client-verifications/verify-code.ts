"use server";

import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/db";
import { clientsTable, enterprisesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verificationCodes, verifyCodeSchema, VerifyResponse } from "./types";
import { upsertClientSession } from "../upsert-client-session";
import { cookies } from "next/headers";
import { upsertClient } from "../upsert-client";

export const verifyCode = actionClient
    .schema(verifyCodeSchema)
    .action(async ({ parsedInput }): Promise<VerifyResponse> => {
        try {
            const storedData = verificationCodes.get(parsedInput.phoneNumber);

            if (!storedData) {
                return { success: false, message: "Nenhum código de verificação encontrado" };
            }

            if (storedData.code !== parsedInput.code) {
                return { success: false, message: "Código de verificação inválido" };
            }

            // Get enterprise by slug
            const enterprise = await db.query.enterprisesTable.findFirst({
                where: eq(enterprisesTable.slug, parsedInput.enterpriseSlug)
            });

            if (!enterprise) {
                return { success: false, message: "Empresa não encontrada" };
            }

            // Verifica se já existe um cliente com este número de telefone
            const existingClient = await db.query.clientsTable.findFirst({
                where: eq(clientsTable.phoneNumber, parsedInput.phoneNumber),
            });

            // Cria ou atualiza o cliente
            await upsertClient({
                id: existingClient?.id,
                ...storedData.clientData,
            });

            // Busca o cliente atualizado ou criado
            const client = await db.query.clientsTable.findFirst({
                where: eq(clientsTable.phoneNumber, parsedInput.phoneNumber),
            });

            if (!client) {
                return { success: false, message: "Erro ao criar/atualizar cliente" };
            }

            // Cria ou atualiza a sessão do cliente
            const sessionResult = await upsertClientSession({
                clientId: client.id,
                enterpriseId: enterprise.id,
            });

            if (!sessionResult?.data?.success) {
                return { success: false, message: "Falha ao criar sessão do cliente" };
            }

            // Set session token in cookie
            const cookieStore = await cookies();
            cookieStore.set("client_token", sessionResult.data.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                expires: sessionResult.data.expiresAt,
            });

            // Clean up verification code
            verificationCodes.delete(parsedInput.phoneNumber);

            return { success: true, client };
        } catch (error) {
            console.error("Error verifying code:", error);
            return { success: false, message: "Falha ao verificar código" };
        }
    }); 