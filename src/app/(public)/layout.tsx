import { Toaster } from "@/components/ui/sonner";

import PublicPagesFooter from "./_components/public-pages-footer.tsx";
import PublicPagesHeader from "./_components/public-pages-header";

interface ClientLayoutProps {
    children: React.ReactNode;
}

export default async function ClientLayout({ children }: ClientLayoutProps) {
    return (
        <html>
            <PublicPagesHeader />
            <body>{children}</body>
            <PublicPagesFooter />
            <Toaster position="bottom-center" richColors />
        </html>
    );
} 