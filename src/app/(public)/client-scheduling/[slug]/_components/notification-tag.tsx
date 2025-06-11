import { Clock } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"

interface NotificationTagProps {
    itemForSelection: string
    itemForShow: string
}

export default function NotificationTag({ itemForSelection, itemForShow }: NotificationTagProps) {
    return (
        <div className="p-6 max-w-md mx-auto">
            <Alert className="bg-primary/10 border-primary/20 text-primary">
                <Clock className="h-4 w-4 text-primary" />
                <AlertDescription className="text-primary">
                    Escolha um {itemForSelection} para buscar os {itemForShow} disponíveis para agendamento
                </AlertDescription>
            </Alert>
        </div>
    )
}
