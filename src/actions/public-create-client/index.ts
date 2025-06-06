"use server";

import { z } from "zod";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/db";
import { clientsTable, enterprisesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { publicCreateClientSchema } from "./schema";

// Store verification codes temporarily (in production, use Redis or similar)
const verificationCodes = new Map<string, { code: string, clientData: any }>();

// Generate random 6-digit code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const verificationResponseSchema = z.object({
    success: z.boolean(),
    message: z.string().optional(),
});

const verifyResponseSchema = z.object({
    success: z.boolean(),
    message: z.string().optional(),
    client: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        phoneNumber: z.string(),
        createdAT: z.date(),
        updatedAt: z.date().nullable(),
        enterpriseId: z.string(),
    }).optional(),
});

// Action to initiate verification
export const initiateVerification = actionClient
    .schema(publicCreateClientSchema)
    .action(async ({ parsedInput }): Promise<z.infer<typeof verificationResponseSchema>> => {
        try {
            // Generate verification code
            const verificationCode = generateVerificationCode();

            // Store the code and client data
            verificationCodes.set(parsedInput.email, {
                code: verificationCode,
                clientData: parsedInput
            });

            // In production, send via WhatsApp. For now, log to console
            console.log(`Verification code for ${parsedInput.email}: ${verificationCode}`);

            return { success: true, message: "Verification code sent" };
        } catch (error) {
            return { success: false, message: "Failed to send verification code" };
        }
    });

// Action to verify code and create client
export const verifyAndCreateClient = actionClient
    .schema(z.object({
        email: z.string().email(),
        code: z.string().length(6),
        enterpriseSlug: z.string()
    }))
    .action(async ({ parsedInput }): Promise<z.infer<typeof verifyResponseSchema>> => {
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
            console.error("Error creating client:", error);
            return { success: false, message: "Failed to create client" };
        }
    });
