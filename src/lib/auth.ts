import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession } from "better-auth/plugins";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import * as schema from '@/db/schema';


export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        usePlural: true,
        schema,
    }),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    plugins: [
        customSession(async ({ user, session }) => {
            const enterprises = await db.query.usersToEnterprisesTable.findMany({
                where: eq(schema.usersToEnterprisesTable.userId, user.id),
                with: {
                    enterprise: true,
                },
            });
            //Ao adaptar para múltiplas empresas, o usuário pode ter mais de uma empresa associada. Deve-se atualizar a lógica para lidar com isso.
            const enterprise = enterprises?.[0];
            return {
                user: {
                    ...user,
                    enterprise: enterprise?.enterpriseId ? {
                        id: enterprise?.enterpriseId,
                        name: enterprise?.enterprise?.name,
                    } : undefined,
                },
                session,
            }
        })
    ],
    user: {
        modelName: "usersTable"
    },
    session: {
        modelName: "sessionsTable"
    },
    account: {
        modelName: "accountsTable"
    },
    verification: {
        modelName: "verificationsTable"
    },
    emailAndPassword: {
        enabled: true,
    },
});