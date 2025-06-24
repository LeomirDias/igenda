"use client";

import { redirect } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getEnterpriseBySlug } from "@/actions/get-enterprise-by-slug";
import { Separator } from "@/components/ui/separator";
import { SlugPageContainer, SlugPageContent } from "@/components/ui/slug-page-container";
import { enterprisesTable } from "@/db/schema";
import { useAppointmentStore } from "@/stores/appointment-store";

import PublicPagesHeader from "../../_components/public-pages-header";
import ProfessionalCard from "./_components/professional-card";

interface PageProps {
    params: {
        slug: string;
    };
}

const ProfessionalSelectionPage = ({ params }: PageProps) => {
    const { serviceId } = useAppointmentStore();
    const [enterprise, setEnterprise] = useState<typeof enterprisesTable.$inferSelect | null>(null);

    const { execute: fetchEnterprise } = useAction(getEnterpriseBySlug, {
        onSuccess: (response) => {
            if (!response.data) return;
            setEnterprise(response.data);
        },
        onError: (error) => {
            toast.error(error.error?.serverError || "Erro ao carregar dados da empresa");
            redirect("/enterprise-not-found");
        }
    });

    useEffect(() => {
        fetchEnterprise({ slug: params.slug });
    }, [params.slug, fetchEnterprise]);

    if (!serviceId) {
        redirect(`/${params.slug}`);
    }

    if (!enterprise) {
        return null;
    }

    return (
        <SlugPageContainer>
            <PublicPagesHeader params={params} />
            <Separator />
            <SlugPageContent>
                <div>
                    <ProfessionalCard serviceId={serviceId} />
                </div>
            </SlugPageContent>
        </SlugPageContainer>
    );
}

export default ProfessionalSelectionPage;