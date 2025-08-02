import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { SlugPageContainer, SlugPageContent } from "@/components/ui/slug-page-container";
import { db } from "@/db";
import { enterprisesTable } from "@/db/schema";

import PublicPagesHeader from "../../_components/public-pages-header";
import ProfessionalCard from "./_components/professional-card";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

const ProfessionalSelectionPage = async ({ params }: PageProps) => {
    const { slug } = await params;

    const enterprise = await db.query.enterprisesTable.findFirst({
        where: eq(enterprisesTable.slug, slug),
    });

    if (!enterprise) {
        redirect("/enterprise-not-found");
    }

    return (
        <SlugPageContainer>
            <PublicPagesHeader params={{ slug }} />
            <Separator />
            <SlugPageContent>
                <div>
                    <ProfessionalCard />
                </div>
            </SlugPageContent>
        </SlugPageContainer>
    );
}

export default ProfessionalSelectionPage;