import { authFetch, checkAuth } from "./authService";

export async function addToCart(option) {
  checkAuth();
  const res = await authFetch(`cart/add/`, {
    method: "POST",
    body: JSON.stringify(option),
  });

  if (!res.ok) throw new Error("Error añadiendo al carrito");

  return await res.json();
}

export async function getCart() {
  checkAuth();
  const res = await authFetch(`cart/`, {
    method: "GET",
  });

  if (!res.ok) throw new Error("Error obteniendo carrito");

  return await res.json();
}

export async function checkoutCart(payload) {
  checkAuth();  
  const res = await authFetch(`cart/checkout/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Error en checkout");
  }

  return await res.json();
}

export async function clearCart() {
  checkAuth();
  const res = await authFetch(`cart/clear/`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Error limpiando carrito");

  return await res.json();
}

export async function removeOptionFromBet(betId, optionId) {
  checkAuth();
  const res = await authFetch(`cart/bet/${betId}/option/${optionId}/`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Error eliminando opción");

  return await res.json();
}

export async function addOptionToBet(bet_cart_id, option_id) {
  checkAuth();
  const res = await authFetch(`cart/add-option/`, {
    method: "POST",
    body: JSON.stringify({
      bet_cart_id: bet_cart_id,
      option_id: option_id,
    }),
  });

  if (!res.ok) {
    throw new Error("Error añadiendo opción a la apuesta");
  }

  return await res.json();
}