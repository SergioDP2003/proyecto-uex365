import { authFetch } from "./authService";

export const getBetFromUser = async (user_id) => {
    try {
        const response = await authFetch(`bet/user/${user_id}`); 
        if (response.ok) {
            return await response.json();
        }
        return [];
    } catch (error) {
        console.error("Error al obtener apuestas:", error);
        return [];
    }
};