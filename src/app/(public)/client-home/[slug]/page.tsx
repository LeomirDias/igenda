import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SlugPageActions, SlugPageContainer, SlugPageContent, SlugPageDescription, SlugPageHeader, SlugPageHeaderContent, SlugPageTitle } from "@/components/ui/slug-page-container";
import { db } from "@/db";
import { enterprisesTable } from "@/db/schema";
import { getClientFromToken } from "@/middleware/client-auth";

import SlugPagesFooter from "../../_components/slug-pages-footer";



interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

const ClientHomePage = async ({ params }: PageProps) => {
    const { slug } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("client_token")?.value;

    if (!token) {
        redirect(`/client-authentication/${slug}`);
    }

    const client = await getClientFromToken(token);

    if (!client) {
        redirect(`/client-authentication/${slug}`);
    }

    const enterprise = await db.query.enterprisesTable.findFirst({
        where: eq(enterprisesTable.slug, slug),
    });

    if (!enterprise) {
        redirect("/");
    }

    return (
        <SlugPageContainer>
            <SlugPageHeader>
                <SlugPageHeaderContent>
                    <SlugPageTitle>Olá, {client.name}!</SlugPageTitle>
                    <SlugPageDescription>Seja bem vindo à iGenda de {enterprise.name}</SlugPageDescription>
                </SlugPageHeaderContent>
            </SlugPageHeader>
            <SlugPageContent>
                <SlugPageActions>
                    <Link href="/">
                        <Button>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Agendar horário</CardTitle>
                                    <CardDescription>Agende um horário para o seu serviço</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col gap-2">
                                            <Label>Data</Label>
                                            <Input type="date" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Button>
                    </Link>
                </SlugPageActions>
            </SlugPageContent>
            <SlugPagesFooter />
        </SlugPageContainer>
    );
}

export default ClientHomePage;