import { authFetch, checkAuth } from "./authService";

export const getAllCategories = async () => {
  checkAuth();
  const response = await authFetch("event_category/", { method: "GET" });
  if (!response.ok) throw new Error("Error cargando categorías");
  return await response.json();
};

export const getCategoryById = async (id) => {
  checkAuth();
  const response = await authFetch(`event_category/${id}/`, { method: "GET" });
  if (!response.ok) throw new Error("Error cargando categoría");
  return await response.json();
};

export const createCategory = async (categoryData) => {
  checkAuth();
  const response = await authFetch("event_category/", {
    method: "POST",
    body: JSON.stringify(categoryData),
  });
  return response.ok;
};

export const updateCategory = async (id, categoryData) => {
  checkAuth();
  const response = await authFetch(`event_category/${id}/`, {
    method: "PUT",
    body: JSON.stringify(categoryData),
  });
  return response.ok;
};

export const deleteCategory = async (id) => {
  checkAuth();
  const response = await authFetch(`event_category/${id}/`, { method: "DELETE" });
  return response.ok;
};
