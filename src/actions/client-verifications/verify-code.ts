"use server";

import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/db";
import { clientsTable, enterprisesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verificationCodes, verifyCodeSchema, VerifyResponse } from "./types";

export const verifyCode = actionClient
    .schema(verifyCodeSchema)
    .action(async ({ parsedInput }): Promise<VerifyResponse> => {
        try {
            const storedData = verificationCodes.get(parsedInput.email);

            if (!storedData) {
                return { success: false, message: "No verification code found" };
            }

            if (storedData.code !== parsedInput.code) {
                return { success: false, message: "Invalid verification code" };
            }

            // Get enterprise by slug
            const enterprise = await db.query.enterprisesTable.findFirst({
                where: eq(enterprisesTable.slug, parsedInput.enterpriseSlug)
            });

            if (!enterprise) {
                return { success: false, message: "Enterprise not found" };
            }

            // Create client in database
            const [client] = await db.insert(clientsTable).values({
                ...storedData.clientData,
                enterpriseId: enterprise.id,
                createdAT: new Date(),
                updatedAt: new Date(),
            }).returning({
                id: clientsTable.id,
                name: clientsTable.name,
                email: clientsTable.email,
                phoneNumber: clientsTable.phoneNumber,
                createdAT: clientsTable.createdAT,
                updatedAt: clientsTable.updatedAt,
                enterpriseId: clientsTable.enterpriseId,
            });

            // Clean up verification code
            verificationCodes.delete(parsedInput.email);

            return { success: true, client };
        } catch (error) {
            console.error("Error verifying code:", error);
            return { success: false, message: "Failed to verify code" };
        }
    }); 