import { eq } from "drizzle-orm";
import { MapPinnedIcon, MessageCircle } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader } from "@/components/ui/card";
import { SlugPageContainer, SlugPageContent, SlugPageDescription, SlugPageHeader, SlugPageHeaderContent, SlugPageTitle } from "@/components/ui/slug-page-container";
import { db } from "@/db";
import { enterprisesTable } from "@/db/schema";

interface PageProps {
    params: {
        slug: string;
    };
}

const EnterpriseInfosPage = async ({ params }: PageProps) => {
    const { slug } = params;

    const enterprise = await db.query.enterprisesTable.findFirst({
        where: eq(enterprisesTable.slug, slug),
    });

    if (!enterprise) {
        redirect("/enterprise-not-found");
    }

    const enterpriseInitials = enterprise.name
        .split(" ")
        .map((name: string) => name[0])
        .join("");

    const getGoogleMapsUrl = () => {
        const address = `${enterprise.address}, ${enterprise.number} - ${enterprise.city}, ${enterprise.state}`;
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    };

    return (
        <SlugPageContainer>
            <SlugPageHeader>
                <SlugPageHeaderContent>
                    <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto mb-0">
                        <Avatar className="h-20 w-20 md:h-24 md:w-24 relative border-1 border-gray-200 rounded-full">
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
                        <div className="flex flex-col items-center gap-2">
                            <SlugPageTitle>{enterprise.name}</SlugPageTitle>
                            <SlugPageDescription>Verifique informações importantes sobre a {enterprise.name} que podem ser úteis para você.</SlugPageDescription>
                        </div>
                    </div>
                </SlugPageHeaderContent>
            </SlugPageHeader>

            <SlugPageContent>
                <div className="flex flex-col md:flex-row gap-8 justify-center items-center max-w-5xl mx-auto w-full min-h-[calc(100vh-20rem)] p-4">
                    <div className="w-full md:w-1/2 aspect-square max-w-[280px] md:max-w-md">
                        <a href={`https://wa.me/${enterprise.phoneNumber}`} target="_blank" rel="noopener noreferrer" className="h-full">
                            <Card className="hover:bg-opacity-90 transition-colors cursor-pointer h-full bg-[linear-gradient(to_right,#25D366,#128C7E)]">
                                <CardHeader className="flex flex-col items-center justify-center h-full text-center text-white gap-4 md:gap-6">
                                    <MessageCircle className="h-12 w-12 md:h-16 md:w-16" />
                                    <h1 className="text-lg md:text-xl font-semibold">Fale com {enterprise.name} no WhatsApp</h1>
                                </CardHeader>
                            </Card>
                        </a>
                    </div>
                    <div className="w-full md:w-1/2 aspect-square max-w-[280px] md:max-w-md">
                        <a href={getGoogleMapsUrl()} target="_blank" rel="noopener noreferrer" className="h-full">
                            <Card className="hover:bg-opacity-90 transition-colors cursor-pointer h-full bg-[linear-gradient(to_right,#4285F4,#0f9d58,#F4B400,#DB4437)]">
                                <CardHeader className="flex flex-col items-center justify-center h-full text-center text-white gap-4 md:gap-6">
                                    <MapPinnedIcon className="h-12 w-12 md:h-16 md:w-16" />
                                    <h1 className="text-lg md:text-xl font-semibold">Encontre {enterprise.name} no Google Maps</h1>
                                </CardHeader>
                            </Card>
                        </a>
                    </div>
                </div>
            </SlugPageContent>
        </SlugPageContainer>
    )
}

export default EnterpriseInfosPage;