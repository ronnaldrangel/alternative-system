"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, MessageCircle } from "lucide-react"

export default function SupportPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Soporte</h1>
                    <p className="text-muted-foreground">¿Necesitas ayuda? Contáctanos por cualquiera de estos medios.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Email
                        </CardTitle>
                        <CardDescription>Escríbenos a nuestro correo</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-medium mb-4">soporte@example.com</p>
                        <Button variant="outline" className="w-full" asChild>
                            <a href="mailto:soporte@example.com">Enviar Correo</a>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5" />
                            WhatsApp
                        </CardTitle>
                        <CardDescription>Chat directo con nosotros</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-medium mb-4">+1 234 567 890</p>
                        <Button variant="outline" className="w-full" asChild>
                            <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                                Abrir WhatsApp
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
