export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function loginUser(identifier: string, password: string) {
    try {
        const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                identifier,
                password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Something went wrong");
        }

        // Save token to localStorage (or handles cookies elsewhere)
        if (data.jwt) {
            localStorage.setItem("jwt", data.jwt);
            localStorage.setItem("user", JSON.stringify(data.user));
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export async function registerUser(username: string, email: string, password: string) {
    try {
        const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                email,
                password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Something went wrong");
        }

        // Save token
        if (data.jwt) {
            localStorage.setItem("jwt", data.jwt);
            localStorage.setItem("user", JSON.stringify(data.user));
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export function logoutUser() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
}

export function getToken() {
    return localStorage.getItem("jwt");
}

export async function forgotPassword(email: string) {
    try {
        const response = await fetch(`${STRAPI_URL}/api/auth/forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Something went wrong");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export async function resetPassword(code: string, password: string, passwordConfirmation: string) {
    try {
        const response = await fetch(`${STRAPI_URL}/api/auth/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code,
                password,
                passwordConfirmation,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Something went wrong");
        }

        // Strapi returns a jwt and user on reset success too
        if (data.jwt) {
            localStorage.setItem("jwt", data.jwt);
            localStorage.setItem("user", JSON.stringify(data.user));
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export async function changePassword(currentPassword: string, password: string, passwordConfirmation: string) {
    const token = getToken();
    try {
        const response = await fetch(`${STRAPI_URL}/api/auth/change-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                currentPassword,
                password,
                passwordConfirmation,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Failed to change password");
        }

        // Strapi often returns a new token on password change
        if (data.jwt) {
            localStorage.setItem("jwt", data.jwt);
            localStorage.setItem("user", JSON.stringify(data.user));
        }

        return data;
    } catch (error) {
        throw error;
    }
}
