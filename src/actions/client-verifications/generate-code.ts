"use server";

import { actionClient } from "@/lib/next-safe-action";
import {
  generateCodeSchema,
  verificationCodes,
  VerificationResponse,
} from "./types";
import { db } from "@/db";
import { clientsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

// Generate random 6-digit code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateCode = actionClient
  .schema(generateCodeSchema)
  .action(async ({ parsedInput }): Promise<VerificationResponse> => {
    try {
      // Check if phone number already exists in database
      const existingClient = await db
        .select()
        .from(clientsTable)
        .where(eq(clientsTable.phoneNumber, parsedInput.phoneNumber))
        .limit(1);

      if (existingClient.length > 0) {
        return {
          success: false,
          message: "Este número de telefone já está cadastrado",
        };
      }

      // Generate verification code
      const verificationCode = generateVerificationCode();

      // Store the code and client data
      verificationCodes.set(parsedInput.phoneNumber, {
        code: verificationCode,
        clientData: parsedInput.clientData,
      });

      // Delete verification code after 5 minutes
      setTimeout(
        () => {
          verificationCodes.delete(parsedInput.phoneNumber);
        },
        1000 * 60 * 5,
      );

      // In production, send via WhatsApp. For now, log to console
      console.log(
        `Verification code for ${parsedInput.phoneNumber}: ${verificationCode}`,
      );

      return { success: true, message: "Verification code sent" };
    } catch (error) {
      console.error("Error generating verification code:", error);
      return { success: false, message: "Failed to send verification code" };
    }
  });
