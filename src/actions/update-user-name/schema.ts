import { z } from "zod";

export const schema = z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
});

export type Schema = z.infer<typeof schema>; 