import z from "zod";

export const upsertClientSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().trim().min(1, { message: "Nome do serviço é obrigatório." }),
    email: z.string().email({ message: "Email inválido." }),
    phoneNumber: z.string().min(1, { message: "Número de telefone é obrigatório." }),
})

export type upsertClientSchema = z.infer<typeof upsertClientSchema>;