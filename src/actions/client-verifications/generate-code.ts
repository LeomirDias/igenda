"use server";

import { actionClient } from "@/lib/next-safe-action";
import { generateCodeSchema, verificationCodes, VerificationResponse } from "./types";

// Generate random 6-digit code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateCode = actionClient
    .schema(generateCodeSchema)
    .action(async ({ parsedInput }): Promise<VerificationResponse> => {
        try {
            // Generate verification code
            const verificationCode = generateVerificationCode();

            // Store the code and client data
            verificationCodes.set(parsedInput.phoneNumber, {
                code: verificationCode,
                clientData: parsedInput.clientData
            });

            // Delete verification code after 5 minutes
            setTimeout(() => {
                verificationCodes.delete(parsedInput.phoneNumber);
            }, 1000 * 60 * 5);

            // In production, send via WhatsApp. For now, log to console
            console.log(`Verification code for ${parsedInput.phoneNumber}: ${verificationCode}`);

            return { success: true, message: "Verification code sent" };
        } catch (error) {
            console.error("Error generating verification code:", error);
            return { success: false, message: "Failed to send verification code" };
        }
    }); 