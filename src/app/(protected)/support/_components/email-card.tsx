"use client"

import { useState } from "react"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function EmailCard() {
    const [message, setMessage] = useState("")

    // TODO: IMPLEMENTAR ENVIO DE EMAIL
    const supportEmail = "igendadevelopment@gmail.com"
    // Assunto do email
    const subject = "Solicitação de Suporte"

    const handleSendEmail = () => {
        if (!message.trim()) {
            alert("Por favor, escreva uma mensagem antes de enviar.")
            return
        }

        // Cria a URL mailto com o email, assunto e corpo da mensagem
        const mailtoUrl = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`

        // Abre o cliente de email do usuário
        window.location.href = mailtoUrl
    }

    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <CardTitle>Suporte via Email</CardTitle>
                </div>
                <CardDescription>Envie uma mensagem detalhada para nossa equipe de suporte</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="message">Sua mensagem</Label>
                        <Textarea
                            id="message"
                            placeholder="Descreva seu problema ou dúvida em detalhes..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-[120px]"
                        />
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full bg-primary hover:bg-green-800" onClick={handleSendEmail} disabled={!message.trim()}>
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar Email
                </Button>
            </CardFooter>
        </Card>
    )
}
