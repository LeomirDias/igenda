"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { enterprisesTable } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { Building, Instagram, MapPin, Phone, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { getEnterpriseBySlug } from "@/actions/get-enterprise-by-slug";

type EnterpriseData = InferSelectModel<typeof enterprisesTable> | undefined;

type EnterpriseCardProps = {
    slug: string;
};

export default function EnterpriseCard({ slug }: EnterpriseCardProps) {
    const [enterprise, setEnterprise] = useState<EnterpriseData>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchEnterprise = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            const result = await getEnterpriseBySlug({ slug });

            if (result.data) {
                setEnterprise(result.data as EnterpriseData);
            } else if (result.serverError) {
                setErrorMessage(result.serverError);
            } else if (result.validationError) {
                setErrorMessage("Erro de validação: " + Object.values(result.validationError).join(", "));
            } else {
                setErrorMessage("Ocorreu um erro desconhecido ao buscar dados da empresa.");
            }
            setIsLoading(false);
        };

        if (slug) {
            fetchEnterprise();
        }
    }, [slug]);

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Carregando...</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Buscando informações da empresa...</p>
                </CardContent>
            </Card>
        );
    }

    if (errorMessage) {
        return (
            <Card className="border-destructive bg-destructive/10">
                <CardHeader>
                    <CardTitle className="flex items-center text-destructive">
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        Erro ao carregar informações
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-destructive">{errorMessage}</p>
                </CardContent>
            </Card>
        );
    }

    if (!enterprise) {
        return (
            <Card className="border-muted-foreground/50">
                <CardHeader>
                    <CardTitle className="flex items-center text-muted-foreground">
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        Empresa não encontrada
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Não foi possível encontrar informações para a empresa com o slug fornecido.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Building className="mr-2 h-5 w-5" />
                    {enterprise.name}
                </CardTitle>
                <CardDescription>{enterprise.specialty}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{`${enterprise.address}, ${enterprise.number}${enterprise.complement ? `, ${enterprise.complement}` : ''} - ${enterprise.city}/${enterprise.state} - CEP: ${enterprise.cep}`}</span>
                </div>
                <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{enterprise.phoneNumber}</span>
                </div>
                {enterprise.instagramURL && (
                    <a
                        href={enterprise.instagramURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-500 hover:underline"
                    >
                        <Instagram className="mr-2 h-4 w-4" />
                        <span>{enterprise.instagramURL.replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/$/, '')}</span>
                    </a>
                )}
            </CardContent>
        </Card>
    );
} 