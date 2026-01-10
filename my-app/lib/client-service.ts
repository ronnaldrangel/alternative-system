
import { STRAPI_URL, getToken } from "./auth-service";

export interface ClientData {
    full_name: string;
    phone?: string;
    email?: string;
    date_birth?: string;
    dni?: number;
    country?: string;
    type?: "Cliente" | "Proveedor" | "Cliente/Proveedor";
    type_dni?: string;
}

export async function getClients(workspaceId: number | string) {
    const token = getToken();
    try {
        // filter by workspace relation
        const response = await fetch(`${STRAPI_URL}/api/clients?filters[workspace][id][$eq]=${workspaceId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Failed to fetch clients");
        }

        return data.data;
    } catch (error) {
        throw error;
    }
}

export async function createClient(clientData: ClientData, workspaceId: number | string) {
    const token = getToken();
    try {
        const response = await fetch(`${STRAPI_URL}/api/clients`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                data: {
                    ...clientData,
                    workspace: workspaceId,
                },
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Failed to create client");
        }

        return data.data;
    } catch (error) {
        throw error;
    }
}

export async function updateClient(clientId: number | string, clientData: ClientData) {
    const token = getToken();
    try {
        const response = await fetch(`${STRAPI_URL}/api/clients/${clientId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                data: clientData,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Failed to update client");
        }

        return data.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteClient(clientId: number | string) {
    const token = getToken();
    try {
        const response = await fetch(`${STRAPI_URL}/api/clients/${clientId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Failed to delete client");
        }

        return data.data;
    } catch (error) {
        throw error;
    }
}
