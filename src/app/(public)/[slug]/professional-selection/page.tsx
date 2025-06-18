import { eq } from "drizzle-orm";
import { BadgeInfo } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SlugPageContainer, SlugPageContent, SlugPageHeader, SlugPageHeaderContent, SlugPageTitle } from "@/components/ui/slug-page-container";
import { SlugPageDescription } from "@/components/ui/slug-page-container";
import { db } from "@/db";
import { enterprisesTable, professionalsTable } from "@/db/schema";

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

    const professionals = await db.query.professionalsTable.findMany({
        where: eq(professionalsTable.enterpriseId, enterprise.id),
    });

    const enterpriseInitials = enterprise.name
        .split(" ")
        .map((name: string) => name[0])
        .join("");


    return (
        <SlugPageContainer>
            <SlugPageHeader>
                <SlugPageHeaderContent>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarFallback>
                                    {enterpriseInitials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <SlugPageTitle>{enterprise.name}</SlugPageTitle>
                                <SlugPageDescription>Está é a iGenda de {enterprise.name}.</SlugPageDescription>
                            </div>
                        </div>
                        <div>
                            <Link href={`/${slug}/enterprise-infos`}>
                                <BadgeInfo className="h-6 w-6 text-primary" />
                            </Link>
                        </div>
                    </div>
                </SlugPageHeaderContent>
            </SlugPageHeader>
            <Separator />
            <SlugPageContent>
                <div>
                    <ProfessionalCard professionals={professionals} />
                </div>
            </SlugPageContent>
        </SlugPageContainer>
    );
}

export default ProfessionalSelectionPage;