import { STRAPI_URL, getToken } from "./auth-service";

export async function getWorkspaces() {
    const token = getToken();
    try {
        const response = await fetch(`${STRAPI_URL}/api/workspaces`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Failed to fetch workspaces");
        }

        return data.data; // Strapi returns data in a 'data' property usually
    } catch (error) {
        throw error;
    }
}

export async function createWorkspace(name: string) {
    const token = getToken();
    try {
        const response = await fetch(`${STRAPI_URL}/api/workspaces`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                data: {
                    name,
                },
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Strapi error handling
            throw new Error(data.error?.message || "Failed to create workspace");
        }

        return data.data;
    } catch (error) {
        throw error;
    }
}

export function getSelectedWorkspace() {
    if (typeof window === "undefined") return null;
    const ws = localStorage.getItem("selectedWorkspace");
    return ws ? JSON.parse(ws) : null;
}

export function setSelectedWorkspace(workspace: any) {
    if (typeof window === "undefined") return;
    if (workspace) {
        localStorage.setItem("selectedWorkspace", JSON.stringify(workspace));
    } else {
        localStorage.removeItem("selectedWorkspace");
    }
}
