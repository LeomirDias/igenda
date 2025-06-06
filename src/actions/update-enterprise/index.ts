"use server";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { enterprisesTable, usersToEnterprisesTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { updateEnterpriseSchema } from "./schema";

dayjs.extend(utc);

// Função para gerar slug corrigida e mais robusta
const generateSlug = (name: string) => {
    if (!name) return "";
    let slug = name.toLowerCase();
    // Substitui caracteres acentuados e especiais por seus equivalentes sem acento
    slug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // Substitui espaços e múltiplos hífens por um único hífen
    slug = slug.replace(/\s+/g, "-");
    // Remove todos os caracteres que não sejam letras, números ou hífens
    slug = slug.replace(/[^a-z0-9-]/g, "");
    // Substitui múltiplos hífens consecutivos por um único hífen
    slug = slug.replace(/-+/g, "-");
    // Remove hífens no início ou no fim
    slug = slug.replace(/^-+|-+$/g, "");
    return slug;
};

export const updateEnterprise = actionClient
    .schema(updateEnterpriseSchema)
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
            register,
            instagramURL,
            cep,
            address,
            number,
            complement,
            city,
            state
        } = parsedInput;

        let enterpriseId = id;

        if (enterpriseId) {
            // Atualização - não modifica o slug
            await db
                .update(enterprisesTable)
                .set({
                    name,
                    specialty,
                    phoneNumber,
                    register,
                    instagramURL,
                    cep,
                    address,
                    number,
                    complement,
                    city,
                    state,
                    updatedAt: new Date(),
                })
                .where(eq(enterprisesTable.id, enterpriseId));
        }
        revalidatePath("/settings");
    }); 