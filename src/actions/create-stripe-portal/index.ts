"use server";

import { headers } from "next/headers";
import Stripe from "stripe";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

export const createStripePortal = actionClient.action(async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error("Stripe secret key not found");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2025-07-30.basil",
    });

    // Buscar o customer ID do usuário
    const customerId = session.user.stripeCustomerId;

    if (!customerId) {
        throw new Error("Customer ID not found");
    }

    // Criar sessão do portal do cliente
    const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription`,
    });

    return {
        url: portalSession.url,
    };
}); 