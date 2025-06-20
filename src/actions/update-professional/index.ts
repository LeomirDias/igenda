"use server";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { professionalsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { updateProfessionalSchema } from "./schema";

dayjs.extend(utc);

export const updateProfessional = actionClient
    .schema(updateProfessionalSchema)
    .action(async ({ parsedInput }) => {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        const {
            id,
            name,
            specialty,
            phoneNumber,
            instagramURL,
            availableFromWeekDay,
            availableToWeekDay,
            availableFromTime,
            availableToTime,
        } = parsedInput;

        const availableFromTimeUTC = dayjs()
            .set("hour", parseInt(availableFromTime.split(":")[0]))
            .set("minute", parseInt(availableFromTime.split(":")[1]))
            .set("second", parseInt(availableFromTime.split(":")[2]))
            .utc();

        const availableToTimeUTC = dayjs()
            .set("hour", parseInt(availableToTime.split(":")[0]))
            .set("minute", parseInt(availableToTime.split(":")[1]))
            .set("second", parseInt(availableToTime.split(":")[2]))
            .utc();

        const professionalId = id;

        if (professionalId) {
            await db
                .update(professionalsTable)
                .set({
                    name,
                    specialty,
                    phoneNumber,
                    instagramURL,
                    availableFromWeekDay,
                    availableToWeekDay,
                    availableFromTime: availableFromTimeUTC.format("HH:mm:ss"),
                    availableToTime: availableToTimeUTC.format("HH:mm:ss"),
                    updatedAt: new Date(),
                })
                .where(eq(professionalsTable.id, professionalId));
        }

        revalidatePath("/professionals");
    }); 