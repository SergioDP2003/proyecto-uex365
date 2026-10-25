import { authFetch, checkAuth } from "./authService";

export const getAllOptions = async () => {
    try {
        const response = await authFetch('option/'); // El endpoint de tu UserViewSet
        if (response.ok) {
            return await response.json();
        }
        return [];
    } catch (error) {
        console.error("Error al obtener opciones:", error);
        return [];
    }
};

// Obtener un usuario por ID
export const getOptionById = async (id) => {
    const response = await authFetch(`option/${id}/`);
    return response.ok ? await response.json() : null;
};

// Actualizar usuario (PUT)
export const updateOption = async (id, optionData) => {
    try {
        const response = await authFetch(`option/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(optionData)
        });
        return response.ok;
    } catch (error) {
        console.error("Error al actualizar opcion:", error);
        return false;
    }
};

export const createOption = async (optionData) => {
    try {
        const response = await authFetch('option/', {
            method: 'POST',
            body: JSON.stringify(optionData)
        });
        return response.ok;
    } catch (error) {
        console.error("Error al crear opcion:", error);
        return false;
    }
};

export const deleteOption = async (id) => {
    try {
        const response = await authFetch(`option/${id}/`, {
            method: 'DELETE'
        });
        return response.ok;
    } catch (error) {
        console.error("Error al eliminar opcion:", error);
        return false;
    }
};