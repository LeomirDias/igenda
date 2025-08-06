import crypto from "crypto";
import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import { db } from "@/db";
import { usersTable, verificationsTable } from "@/db/schema";
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

        // Verifica se o cliente já existe pelo docNumber
        const existingUser = await db.query.usersTable.findFirst({
            where: eq(usersTable.docNumber, customer.docNumber)
        });

        if (existingUser) {
            // Cliente já existe, atualiza os dados
            await db.update(usersTable)
                .set({
                    name: customer.name,
                    phone: customer.phone,
                    // Plano
                    planId: product.id,
                    plan: product.name,
                    // Assinatura
                    subscriptionStatus: "waiting_payment",
                    subscriptionId: data.id,
                    refId: data.refId,
                    // Pagamento
                    paymentMethod: null,
                    paidAt: null,
                    // Cancelamento
                    canceledAt: null,
                    // Campos obrigatórios
                    updatedAt: new Date(),
                })
                .where(eq(usersTable.docNumber, customer.docNumber));

        } else {
            // Cliente não existe, cria um novo registro
            await db.insert(usersTable).values({
                // Cliente
                id: customer.id,
                name: customer.name,
                email: customer.email,
                emailVerified: false,
                phone: customer.phone,
                phoneVerified: false,
                docNumber: customer.docNumber,
                // Plano
                planId: product.id,
                plan: product.name,
                // Assinatura
                subscriptionStatus: "waiting_payment",
                subscriptionId: data.id,
                refId: data.refId,
                //Pagamento
                paymentMethod: null,
                paidAt: null,
                //Cancelamento
                canceledAt: null,
                // Campos obrigatórios
                createdAt: new Date(),
                updatedAt: new Date(),
                role: "administrator",
            });

            // Gera token de verificação apenas para novos clientes
            const token = crypto.randomUUID();
            await db.insert(verificationsTable).values({
                id: crypto.randomUUID(),
                identifier: customer.email,
                value: token,
                expiresAt: dayjs().add(24, "hours").toDate(),
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // Envia e-mail com o link apenas para novos clientes
            await resend.emails.send({
                from: `${process.env.NAME_FOR_ACCOUNT_MANAGEMENT_SUBMISSIONE} <${process.env.EMAIL_FOR_ACCOUNT_MANAGEMENT_SUBMISSION}>`,
                to: customer.email,
                subject: "Complete seu cadastro na iGenda",
                html: `<p>Olá, ${customer.name}!<br/> Agradecemos por escolher a iGenda. 💚 <br/>
      Clique no link abaixo para definir sua senha:<br/>
      <a href="https://igendaapp.com.br/set-password?token=${token}">
      Definir senha</a></p>`,
            });

            // Enviar mensagem personalizada apenas para novos clientes
            await sendWhatsappMessage(customer.phone,
                `Olá, ${customer.name || ""}!
Agradecemos por escolher a iGenda. 💚 

Clique neste link para definir sua senha e ter acesso a sua iGenda: *href="https://igendaapp.com.br/set-password?token=${token}*

⚠️ Atenção: 

O código é válido por 24 horas. ⏳ 

Caso não tenha solicitado, desconsidere esta mensagem.`
            );
        }
    }
    return NextResponse.json({ received: true });
}
