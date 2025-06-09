import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { SlugPageContainer, SlugPageContent, SlugPageDescription, SlugPageHeaderContent, SlugPageTitle } from "@/components/ui/slug-page-container";
import { SlugPageHeader } from "@/components/ui/slug-page-container";
import { db } from "@/db";
import { enterprisesTable, professionalsTable } from "@/db/schema";

import ProfessionalCard from "./_components/professional-card";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

const PublicEnterpriseProfessionalsPage = async ({ params }: PageProps) => {
    const { slug } = await params;

    if (!slug) {
        redirect("/enterprise-not-found");
    }

    const enterprise = await db.query.enterprisesTable.findFirst({
        where: eq(enterprisesTable.slug, slug),
    });

    if (!enterprise) {
        redirect("/enterprise-not-found");
    }

    const professionals = await db.query.professionalsTable.findMany({
        where: eq(professionalsTable.enterpriseId, enterprise.id),
    });

    return (
        <SlugPageContainer>
            <SlugPageHeader>
                <SlugPageHeaderContent>
                    <SlugPageTitle>Agendar atendimento</SlugPageTitle>
                    <SlugPageDescription>Selecione um profissional</SlugPageDescription>
                </SlugPageHeaderContent>
            </SlugPageHeader>
            <SlugPageContent>
                <div className="grid grid-cols-5 gap-2 w-full items-center justify-center">
                    {professionals.map((professional) => (
                        <ProfessionalCard
                            key={professional.id}
                            professional={professional}
                            enterpriseSlug={slug}
                        />
                    ))}
                </div>
                <Separator className="w-full" />
            </SlugPageContent>
        </SlugPageContainer>
    );
}

export default PublicEnterpriseProfessionalsPage;