const API_URL = 'http://localhost:8000/';

export const loginUsuario = async (username, password) => {
    try {
        const response = await fetch(`${API_URL}api/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            return { success: true };
        } else {
            return { success: false, message: data.detail || 'Usuario o contraseña incorrectos' };
        }
    } catch (error) {
        console.error('Error en loginUser:', error);
        return { success: false, message: 'Error de conexión con el servidor' };
    }
};

export const registerUsuario = async (username, email, password) => {
    try {
        const response = await fetch(`${API_URL}api/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        if (response.status === 201) {
            return { success: true };
        } else {
            const errorMsg = Object.values(data)[0] || 'Error en el registro';
            return { success: false, message: errorMsg };
        }
    } catch (error) {
        console.error('Error en registerUser:', error);
        return { success: false, message: 'Error de conexión con el servidor' };
    }
};

async function refreshToken() {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) return null;

    try {
        const res = await fetch(`${API_URL}api/token/refresh/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh }),
        });

        if (!res.ok) return null;

        const data = await res.json();
        localStorage.setItem("access_token", data.access);
        return data.access;
    } catch (error) {
        console.error("Error al pedir nuevo token:", error);
        return null;
    }
}

export const authFetch = async (endpoint, options = {}) => {
    let token = localStorage.getItem("access_token");

    const fullUrl = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

    const makeRequest = (currentToken) => {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };
        if (currentToken) {
            headers['Authorization'] = `Bearer ${currentToken}`;
        }
        return fetch(fullUrl, { credentials: "include", ...options, headers });
    };

    let res = await makeRequest(token);

    if (res.status === 401) {
        console.log("TOKEN EXPIRADO intentando refresh...");
        const newToken = await refreshToken();

        if (!newToken) {
            console.log("REFRESH FALLO expulsando al usuario");
            await logoutUsuario();
            window.location.href = "/login";
            return res; 
        }

        res = await makeRequest(newToken);
    }

    return res;
};

export const logoutUsuario = async () => {
    const token = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");

    if (token && refresh) {
        try {
            await fetch(`${API_URL}api/logout/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ refresh: refresh }),
                credentials: "include",
            });
        } catch (error) {
            console.error('Error al avisar al servidor del logout:', error);
        }
    }

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("is_admin");
    localStorage.removeItem("username");
};

export const checkAuth = () => {
    if (!localStorage.getItem("access_token")) {
        window.location.href = "/";
        throw new Error("Usuario no autenticado. Redirigiendo a inicio...");
    }
};

export const googleLoginUsuario = async (googleToken) => {
    try {
        const response = await fetch(`${API_URL}api/google-login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: googleToken }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            return { success: true };
        } else {
            return { success: false, message: data.error || 'Error en autenticación con Google' };
        }
    } catch (error) {
        console.error('Error en googleLoginUsuario:', error);
        return { success: false, message: 'Error de conexión con el servidor' };
    }
};

export const getMe = async () => {
    try {
        const token = localStorage.getItem('access_token');
        if (!token) return null;

        const response = await authFetch(`/api/me/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error("Error al obtener el perfil:", error);
        return null;
    }
};