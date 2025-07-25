"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { UpdateAppoitmentSchema } from "./schema";

export const cancelAppointment = actionClient
  .schema(UpdateAppoitmentSchema)
  .action(async ({ parsedInput }) => {
    await db
      .update(appointmentsTable)
      .set({
        status: "canceled",
      })
      .where(eq(appointmentsTable.id, parsedInput.id));
    revalidatePath("/appointments");
    revalidatePath("/dashboard");
  });
