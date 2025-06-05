import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageContainer, PageContent, PageDescription, PageHeader, PageHeaderContent, PageTitle } from "@/components/ui/page-container";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { usersToEnterprisesTable } from "@/db/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyLinkButton } from "./_components/copy-link-button";
import { Link, Link2Icon } from "lucide-react";

const BookingLinkPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user) {
        redirect("/authentication");
    }
    if (!session.user.enterprise) {
        redirect("/enterprise-form");
    }
    if (!session.user.plan) {
        redirect("/subscription-plans");
    }

    const enterprise = await db.query.usersToEnterprisesTable.findFirst({
        where: eq(usersToEnterprisesTable.userId, session.user.id),
        with: {
            enterprise: true
        }
    });

    if (!enterprise?.enterprise.slug) {
        throw new Error("Enterprise slug not found");
    }

    const bookingLink = `${process.env.NEXT_PUBLIC_APP_URL}/${enterprise.enterprise.slug}`;

    return (
        <PageContainer>
            <PageHeader>
                <PageHeaderContent>
                    <PageTitle>Link de agendamento</PageTitle>
                    <PageDescription>Copie seu link de agendamento para compartilhar com seus clientes.</PageDescription>
                </PageHeaderContent>
            </PageHeader>
            <PageContent>
                <div className="flex items-center justify-center w-full">
                    <Card className="w-full max-w-2xl">
                        <CardHeader>
                            <div className="flex flex-row items-center gap-2">
                                <Link className="w-5 h-5 text-primary" />
                                <CardTitle className="text-xl">Copie aqui seu link de agendamento!</CardTitle>
                            </div>
                            <CardDescription className="text-sm">
                                Compartilhe este link com seus clientes para que eles possam agendar serviços diretamente pelo sistema.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-2">
                                        <Input
                                            id="booking-link"
                                            value={bookingLink}
                                            readOnly
                                            className="text-primary font-medium"
                                        />
                                        <CopyLinkButton link={bookingLink} />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </PageContent>
        </PageContainer>
    );
}

export default BookingLinkPage;