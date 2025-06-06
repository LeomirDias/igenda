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


interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

const BookingPage = async ({ params }: PageProps) => {
    // Aguardando os parâmetros conforme recomendação do Next.js 15
    const { slug } = await params;

    const enterprise = await db.query.enterprisesTable.findFirst({
        where: eq(enterprisesTable.slug, slug),
    });

    if (!enterprise) {
        return <div>Empresa não encontrada</div>;
    }

    return (
        <SlugPageContainer>
            <SlugPageHeader>
                <SlugPageHeaderContent>
                    <SlugPageTitle>{enterprise.name}</SlugPageTitle>
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

export default BookingPage;