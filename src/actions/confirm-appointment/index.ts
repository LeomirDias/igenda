"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { UpdateAppoitmentSchema } from "./schema";

export const confirmAppointment = actionClient
  .schema(UpdateAppoitmentSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Usuário não autenticado");
    }

    await db
      .update(appointmentsTable)
      .set({
        status: "scheduled",
      })
      .where(eq(appointmentsTable.id, parsedInput.id));
    revalidatePath("/appointments");
    revalidatePath("/dashboard");
  });
