"use client";

import { BadgeInfo } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getEnterpriseBySlug } from "@/actions/get-enterprise-by-slug";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SlugPageDescription, SlugPageHeader, SlugPageHeaderContent, SlugPageTitle } from "@/components/ui/slug-page-container";
import { enterprisesTable } from "@/db/schema";

interface PageProps {
    params: {
        slug: string;
    };
}

const PublicPagesHeader = ({ params }: PageProps) => {
    const { slug } = params;
    const [enterprise, setEnterprise] = useState<typeof enterprisesTable.$inferSelect | null>(null);

    const { execute: fetchEnterprise } = useAction(getEnterpriseBySlug, {
        onSuccess: (response) => {
            if (!response.data) return;
            setEnterprise(response.data);
        },
        onError: (error) => {
            toast.error(error.error?.serverError || "Erro ao carregar dados da empresa");
        }
    });

    useEffect(() => {
        fetchEnterprise({ slug });
    }, [slug, fetchEnterprise]);

    if (!enterprise) {
        return null;
    }

    const enterpriseInitials = enterprise.name
        .split(" ")
        .map((name: string) => name[0])
        .join("");

    return (
        <SlugPageHeader>
            <SlugPageHeaderContent>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 relative border-1 border-gray-200 rounded-full">
                            {enterprise.avatarImageURL ? (
                                <Image
                                    src={enterprise.avatarImageURL}
                                    alt={enterprise.name}
                                    fill
                                    style={{ objectFit: "cover" }}
                                    className="rounded-full"
                                />
                            ) : (
                                <AvatarFallback>{enterpriseInitials}</AvatarFallback>
                            )}
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
    );
}

export default PublicPagesHeader;