// frontend/src/services/transaction_services.js
import { authFetch, checkAuth } from "./authService";

// Obtener todas las transacciones
export async function getAllTransactions() {
  checkAuth();
  const res = await authFetch(`/transaction/`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Error cargando transacciones");
  }

  return await res.json();
}

// Obtener transacción por ID
export async function getTransactionById(transactionId) {
  checkAuth();
  const res = await authFetch(`/transaction/${transactionId}/`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Error cargando transacción");
  }

  return await res.json();
}

// Crear nueva transacción
export async function createTransaction(transactionData) {
  checkAuth();
  const res = await authFetch(`/transaction/`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transactionData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Error creando transacción");
  }

  return await res.json();
}

// Actualizar transacción
export async function updateTransaction(transactionId, transactionData) {
  checkAuth();
  const res = await authFetch(`/transaction/${transactionId}/`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transactionData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Error actualizando transacción");
  }

  return await res.json();
}

// Eliminar transacción
export async function deleteTransaction(transactionId) {
  checkAuth();
  const res = await authFetch(`/transaction/${transactionId}/`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Error eliminando transacción");
  }

  return true;
}

// Obtener usuarios (para el selector)
export async function getUsers() {
  checkAuth();
  const res = await authFetch(`/user/`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Error cargando usuarios");
  }

  return await res.json();
}

// Obtener tipos de transacción
export async function getTransactionTypes() {
  checkAuth();
  const res = await authFetch(`/transaction_type/`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Error cargando tipos de transacción");
  }

  return await res.json();
}