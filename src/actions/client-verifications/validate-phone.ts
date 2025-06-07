"use server";

import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/db";
import { clientsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const validatePhoneSchema = z.object({
    phoneNumber: z.string().min(1, { message: "Telefone é obrigatório" }),
    enterpriseSlug: z.string(),
});

export type ValidatePhoneResponse = {
    success: boolean;
    message?: string;
    client?: typeof clientsTable.$inferSelect;
};

export const validatePhone = actionClient
    .schema(validatePhoneSchema)
    .action(async ({ parsedInput }): Promise<ValidatePhoneResponse> => {
        try {
            const client = await db.query.clientsTable.findFirst({
                where: (table) => eq(table.phoneNumber, parsedInput.phoneNumber),
                with: {
                    enterprise: true,
                },
            });

            if (!client) {
                return {
                    success: false,
                    message: "Cliente não encontrado com este número de telefone",
                };
            }

            if (client.enterprise.slug !== parsedInput.enterpriseSlug) {
                return {
                    success: false,
                    message: "Cliente não pertence a esta empresa",
                };
            }

            return {
                success: true,
                client,
            };
        } catch (error) {
            console.error("Error validating phone:", error);
            return {
                success: false,
                message: "Erro ao validar telefone",
            };
        }
    }); 