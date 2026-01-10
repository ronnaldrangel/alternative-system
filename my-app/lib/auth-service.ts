export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function loginUser(identifier, password) {
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

export async function registerUser(username, email, password) {
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

export async function forgotPassword(email) {
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

export async function resetPassword(code, password, passwordConfirmation) {
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
