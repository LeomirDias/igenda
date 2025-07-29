"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { schema } from "./schema";
import { revalidatePath } from "next/cache";

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
    revalidatePath("/settings");
  });
