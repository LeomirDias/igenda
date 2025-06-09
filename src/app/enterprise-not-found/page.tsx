import type { Metadata } from "next"

import SupportHeader from "./_components/support-header"
import WhatsappCard from "./_components/whatsapp-card"


export const metadata: Metadata = {
    title: "iGenda | Empresa não encontrada",
}

export default function SupportPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <SupportHeader />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <WhatsappCard />
            </div>
        </div>
    )
}
