import type { Metadata } from "next"
import SupportHeader from "@/app/(protected)/support/_components/support-header"
import WhatsappCard from "@/app/(protected)/support/_components/whatsapp-card"
import EmailCard from "@/app/(protected)/support/_components/email-card"

export const metadata: Metadata = {
    title: "Suporte - Nossa Aplicação",
    description: "Entre em contato com nossa equipe de suporte",
}

export default function SupportPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <SupportHeader />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <WhatsappCard />
                <EmailCard />
            </div>
        </div>
    )
}
