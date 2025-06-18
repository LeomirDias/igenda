import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession } from "better-auth/plugins";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import * as schema from '@/db/schema';
import { usersTable } from "@/db/schema";


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
            const [userData, enterprises] = await Promise.all([
                db.query.usersTable.findFirst({
                    where: eq(usersTable.id, user.id),
                }),
                db.query.usersToEnterprisesTable.findMany({
                    where: eq(schema.usersToEnterprisesTable.userId, user.id),
                    with: {
                        enterprise: true,
                        user: true,
                    },
                })
            ]);
            //Ao adaptar para múltiplas empresas, o usuário pode ter mais de uma empresa associada. Deve-se atualizar a lógica para lidar com isso.
            const enterprise = enterprises?.[0];
            return {
                user: {
                    ...user,
                    plan: userData?.plan,
                    enterprise: enterprise?.enterpriseId ? {
                        id: enterprise?.enterpriseId,
                        name: enterprise?.enterprise?.name,
                        avatarImageURL: enterprise?.enterprise?.avatarImageURL,
                    } : undefined,
                },
                session,
            }
        })
    ],
    user: {
        modelName: "usersTable",
        additionalFields: {
            stripeCustomerId: {
                type: "string",
                fieldName: "stripeCustomerId",
                required: false,
            },
            stripeSubscriptionId: {
                type: "string",
                fieldName: "stripeSubscriptionId",
                required: false,
            },
            plan: {
                type: "string",
                fieldName: "plan",
                required: false,
            },
        },
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