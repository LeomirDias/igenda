"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { enterprisesTable, usersToEnterprisesTable } from "@/db/schema";
import { auth } from "@/lib/auth";


export const createEnterprise = async (name: string, specialty: string, phoneNumber: string, register: string, instagramURL: string) => {

    // Ensure the user is authenticated
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const [enterprise] = await db.insert(enterprisesTable).values({ name, specialty, phoneNumber, register, instagramURL }).returning();

    await db.insert(usersToEnterprisesTable).values({
        userId: session.user.id,
        enterpriseId: enterprise.id,
    });
    redirect("/dashboard");
};