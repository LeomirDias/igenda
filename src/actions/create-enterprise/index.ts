"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { enterprisesTable, usersToEnterprisesTable } from "@/db/schema";
import { auth } from "@/lib/auth";

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

export const createEnterprise = async (
    name: string,
    specialty: string,
    phoneNumber: string,
    register: string,
    instagramURL: string,
    cep: string,
    address: string,
    number: string,
    complement: string | undefined,
    city: string,
    state: string,
) => {

    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const slug = generateSlug(name);

    const [enterprise] = await db.insert(enterprisesTable).values({
        name,
        specialty,
        phoneNumber,
        register,
        instagramURL,
        slug,
        cep,
        address,
        number,
        complement,
        city,
        state,
    }).returning();

    await db.insert(usersToEnterprisesTable).values({
        userId: session.user.id,
        enterpriseId: enterprise.id,
    });
    redirect("/dashboard");
};