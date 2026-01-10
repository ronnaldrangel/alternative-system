"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, Package, Loader2, MoreHorizontal, Pencil, Trash, Search } from "lucide-react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { getProducts, createProduct, updateProduct, deleteProduct, ProductData } from "@/lib/product-service"
import { getSelectedWorkspace } from "@/lib/workspace-service"

export default function ProductsPage() {
    const router = useRouter()
    const [products, setProducts] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [isCreating, setIsCreating] = React.useState(false)
    const [showNewProductDialog, setShowNewProductDialog] = React.useState(false)
    const [workspaceId, setWorkspaceId] = React.useState<number | string | null>(null)
    const [editingProduct, setEditingProduct] = React.useState<any>(null)
    const [searchQuery, setSearchQuery] = React.useState("")

    // Form State
    const [name, setName] = React.useState("")
    const [regularPrice, setRegularPrice] = React.useState("")
    const [salePrice, setSalePrice] = React.useState("")
    const [descriptionShort, setDescriptionShort] = React.useState("")

    const fetchProducts = React.useCallback(async (wsId: number | string) => {
        setIsLoading(true)
        try {
            const data = await getProducts(wsId)
            const mappedProducts = Array.isArray(data) ? data.map((product: any) => ({
                id: product.id,
                documentId: product.documentId,
                ...product.attributes || product
            })) : []
            setProducts(mappedProducts)
        } catch (error) {
            console.error("Failed to fetch products", error)
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
        fetchProducts(workspace.id)
    }, [fetchProducts, router])

    const resetForm = () => {
        setName("")
        setRegularPrice("")
        setSalePrice("")
        setDescriptionShort("")
        setEditingProduct(null)
    }

    const handleOpenDialog = (open: boolean) => {
        setShowNewProductDialog(open)
        if (!open) {
            resetForm()
        }
    }

    const handleCreateOrUpdateProduct = async () => {
        if (!name.trim() || !workspaceId) return

        setIsCreating(true)
        try {
            const productData: ProductData = {
                name: name,
                regularPrice: regularPrice ? Number(regularPrice) : undefined,
                salePrice: salePrice ? Number(salePrice) : undefined,
                description_short: descriptionShort || undefined
            }

            if (editingProduct) {
                const idToUpdate = editingProduct.documentId || editingProduct.id
                await updateProduct(idToUpdate, productData)
            } else {
                await createProduct(productData, workspaceId)
            }

            resetForm()
            setShowNewProductDialog(false)
            fetchProducts(workspaceId)
        } catch (error) {
            console.error("Failed to save product", error)
        } finally {
            setIsCreating(false)
        }
    }

    const handleEditClick = (product: any) => {
        setEditingProduct(product)
        setName(product.name || "")
        setRegularPrice(product.regularPrice ? String(product.regularPrice) : "")
        setSalePrice(product.salePrice ? String(product.salePrice) : "")
        setDescriptionShort(product.description_short || "")
        setShowNewProductDialog(true)
    }

    const handleDeleteClick = async (productId: number | string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(productId)
                // refresh
                if (workspaceId) fetchProducts(workspaceId)
            } catch (e) {
                console.error("Failed to delete", e)
            }
        }
    }

    const filteredProducts = products.filter(product => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
            product.name?.toLowerCase().includes(query)
        )
    })

    if (isLoading && !products.length) {
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
                    <h1 className="text-2xl font-bold">Productos</h1>
                    <p className="text-muted-foreground">Manage products for this workspace.</p>
                </div>
                <Dialog open={showNewProductDialog} onOpenChange={handleOpenDialog}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> New Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{editingProduct ? "Edit Product" : "Create Product"}</DialogTitle>
                            <DialogDescription>
                                {editingProduct ? "Update product details." : "Add a new product to your workspace."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="regularPrice">Regular Price</Label>
                                    <Input id="regularPrice" type="number" value={regularPrice} onChange={(e) => setRegularPrice(e.target.value)} placeholder="0.00" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="salePrice">Sale Price</Label>
                                    <Input id="salePrice" type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder="0.00" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="descriptionShort">Short Description</Label>
                                <Input id="descriptionShort" value={descriptionShort} onChange={(e) => setDescriptionShort(e.target.value)} placeholder="Brief description" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => handleOpenDialog(false)}>Cancel</Button>
                            <Button onClick={handleCreateOrUpdateProduct} disabled={isCreating || !name.trim()}>
                                {isCreating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {editingProduct ? "Updating..." : "Creating..."}
                                    </>
                                ) : (editingProduct ? "Update Product" : "Create Product")}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-8 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <Card>
                <CardContent className="p-0">
                    {filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                            {searchQuery ? (
                                <>
                                    <Search className="h-12 w-12 mb-4 opacity-20" />
                                    <p>No results found for "{searchQuery}".</p>
                                </>
                            ) : (
                                <>
                                    <Package className="h-12 w-12 mb-4 opacity-20" />
                                    <p>No products found.</p>
                                    <p className="text-sm">Create a new product to get started.</p>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm text-left">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Name</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Regular Price</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Sale Price</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Description</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-medium">{product.name}</td>
                                            <td className="p-4 align-middle">{product.regularPrice || "-"}</td>
                                            <td className="p-4 align-middle">{product.salePrice || "-"}</td>
                                            <td className="p-4 align-middle">{product.description_short || "-"}</td>
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
                                                        <DropdownMenuItem onClick={() => handleEditClick(product)}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleDeleteClick(product.documentId || product.id)} className="text-destructive">
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
        </div>
    )
}
