import { db } from "@/db";
import { eq } from "drizzle-orm";
import { enterprisesTable } from "@/db/schema";
import { SlugPageActions, SlugPageContainer, SlugPageContent, SlugPageDescription, SlugPageFooter, SlugPageFooterActions, SlugPageFooterContent, SlugPageHeader, SlugPageHeaderContent, SlugPageTitle } from "@/components/ui/slug-page-container";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cookies } from "next/headers";
import { getClientFromToken } from "@/middleware/client-auth";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

const ClientHomePage = async ({ params }: PageProps) => {

    const { slug } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get("client_token")?.value;
    const client = await getClientFromToken(token || "");

    const enterprise = await db.query.enterprisesTable.findFirst({
        where: eq(enterprisesTable.slug, slug),
    });

    return (
        <SlugPageContainer>
            <SlugPageHeader>
                <SlugPageHeaderContent>
                    <SlugPageTitle>Olá, {client?.name}!</SlugPageTitle>
                    <SlugPageDescription>Seja bem vindo à iGenda de {enterprise?.name}</SlugPageDescription>
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
            <SlugPageFooter>
                <SlugPageFooterContent>
                    <SlugPageFooterActions>
                        <Button>
                            <Calendar />
                        </Button>
                    </SlugPageFooterActions>
                </SlugPageFooterContent>
            </SlugPageFooter>
        </SlugPageContainer>
    );
}

export default ClientHomePage;