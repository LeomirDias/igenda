"use server";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { professionalsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { upsertProfessionalSchema } from "./schema";

dayjs.extend(utc);

export const upsertProfessional = actionClient
    .schema(upsertProfessionalSchema)
    .action(async ({ parsedInput }) => {
        const availableFromTime = parsedInput.availableFromTime; // 15:30:00
        const availableToTime = parsedInput.availableToTime; // 16:00:00

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

        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session?.user) {
            throw new Error("Unauthorized");
        }
        if (!session?.user.enterprise?.id) {
            throw new Error("Enterprise not found");
        }
        await db
            .insert(professionalsTable)
            .values({
                ...parsedInput,
                id: parsedInput.id,
                avatarImageURL: parsedInput.avatarImageURL,
                enterpriseId: session?.user.enterprise?.id,
                availableFromTime: availableFromTimeUTC.format("HH:mm:ss"),
                availableToTime: availableToTimeUTC.format("HH:mm:ss"),
            })
            .onConflictDoUpdate({
                target: [professionalsTable.id],
                set: {
                    ...parsedInput,
                    avatarImageURL: parsedInput.avatarImageURL,
                    availableFromTime: availableFromTimeUTC.format("HH:mm:ss"),
                    availableToTime: availableToTimeUTC.format("HH:mm:ss"),
                },
            });
        revalidatePath("/professionals");
    });