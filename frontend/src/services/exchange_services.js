import { authFetch, checkAuth } from "./authService";

export const getAllExchange = async () => {
    try {
        const response = await authFetch('exchange/'); 
        if (response.ok) {
            return await response.json();
        }
        return [];
    } catch (error) {
        console.error("Error al obtener canjes:", error);
        return [];
    }
};

export const createExchange = async (exchangeData) => {
    try {
        const response = await authFetch('exchange/', {
            method: 'POST',
            body: JSON.stringify(exchangeData)
        });
        return response.ok;
    } catch (error) {
        console.error("Error al crear canje:", error);
        return false;
    }
};

export const updateExchange = async (id, exchangeData) => {
    try {
        const response = await authFetch(`exchange/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(exchangeData)
        });
        return response.ok;
    } catch (error) {
        console.error("Error al actualizar canje:", error);
        return false;
    }
};

export const getExchangeById = async (id) => {
    const response = await authFetch(`exchange/${id}/`);
    return response.ok ? await response.json() : null;
};

export const deleteExchange = async (id) => {
    try {
        const response = await authFetch(`exchange/${id}/`, {
            method: 'DELETE'
        });
        return response.ok;
    } catch (error) {
        console.error("Error al eliminar el canje:", error);
        return false;
    }
};

export const getAllExchangeFromUser = async (userId) => {
    try {
        const response = await authFetch(`exchange/user/${userId}`); 
        if (response.ok) {
            return await response.json();
        }
        return [];
    } catch (error) {
        console.error("Error al obtener canjes de usuario:", error);
        return [];
    }
};

export const getAllExchangeProducts = async () => {
    try {
        const response = await authFetch('exchange_product/'); 
        if (response.ok) {
            return await response.json();
        }
        return [];
    } catch (error) {
        console.error("Error al obtener productos:", error);
        return [];
    }
};

export const getAvailableExchangeProducts = async () => {
    try {
        const response = await authFetch('exchange_product/available/'); 
        if (response.ok) {
            return await response.json();
        }
        return [];
    } catch (error) {
        console.error("Error al obtener productos de canjes:", error);
        return [];
    }
};

export const createExchangeProduct = async (exchangeProductData) => {
    try {
        const response = await authFetch('exchange_product/', {
            method: 'POST',
            body: JSON.stringify(exchangeProductData)
        });
        return response.ok;
    } catch (error) {
        console.error("Error al crear producto:", error);
        return false;
    }
};

export const updateExchangeProduct = async (id, exchangeProductData) => {
    try {
        const response = await authFetch(`exchange_product/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(exchangeProductData)
        });
        return response.ok;
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        return false;
    }
};

export const getExchangeProductById = async (id) => {
    const response = await authFetch(`exchange_product/${id}/`);
    return response.ok ? await response.json() : null;
};

export const deleteExchangeProduct = async (id) => {
    try {
        const response = await authFetch(`exchange_product/${id}/`, {
            method: 'DELETE'
        });
        return response.ok;
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        return false;
    }
};