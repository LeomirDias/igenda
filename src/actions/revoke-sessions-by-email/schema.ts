import { z } from "zod";

export const revokeSessionsByEmailSchema = z.object({
    email: z.string().email("Email inválido"),
});

export type RevokeSessionsByEmailInput = z.infer<typeof revokeSessionsByEmailSchema>;
