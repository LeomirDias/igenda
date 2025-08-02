import { MessageSquareText } from "lucide-react"

export default function SupportHeader() {
    return (
        <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                    <MessageSquareText className="h-8 w-8 text-primary" />
                </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Central de Suporte</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Estamos aqui para ajudar. Escolha uma das opções abaixo para entrar em contato com nossa equipe de suporte.
            </p>
        </div>
    )
}
