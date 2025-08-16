import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import NewSubscriptionEmail from "@/components/emails/new-subscriptions";
import RenewSubscriptionEmail from "@/components/emails/renewed subscriptions";
import { db } from "@/db";
import { usersSubscriptionTable } from "@/db/schema";
import { sendWhatsappMessage } from "@/lib/zapi-service";

const resend = new Resend(process.env.RESEND_API_KEY as string);
const LASTLINK_WEBHOOK_SECRET = process.env.LASTLINK_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
    // pegar token do header
    const headerSecret = req.headers.get("x-lastlink-token");

    if (!headerSecret || headerSecret !== LASTLINK_WEBHOOK_SECRET) {
        return NextResponse.json({ error: "Segredo inválido" }, { status: 401 });
    }

    // só processa o body depois que validar o secret
    const body = await req.json();

    console.log("Webhook recebido da Lastlink:", body);

    const alertPhone = "64992214800";

    const event = body?.Event;
    const data = body?.Data;
    const buyer = data?.Buyer;
    const product = data?.Products?.[0];
    const subscription = data?.Subscriptions?.[0];
    const purchase = data?.Purchase;

    if (!buyer?.Document) {
        return NextResponse.json({ error: "CPF do cliente ausente" }, { status: 400 });
    }

    if (!product?.Id) {
        return NextResponse.json({ error: "Produto ausente" }, { status: 400 });
    }

    if (!buyer?.Email) {
        return NextResponse.json({ error: "Email do cliente ausente" }, { status: 400 });
    }

    if (!buyer?.Name) {
        return NextResponse.json({ error: "Nome do cliente ausente" }, { status: 400 });
    }

    if (!buyer?.PhoneNumber) {
        return NextResponse.json({ error: "Telefone do cliente ausente" }, { status: 400 });
    }

    if (event === "Purchase_Order_Confirmed") {
        // Verifica se já existe um registro com o mesmo doc_number
        const existingSubscription = await db.query.usersSubscriptionTable.findFirst({
            where: eq(usersSubscriptionTable.docNumber, buyer.Document),
        });

        const subscriptionData = {
            //Cliente
            docNumber: buyer.Document,
            phone: buyer.PhoneNumber,
            //Plano
            planId: product?.Id,
            plan: product?.Name,
            //Assinatura
            subscriptionStatus: "active",
            subscriptionId: subscription?.Id,
            //Pagamento
            paymentMethod: purchase?.Payment?.PaymentMethod,
            paidAt: purchase?.PaymentDate ? new Date(purchase.PaymentDate) : new Date(),
            //Cancelamento
            canceledAt: null,
            //Outros de Cliente
            updatedAt: new Date(),
        };

        if (existingSubscription) {
            // Atualiza o registro existente
            await db.update(usersSubscriptionTable)
                .set(subscriptionData)
                .where(eq(usersSubscriptionTable.docNumber, buyer.Document));

            // Email
            await resend.emails.send({
                from: `${process.env.NAME_FOR_ACCOUNT_MANAGEMENT_SUBMISSION} <${process.env.EMAIL_FOR_ACCOUNT_MANAGEMENT_SUBMISSION}>`,
                to: buyer.Email,
                subject: "Acesse novamente sua iGenda!",
                react: RenewSubscriptionEmail({
                    customerName: buyer.Name || "",
                }),
            });

            // WhatsApp
            await sendWhatsappMessage(buyer.PhoneNumber,
                `Olá, ${buyer.Name || ""}! 👋

Que bom ter você de volta na iGenda! 🎉

Sua assinatura foi ativada com sucesso! 

Obrigado por continuar conosco!💚 `
            );

            await sendWhatsappMessage(alertPhone,
                `Olá, Leomir! 👋

Mais uma venda realizada. 🤑

Um cliente reativou sua assinatura iGenda! 🎉

Cliente: ${buyer.Name || ""}
CPF: ${buyer.Document}
Telefone: ${buyer.PhoneNumber}`
            );

        } else {
            // Insere um novo registro
            await db.insert(usersSubscriptionTable).values({
                ...subscriptionData,
                createdAt: new Date(),
            });

            // Email
            await resend.emails.send({
                from: `${process.env.NAME_FOR_ACCOUNT_MANAGEMENT_SUBMISSION} <${process.env.EMAIL_FOR_ACCOUNT_MANAGEMENT_SUBMISSION}>`,
                to: buyer.Email,
                subject: "Complete seu cadastro na iGenda!",
                react: NewSubscriptionEmail({
                    customerName: buyer.Name || "",
                }),
            });

            // WhatsApp
            await sendWhatsappMessage(buyer.PhoneNumber,
                `Olá, ${buyer.Name || ""}! 👋

Agradecemos por escolher a iGenda. 🎉

Sua assinatura foi ativada com sucesso! 

Clique neste link para cadastrar sua conta: https://igendaapp.com.br/authentication/sign-up

Seja bem vinda a iGenda. 💚

Clique neste link para entrar no grupo exclusivo de assinantes: https://chat.whatsapp.com/Ilg5BA5SR7wBlwd9t8KA1a?mode=ems_copy_c

Neste grupo você tem suporte total da nossa equipe além do chat privado e a oportunidade de criar uma rede de network com outros assinantes iGenda.

Atenciosamente, equipe iGenda! 💚 `
            );

            await sendWhatsappMessage(alertPhone,
                `Olá, Leomir! 👋

Mais uma venda realizada. 🤑

Um novo cliente adquiriu a iGenda! 🎉

Cliente: ${buyer.Name || ""}
CPF: ${buyer.Document}
Telefone: ${buyer.PhoneNumber}`
            );
        }
    }

    return NextResponse.json({ received: true });
}
