
import { STRAPI_URL, getToken } from "./auth-service";

export interface ProductData {
    name: string;
    regularPrice?: number | string;
    salePrice?: number | string;
    description_short?: string;
    description_full?: string;
    thumbnail?: any;
}

export async function uploadFile(file: File) {
    const token = getToken();
    const formData = new FormData();
    formData.append("files", file);

    try {
        const response = await fetch(`${STRAPI_URL}/api/upload`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Failed to upload file");
        }

        return data[0]; // Strapi returns an array of uploaded files
    } catch (error) {
        throw error;
    }
}

export async function getProducts(workspaceId: number | string) {
    const token = getToken();
    try {
        const response = await fetch(`${STRAPI_URL}/api/products?filters[workspace][id][$eq]=${workspaceId}&populate=*`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Failed to fetch products");
        }

        return data.data;
    } catch (error) {
        throw error;
    }
}

export async function createProduct(productData: ProductData, workspaceId: number | string) {
    const token = getToken();
    try {
        const response = await fetch(`${STRAPI_URL}/api/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                data: {
                    ...productData,
                    workspace: workspaceId,
                },
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Failed to create product");
        }

        return data.data;
    } catch (error) {
        throw error;
    }
}

export async function updateProduct(productId: number | string, productData: ProductData) {
    const token = getToken();
    try {
        const response = await fetch(`${STRAPI_URL}/api/products/${productId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                data: productData,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Failed to update product");
        }

        return data.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteProduct(productId: number | string) {
    const token = getToken();
    try {
        const response = await fetch(`${STRAPI_URL}/api/products/${productId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Failed to delete product");
        }

        return data.data;
    } catch (error) {
        throw error;
    }
}
