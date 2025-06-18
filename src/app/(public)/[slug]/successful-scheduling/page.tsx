import { eq } from "drizzle-orm";
import { Check } from "lucide-react";

import { SlugPageContainer, SlugPageHeader, SlugPageHeaderContent, SlugPageTitle } from "@/components/ui/slug-page-container";
import { db } from "@/db";
import { enterprisesTable } from "@/db/schema";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

const SuccessfulScheduling = async ({ params }: PageProps) => {
    const { slug } = await params;

    const enterprise = await db.query.enterprisesTable.findFirst({
        where: eq(enterprisesTable.slug, slug),
    });

    return (
        <>
            <meta httpEquiv="refresh" content={`5;url=/${slug}/enterprise-infos`} />
            <SlugPageContainer>
                <div className="flex items-center justify-center min-h-[80vh]">
                    <SlugPageHeader>
                        <SlugPageHeaderContent>
                            <div className="flex flex-col items-center justify-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Check className="h-6 w-6 text-primary" />
                                </div>
                                <div className="text-center">
                                    <SlugPageTitle>Agendamento realizado com sucesso!</SlugPageTitle>
                                    <p className="text-muted-foreground mt-2">
                                        Seu agendamento foi confirmado em {enterprise?.name}.
                                    </p>
                                    <p className="text-muted-foreground mt-2">
                                        Os detalhes do seu agendamento serão enviados para o WhatsApp cadastrado.
                                    </p>
                                    <p className="text-muted-foreground mt-4 text-sm">
                                        Você será redirecionado em 5 segundos...
                                    </p>
                                </div>
                            </div>
                        </SlugPageHeaderContent>
                    </SlugPageHeader>
                </div>
            </SlugPageContainer>
        </>
    );
}

export default SuccessfulScheduling;