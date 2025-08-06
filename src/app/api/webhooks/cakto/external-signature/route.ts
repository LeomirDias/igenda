import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import NewSubscriptionEmail from "@/components/emails/new-subscriptions";
import RenewSubscriptionEmail from "@/components/emails/renewed subscriptions";
import { db } from "@/db";
import { usersSubscriptionTable } from "@/db/schema";
import { sendWhatsappMessage } from "@/lib/zapi-service";

const CAKTO_WEBHOOK_SECRET = process.env.CAKTO_WEBHOOK_SECRET_EXTERNAL_SIGNATURES!;
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(req: NextRequest) {
    const body = await req.json();

    const secret = body?.secret;
    if (!secret || secret !== CAKTO_WEBHOOK_SECRET) {
        return NextResponse.json({ error: "Segredo inválido" }, { status: 401 });
    }

    const event = body?.event;
    const data = body?.data;
    const customer = data?.customer;
    const product = data?.product;

    if (!customer?.docNumber) {
        return NextResponse.json({ error: "CPF do cliente ausente" }, { status: 400 });
    }

    if (!product?.id) {
        return NextResponse.json({ error: "Produto ausente" }, { status: 400 });
    }

    if (event === "subscription_created") {
        // Verifica se já existe um registro com o mesmo doc_number
        const existingSubscription = await db.query.usersSubscriptionTable.findFirst({
            where: eq(usersSubscriptionTable.docNumber, customer.docNumber),
        });

        const subscriptionData = {
            //Cliente
            docNumber: customer.docNumber,
            phone: customer.phone,
            //Plano
            planId: product.id,
            plan: product.name,
            //Assinatura
            subscriptionStatus: "active",
            subscriptionId: data.id,
            refId: data.refId,
            //Pagamento
            paymentMethod: data.paymentMethod,
            paidAt: data.paidAt ? new Date(data.paidAt) : null,
            //Cancelamento
            canceledAt: null,
            //Outros de Cliente
            updatedAt: new Date(),
        };

        if (existingSubscription) {
            // Atualiza o registro existente
            await db.update(usersSubscriptionTable)
                .set(subscriptionData)
                .where(eq(usersSubscriptionTable.docNumber, customer.docNumber));

            // Mensagem para usuários existentes
            await resend.emails.send({
                from: `${process.env.NAME_FOR_ACCOUNT_MANAGEMENT_SUBMISSIONE} <${process.env.EMAIL_FOR_ACCOUNT_MANAGEMENT_SUBMISSION}>`,
                to: customer.email,
                subject: "Acesse novamente sua iGenda!",
                react: RenewSubscriptionEmail({
                    customerName: customer.name || "",
                }),
            });

            // Mensagem WhatsApp para usuários existentes
            await sendWhatsappMessage(customer.phone,
                `Olá, ${customer.name || ""}! 👋

Que bom ter você de volta na iGenda! 🎉

Sua assinatura foi ativada com sucesso! 

Acesse sua conta: https://igendaapp.com.br/authentication

Obrigado por continuar conosco!💚 `
            );

        } else {
            // Insere um novo registro
            await db.insert(usersSubscriptionTable).values({
                ...subscriptionData,
                createdAt: new Date(),
            });

            // Mensagem para novos usuários
            await resend.emails.send({
                from: `${process.env.NAME_FOR_ACCOUNT_MANAGEMENT_SUBMISSIONE} <${process.env.EMAIL_FOR_ACCOUNT_MANAGEMENT_SUBMISSION}>`,
                to: customer.email,
                subject: "Complete seu cadastro na iGenda!",
                react: NewSubscriptionEmail({
                    customerName: customer.name || "",
                }),
            });

            // Mensagem WhatsApp para novos usuários
            await sendWhatsappMessage(customer.phone,
                `Olá, ${customer.name || ""}! 👋

Agradecemos por escolher a iGenda. 🎉

Sua assinatura foi ativada com sucesso! 

Clique neste link para cadastrar sua conta: https://igendaapp.com.br/authentication/sign-up

Atenciosamente, equipe iGenda! 💚 `
            );
        }
    }

    return NextResponse.json({ received: true });
}
