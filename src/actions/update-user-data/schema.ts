import z from "zod";

export const updateUserDataSchema = z.object({
    docNumber: z.string(),
    phone: z.string(),
});

export type UpdateProfessionalSchema = z.infer<typeof updateUserDataSchema>;