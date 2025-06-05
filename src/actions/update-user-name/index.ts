"use server";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { actionClient } from "@/lib/next-safe-action";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { schema } from "./schema";

export const updateUserName = actionClient
    .schema(schema)
    .action(async ({ parsedInput }) => {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            throw new Error("Usuário não autenticado");
        }

        await db
            .update(usersTable)
            .set({ name: parsedInput.name })
            .where(eq(usersTable.id, session.user.id));

        return {
            message: "Nome atualizado com sucesso",
        };
    }); 