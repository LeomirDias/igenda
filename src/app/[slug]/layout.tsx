import { Button } from "@/components/ui/button";
import { Home, Store, User } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface EnterpriseLayoutProps {
    children: ReactNode;
    params: {
        slug: string;
    };
}

export default async function EnterpriseLayout({ children, params: routeParams }: EnterpriseLayoutProps) {
    const params = await routeParams;

    const enterpriseName = params.slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const slogan = "Conectando você aos melhores serviços!";

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-50 w-full px-2">
                <div className="container py-4">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {enterpriseName}
                    </h1>
                    <p className="text-muted-foreground">
                        {slogan}
                    </p>
                </div>
            </header>

            <main className="flex-1 px-2">{children}</main>

            <footer className="sticky bottom-0 z-40 mt-auto w-full border-t bg-background">
                <div className="container flex h-16 items-center justify-around p-4">
                    <Button asChild variant="ghost" className="flex-1 flex-col">
                        <Link href={`/${params.slug}`}>
                            <Home size={40} />
                            <span className="text-xs">Início</span>
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" className="flex-1 flex-col">
                        <Link href={`/${params.slug}/enterprise`}>
                            <Store size={40} />
                            <span className="text-xs">{enterpriseName}</span>
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" className="flex-1 flex-col">
                        <Link href={`/${params.slug}/clients`}>
                            <User size={40} />
                            <span className="text-xs">Meu Perfil</span>
                        </Link>
                    </Button>
                </div>
            </footer>
        </div>
    );
} 