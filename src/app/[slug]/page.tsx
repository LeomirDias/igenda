import { eq } from "drizzle-orm";
import { CalendarIcon, Camera, MapPin, MessageCircle, UserPlus2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SlugPageContainer, SlugPageContent, SlugPageDescription, SlugPageHeader, SlugPageHeaderContent, SlugPageTitle } from "@/components/ui/slug-page-container";
import { db } from "@/db";
import { enterprisesTable } from "@/db/schema";

import { generateEnterpriseMetadata } from "./metadata";

export const generateMetadata = generateEnterpriseMetadata;

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

const ClientHomePage = async ({ params }: PageProps) => {
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

    const enterpriseInitials = enterprise.name
        .split(" ")
        .map((name) => name[0])
        .join("");

    return (
        <SlugPageContainer>
            <SlugPageHeader>
                <div className="flex items-center gap-2">
                    <Avatar className="h-16 w-16 relative">
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
                    <SlugPageHeaderContent>
                        <SlugPageTitle>Seja bem vindo (a), à <br />{enterprise.name}!</SlugPageTitle>
                        <SlugPageDescription>Veja informações importantes, agende seu horários ou acompanhe seus agendamentos.</SlugPageDescription>
                    </SlugPageHeaderContent>
                </div>
            </SlugPageHeader>

            <Separator />

            <SlugPageContent>
                <div className="flex items-center justify-center gap-4 w-full">
                    <Link href={`/${slug}/agendar-horario`} target="_blank" className="w-1/2">
                        <Button variant="outline" className="flex flex-col items-center justify-center h-auto w-full">
                            <UserPlus2 />
                            Agendar horário
                        </Button>
                    </Link>
                    <Link href={`/${slug}/agendar-horario`} target="_blank" className="w-1/2">
                        <Button variant="outline" className="flex flex-col items-center justify-center h-auto w-full">
                            <CalendarIcon />
                            Meus agendamentos
                        </Button>
                    </Link>
                </div>
            </SlugPageContent>

            <Separator />
            <SlugPageContent>
                <div className="flex flex-col items-center justify-center gap-4 w-full">

                    <h1 className="text-lg font-semibold">Sobre {enterprise.name}</h1>

                    <div className="flex items-center justify-center gap-4 w-full">
                        <Link href={`https://wa.me/${enterprise.phoneNumber}`} target="_blank" className="w-1/2">
                            <Button variant="outline" className="flex flex-col items-center justify-center h-auto w-full">
                                <MessageCircle />
                                <span>Entrar em contato</span>
                            </Button>
                        </Link>
                        <Link href={`${enterprise.instagramURL}`} target="_blank" className="w-1/2">
                            <Button variant="outline" className="flex flex-col items-center justify-center h-auto w-full">
                                <Camera />
                                <span>Visitar Instagram</span>
                            </Button>
                        </Link>
                    </div>

                    <Link href={`https://www.google.com/maps?q=${enterprise.cep}`} target="_blank" className="w-full">
                        <Button variant="outline" className="flex flex-col items-center justify-center h-auto w-full">
                            <MapPin size={24} />
                            <span className="">Endereço {enterprise.name}</span>
                            <span className="">{enterprise.address}, {enterprise.number}, {enterprise.city} - {enterprise.state} ({enterprise.cep})</span>
                        </Button>
                    </Link>

                </div>
            </SlugPageContent>



        </SlugPageContainer>
    );
}

export default ClientHomePage;