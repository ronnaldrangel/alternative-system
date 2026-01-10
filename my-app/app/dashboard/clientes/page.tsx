"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, Users, Loader2, MoreHorizontal, Pencil, Trash, Search, ChevronDown, ChevronRight } from "lucide-react"

import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { getClients, createClient, updateClient, deleteClient, ClientData } from "@/lib/client-service"
import { getSelectedWorkspace } from "@/lib/workspace-service"

export default function ClientsPage() {
    const router = useRouter()
    const [clients, setClients] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [isCreating, setIsCreating] = React.useState(false)
    const [showNewClientDialog, setShowNewClientDialog] = React.useState(false)
    const [workspaceId, setWorkspaceId] = React.useState<number | string | null>(null)
    const [editingClient, setEditingClient] = React.useState<any>(null)
    const [searchQuery, setSearchQuery] = React.useState("")

    // Form State
    const [fullName, setFullName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [phone, setPhone] = React.useState("")
    const [dni, setDni] = React.useState("")
    const [country, setCountry] = React.useState("")
    const [dateBirth, setDateBirth] = React.useState("")
    const [clientType, setClientType] = React.useState<"Cliente" | "Proveedor" | "Cliente/Proveedor">("Cliente")
    const [typeDni, setTypeDni] = React.useState("SIN DOCUMENTO")
    const [errors, setErrors] = React.useState<{ email?: string }>({})
    const [showAdvancedOptions, setShowAdvancedOptions] = React.useState(false)

    const fetchClients = React.useCallback(async (wsId: number | string) => {
        setIsLoading(true)
        try {
            const data = await getClients(wsId)
            const mappedClients = Array.isArray(data) ? data.map((client: any) => ({
                id: client.id,
                documentId: client.documentId,
                ...client.attributes || client
            })) : []
            setClients(mappedClients)
        } catch (error) {
            console.error("Failed to fetch clients", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    React.useEffect(() => {
        const workspace = getSelectedWorkspace()
        if (!workspace) {
            router.push("/workspace")
            return
        }
        setWorkspaceId(workspace.id)
        fetchClients(workspace.id)
    }, [fetchClients, router])

    const resetForm = () => {
        setFullName("")
        setEmail("")
        setPhone("")
        setDni("")
        setCountry("")
        setDateBirth("")
        setClientType("Cliente")
        setTypeDni("SIN DOCUMENTO")
        setShowAdvancedOptions(false)
        setErrors({})
        setEditingClient(null)
    }

    const handleOpenDialog = (open: boolean) => {
        setShowNewClientDialog(open)
        if (!open) {
            resetForm()
        }
    }

    const handleCreateOrUpdateClient = async () => {
        setErrors({})
        if (!fullName.trim() || !workspaceId) return

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setErrors({ email: "Invalid email address" })
            return
        }

        setIsCreating(true)
        try {
            const clientData: ClientData = {
                full_name: fullName,
                email: email || undefined,
                phone: phone || undefined,
                dni: typeDni !== "SIN DOCUMENTO" && dni ? Number(dni) : undefined,
                country: country || undefined,
                date_birth: dateBirth || undefined,
                type: clientType,
                type_dni: typeDni
            }

            if (editingClient) {
                const idToUpdate = editingClient.documentId || editingClient.id
                await updateClient(idToUpdate, clientData)
            } else {
                await createClient(clientData, workspaceId)
            }

            resetForm()
            setShowNewClientDialog(false)
            fetchClients(workspaceId)
        } catch (error) {
            console.error("Failed to save client", error)
        } finally {
            setIsCreating(false)
        }
    }

    const handleEditClick = (client: any) => {
        setEditingClient(client)
        setFullName(client.full_name || "")
        setEmail(client.email || "")
        setPhone(client.phone || "")
        setDni(client.dni ? String(client.dni) : "")
        setCountry(client.country || "")
        setDateBirth(client.date_birth || "")
        setClientType(client.type || "Cliente")
        setTypeDni(client.type_dni || "DNI")
        setShowAdvancedOptions(true) // Open advanced to show full context when editing maybe? Or keep closed. User didn't ask. Let's keep existing logic.
        setShowNewClientDialog(true)
    }

    const handleDeleteClick = async (clientId: number | string) => {
        if (confirm("Are you sure you want to delete this client?")) {
            try {
                await deleteClient(clientId)
                // refresh
                if (workspaceId) fetchClients(workspaceId)
            } catch (e) {
                console.error("Failed to delete", e)
            }
        }
    }

    const filteredClients = clients.filter(client => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
            client.full_name?.toLowerCase().includes(query) ||
            client.email?.toLowerCase().includes(query) ||
            (client.dni && String(client.dni).includes(query))
        )
    })

    if (isLoading && !clients.length) {
        return (
            <div className="flex flex-1 items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Clientes</h1>
                    <p className="text-muted-foreground">Manage clients for this workspace.</p>
                </div>
                <Dialog open={showNewClientDialog} onOpenChange={handleOpenDialog}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> New Client
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{editingClient ? "Edit Client" : "Create Client"}</DialogTitle>
                            <DialogDescription>
                                {editingClient ? "Update client details." : "Add a new client to your workspace."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-4">
                                <div className="space-y-3">
                                    <Label>Document Type</Label>
                                    <RadioGroup
                                        defaultValue="SIN DOCUMENTO"
                                        value={typeDni}
                                        onValueChange={setTypeDni}
                                        className="flex flex-row space-x-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="SIN DOCUMENTO" id="r3" />
                                            <Label htmlFor="r3">SIN DOCUMENTO</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="DNI" id="r2" />
                                            <Label htmlFor="r2">DNI</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="RUC" id="r1" />
                                            <Label htmlFor="r1">RUC</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                {typeDni !== "SIN DOCUMENTO" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="dni">{typeDni}</Label>
                                        <Input id="dni" type="number" value={dni} onChange={(e) => setDni(e.target.value)} placeholder="12345678" />
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name *</Label>
                                    <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <PhoneInput
                                    id="phone"
                                    value={phone}
                                    onChange={(value: string | undefined) => setPhone(value || "")}
                                    placeholder="+1 234 567 890"
                                    defaultCountry="PE"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select value={clientType} onValueChange={(val: any) => setClientType(val)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Cliente">Cliente</SelectItem>
                                        <SelectItem value="Proveedor">Proveedor</SelectItem>
                                        <SelectItem value="Cliente/Proveedor">Cliente/Proveedor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-0 h-auto font-medium text-muted-foreground hover:text-foreground flex items-center gap-1"
                                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                                >
                                    {showAdvancedOptions ? (
                                        <ChevronDown className="h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4" />
                                    )}
                                    Advanced Options
                                </Button>
                            </div>

                            {showAdvancedOptions && (
                                <div className="space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="john@example.com"
                                            className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                                        />
                                        {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="USA" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dateBirth">Date of Birth</Label>
                                        <Input id="dateBirth" type="date" value={dateBirth} onChange={(e) => setDateBirth(e.target.value)} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => handleOpenDialog(false)}>Cancel</Button>
                            <Button onClick={handleCreateOrUpdateClient} disabled={isCreating || !fullName.trim()}>
                                {isCreating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {editingClient ? "Updating..." : "Creating..."}
                                    </>
                                ) : (editingClient ? "Update Client" : "Create Client")}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search clients..."
                    className="pl-8 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <Card>
                <CardContent className="p-0">
                    {filteredClients.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                            {searchQuery ? (
                                <>
                                    <Search className="h-12 w-12 mb-4 opacity-20" />
                                    <p>No results found for "{searchQuery}".</p>
                                </>
                            ) : (
                                <>
                                    <Users className="h-12 w-12 mb-4 opacity-20" />
                                    <p>No clients found.</p>
                                    <p className="text-sm">Create a new client to get started.</p>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm text-left">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Name</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Phone</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Type</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {filteredClients.map((client) => (
                                        <tr key={client.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-medium">{client.full_name}</td>
                                            <td className="p-4 align-middle">{client.phone || "-"}</td>
                                            <td className="p-4 align-middle">{client.type || "-"}</td>
                                            <td className="p-4 align-middle text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleEditClick(client)}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleDeleteClick(client.documentId || client.id)} className="text-destructive">
                                                            <Trash className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div >
    )
}
