import { authFetch, checkAuth } from "./authService";

export const getAllEvents = async () => {
    try {
        const response = await authFetch('event/'); 
        if (response.ok) {
            return await response.json();
        }
        return [];
    } catch (error) {
        console.error("Error al obtener eventos:", error);
        return [];
    }
};

export const createEvent = async (eventData) => {
    try {
        const response = await authFetch('event/', {
            method: 'POST',
            body: JSON.stringify(eventData)
        });
        return response.ok;
    } catch (error) {
        console.error("Error al crear evento:", error);
        return false;
    }
};

export const getAllEventCategories = async () => {
    const response = await authFetch('event_category/');
    return response.ok ? await response.json() : [];
};

export const updateEvent = async (id, eventData) => {
    try {
        const response = await authFetch(`event/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(eventData)
        });
        return response.ok;
    } catch (error) {
        console.error("Error al actualizar evento:", error);
        return false;
    }
};

export const getEventById = async (id) => {
    const response = await authFetch(`event/${id}/`);
    return response.ok ? await response.json() : null;
};

export const deleteEvent = async (id) => {
    try {
        const response = await authFetch(`event/${id}/`, {
            method: 'DELETE'
        });
        return response.ok;
    } catch (error) {
        console.error("Error al eliminar el evento:", error);
        return false;
    }
};

export const openEvent = async (id) => {
    try {
        const response = await authFetch(`event/${id}/open/`, {
            method: 'POST'
        });
        return response;
    } catch (error) {
        console.error("Error al abrir el evento:", error);
        return false;
    }
};

export const forceCloseEvent = async (id) => {
    try {
        const response = await authFetch(`event/${id}/force_close/`, {
            method: 'POST'
        });
        return response;
    } catch (error) {
        console.error("Error al cerrar el evento:", error);
        return false;
    }
};

export const resolveEvent = async (id, data) => {
    try {
        const response = await authFetch(`event/${id}/resolve/`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        return response;
    } catch (error) {
        console.error("Error al cerrar el evento:", error);
        return false;
    }
};

export const cancelEvent = async (id) => {
    try {
        const response = await authFetch(`event/${id}/cancel/`, {
            method: 'POST'
        });
        return response;
    } catch (error) {
        console.error("Error al cancelar el evento:", error);
        return false;
    }
};

export async function getAvailableEvents() {
  checkAuth(); 
  const res = await authFetch(`event/available/`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Error cargando eventos");
  }

  return await res.json();
}

export async function getEventDetail(id) {
  checkAuth();
  const res = await authFetch(`event/${id}/detail/`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Error cargando evento");
  }

  return await res.json();
}