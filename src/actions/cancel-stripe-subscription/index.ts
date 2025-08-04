"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Stripe from "stripe";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-07-30.basil",
});

export const cancelSubscription = actionClient.action(async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const user = session?.user;

    if (!user?.id) {
        throw new Error("Usuário não encontrado");
    }

    // Buscar dados completos do usuário no banco
    const userData = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, user.id))
        .limit(1);

    const userRecord = userData[0];
    if (!userRecord?.stripeSubscriptionId) {
        throw new Error("Assinatura não encontrada");
    }

    // Recuperar a assinatura
    const subscription = await stripe.subscriptions.retrieve(userRecord.stripeSubscriptionId);

    // Verifica se está no prazo de reembolso
    const createdAt = subscription.created * 1000;
    const now = Date.now();
    const daysSince = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));

    // Cancela a assinatura imediatamente
    await stripe.subscriptions.cancel(userRecord.stripeSubscriptionId);

    // Reembolsa se for dentro de 7 dias
    if (daysSince <= 7) {
        try {
            const invoice = await stripe.invoices.retrieve(subscription.latest_invoice as string);
            const paymentIntent = (invoice as unknown as Record<string, unknown>).payment_intent as string;
            if (paymentIntent) {
                await stripe.refunds.create({
                    payment_intent: paymentIntent,
                });
            }
        } catch (error) {
            console.error("Erro ao processar reembolso:", error);
        }
    }

    return { success: true };
});
