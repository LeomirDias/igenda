"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { enterprisesTable } from "@/db/schema";
import { actionClient } from "@/lib/next-safe-action";

const schema = z.object({
    slug: z.string(),
});

export const getEnterpriseBySlug = actionClient
    .schema(schema)
    .action(async ({ parsedInput }) => {
        const enterprise = await db.query.enterprisesTable.findFirst({
            where: eq(enterprisesTable.slug, parsedInput.slug),
        });

        if (!enterprise) {
            throw new Error("Empresa não encontrada");
        }

        return enterprise;
    }); 