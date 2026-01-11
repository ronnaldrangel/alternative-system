"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, User, Mail, Save, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { changePassword } from "@/lib/auth-service"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PasswordInput } from "@/components/ui/password-input"

const profileFormSchema = z.object({
    username: z
        .string()
        .min(2, {
            message: "Username must be at least 2 characters.",
        })
        .max(30, {
            message: "Username must not be longer than 30 characters.",
        }),
    email: z.string().email({ message: "Please select an email to display." }),
})

const passwordFormSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

type ProfileFormValues = z.infer<typeof profileFormSchema>
type PasswordFormValues = z.infer<typeof passwordFormSchema>

export default function ProfilePage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const [user, setUser] = React.useState<any>(null)
    const [isPasswordLoading, setIsPasswordLoading] = React.useState(false)
    const { toast } = useToast()

    // Default values
    const defaultValues: Partial<ProfileFormValues> = {
        username: "",
        email: "",
    }

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
        mode: "onChange",
    })

    const passwordForm = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        mode: "onChange",
    })

    React.useEffect(() => {
        // Load user from local storage
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser)
            setUser(parsedUser)
            form.reset({
                username: parsedUser.username || "",
                email: parsedUser.email || "",
            })
        } else {
            // Redirect to login if no user found (optional protection)
            // router.push("/login") 
        }
    }, [form, router])

    function onSubmit(data: ProfileFormValues) {
        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            // specific logic to update user would go here (e.g. call strapi API)
            // For now, we update local storage to reflect changes 'locally' if needed, 
            // but normally we'd wait for API response.

            // Update local storage object related to user if we were really updating
            if (user) {
                const updatedUser = { ...user, username: data.username, email: data.email }
                localStorage.setItem("user", JSON.stringify(updatedUser))
                // Force a page refresh or state update to propagate changes if necessary
                window.location.reload()
            }

            setIsLoading(false)
            toast({
                title: "Profile updated",
                description: "Your profile information has been updated.",
            })
        }, 1000)
    }

    async function onPasswordSubmit(data: PasswordFormValues) {
        setIsPasswordLoading(true)
        try {
            await changePassword(data.currentPassword, data.newPassword, data.confirmPassword)
            toast({
                title: "Password updated",
                description: "Your password has been changed successfully.",
            })
            passwordForm.reset()
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to change password",
            })
        } finally {
            setIsPasswordLoading(false)
        }
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Mi Cuenta</h1>
                    <p className="text-muted-foreground">Administra la configuración de tu perfil y preferencias.</p>
                </div>
            </div>

            <div className="max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Perfil</CardTitle>
                        <CardDescription>
                            Esta es tu información personal pública.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6 flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                                <AvatarFallback className="text-lg">
                                    {user?.username?.substring(0, 2).toUpperCase() || "US"}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <Button variant="outline" size="sm">Cambiar Avatar</Button>
                                <p className="text-[0.8rem] text-muted-foreground mt-1">
                                    JPG, GIF or PNG. Max size of 800K
                                </p>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre de Usuario</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input className="pl-9" placeholder="Tu nombre de usuario" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Correo Electrónico</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input className="pl-9" placeholder="tu@email.com" {...field} disabled />
                                                </div>
                                            </FormControl>
                                            <CardDescription className="mt-1">
                                                El correo electrónico no se puede cambiar directamente para asegurar tu cuenta.
                                            </CardDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" /> Guardar Cambios
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Seguridad</CardTitle>
                        <CardDescription>
                            Actualiza tu contraseña para mantener tu cuenta segura.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...passwordForm}>
                            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                                <FormField
                                    control={passwordForm.control}
                                    name="currentPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contraseña Actual</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                                                    <PasswordInput className="pl-9" placeholder="••••••" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={passwordForm.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nueva Contraseña</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                                                        <PasswordInput className="pl-9" placeholder="••••••" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={passwordForm.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirmar Contraseña</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                                                        <PasswordInput className="pl-9" placeholder="••••••" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={isPasswordLoading}>
                                        {isPasswordLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Actualizando...
                                            </>
                                        ) : (
                                            "Actualizar Contraseña"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
