import { authFetch, checkAuth } from "./authService";

export async function getAllUsers() {
  checkAuth(); 
  const res = await authFetch(`/user/`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Error cargando eventos");
  }

  return await res.json();
}

export async function getUserById(userId) {
  checkAuth();
  const res = await authFetch(`/user/${userId}/`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Error cargando usuario");
  }

  return await res.json();
}

export async function updateUser(userId, userData) {
  checkAuth();
  
  // 👈 Crear una copia limpia del payload
  const cleanPayload = { ...userData };
  
  // 👈 Eliminar password si está vacío, es null o undefined
  if (cleanPayload.password === undefined || 
      cleanPayload.password === null || 
      cleanPayload.password === '') {
    delete cleanPayload.password;
    console.log("✅ Contraseña eliminada del payload (estaba vacía)");
  }
  
  // 👈 También eliminar confirm_password si existe (no debe ir al backend)
  if (cleanPayload.confirm_password !== undefined) {
    delete cleanPayload.confirm_password;
  }
  
  console.log("Payload limpio para enviar:", cleanPayload);
  
  const res = await authFetch(`/user/${userId}/`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cleanPayload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Error actualizando usuario");
  }

  return await res.json();
}
export async function createUser(userData) {
  checkAuth();
  const res = await authFetch(`/user/`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Error creando usuario");
  }

  return await res.json();
}

export async function updateUserStatus(userId, userData) {
  checkAuth();
  const res = await authFetch(`/user/${userId}/`, {
    method: "PATCH",
    body: JSON.stringify({
      user_state: userData,
    }),
  });

  if (!res.ok) {
    throw new Error("Error actualizando usuario");
  }

  return await res.json();
}

export async function updateUserGroup(userId, userGroup) {
  checkAuth();
  const res = await authFetch(`/user/${userId}/`, {
    method: "PATCH",
    body: JSON.stringify({
      groups: userGroup,
    }),
  });

  if (!res.ok) {
    throw new Error("Error actualizando usuario");
  }

  return await res.json();
}

export async function updateUserBalance(userId, newBalance) {
  checkAuth();
  const res = await authFetch(`/user/${userId}/`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      balance: newBalance,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Error actualizando balance");
  }

  return await res.json();
}



export async function deleteUser(userId) {
  checkAuth();
  const res = await authFetch(`/user/${userId}/`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Error eliminando usuario");
  }

  return true;
}

export const getAllStates = async () => {
    const response = await authFetch('user_state/');
    return response.ok ? await response.json() : [];
};