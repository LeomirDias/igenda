
import { eq } from "drizzle-orm";
import { BadgeInfo } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SlugPageDescription, SlugPageHeader, SlugPageHeaderContent, SlugPageTitle } from "@/components/ui/slug-page-container";
import { db } from "@/db";
import { enterprisesTable } from "@/db/schema";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

const PublicPagesHeader = async ({ params }: PageProps) => {
    const { slug } = await params;

    const enterprise = await db.query.enterprisesTable.findFirst({
        where: eq(enterprisesTable.slug, slug),
    });

    const enterpriseInitials = enterprise?.name
        .split(" ")
        .map((name: string) => name[0])
        .join("");

    return (
        <SlugPageHeader>
            <SlugPageHeaderContent>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 relative border-1 border-gray-200 rounded-full">
                            {enterprise?.avatarImageURL ? (
                                <Image
                                    src={enterprise?.avatarImageURL}
                                    alt={enterprise?.name}
                                    fill
                                    style={{ objectFit: "cover" }}
                                    className="rounded-full"
                                />
                            ) : (
                                <AvatarFallback>{enterpriseInitials}</AvatarFallback>
                            )}
                        </Avatar>
                        <div className="flex flex-col">
                            <SlugPageTitle>{enterprise?.name}</SlugPageTitle>
                            <SlugPageDescription>Está é a iGenda de {enterprise?.name}.</SlugPageDescription>
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
    );
}

export default PublicPagesHeader;