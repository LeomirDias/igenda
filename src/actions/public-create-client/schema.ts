import z from "zod";

export const publicCreateClientSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().trim().min(1, { message: "Nome do cliente é obrigatório." }),
    email: z.string().email({ message: "Email inválido." }),
    phoneNumber: z.string().min(1, { message: "Número de telefone é obrigatório." }),
})

export type publicCreateClientSchema = z.infer<typeof publicCreateClientSchema>;