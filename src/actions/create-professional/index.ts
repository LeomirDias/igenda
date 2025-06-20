"use server";

import crypto from "crypto";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { headers } from "next/headers";

import { db } from "@/db";
import { professionalsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

dayjs.extend(utc);

export const createProfessional = async (
    name: string,
    specialty: string,
    phoneNumber: string,
    instagramURL: string,
    availableFromWeekDay: number,
    availableToWeekDay: number,
    availableFromTime: string,
    availableToTime: string,
) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user) {
        throw new Error("Unauthorized");
    }
    if (!session?.user.enterprise?.id) {
        throw new Error("Enterprise not found");
    }

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

    const [professional] = await db
        .insert(professionalsTable)
        .values({
            id: crypto.randomUUID(),
            name,
            specialty,
            phoneNumber,
            instagramURL,
            availableFromWeekDay,
            availableToWeekDay,
            availableFromTime: availableFromTimeUTC.format("HH:mm:ss"),
            availableToTime: availableToTimeUTC.format("HH:mm:ss"),
            enterpriseId: session.user.enterprise.id,
        }).returning();

    return { professionalId: professional.id, revalidatePath: "/professionals" };
};