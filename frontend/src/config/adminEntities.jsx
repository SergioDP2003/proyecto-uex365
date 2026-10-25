import UserSection from "../components/entities/UserSection";
import EventSection from "../components/entities/EventSection";
import ExchangeProductSection from "../components/entities/ExchangeProductSection";
import TransactionSection from "../components/entities/TransactionSection";
import CategorySection from "../components/entities/CategorySection";

import { getAllUsers, getUserById, createUser, updateUser, deleteUser, getAllStates } from "../services/user_services";
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent, getAllEventCategories } from "../services/event_services";
import { getAllExchangeProducts, getExchangeProductById, createExchangeProduct, updateExchangeProduct, deleteExchangeProduct } from "../services/exchange_services";
import { getAllTransactions, getTransactionById, createTransaction, updateTransaction, deleteTransaction } from "../services/transaction_services";
import { getOptionById, createOption, updateOption, deleteOption } from "../services/option_services";
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from "../services/category_service";

const textContains = (value, searchTerm) => String(value || "").toLowerCase().includes(searchTerm.toLowerCase());
const mapSelectOptions = (items, labelBuilder = (item) => item.name) =>
  (items || []).map((item) => ({ value: item.id, label: labelBuilder(item) }));

export const adminEntities = {
  users: {
    SectionComponent: UserSection,
    idParam: "id",
    listTitle: "Gestión de Usuarios",
    createTitle: () => "Crear Nuevo Usuario",
    editTitle: (id) => `Editar Usuario #${id}`,
    deleteTitle: "¿Eliminar Usuario?",
    createButtonLabel: "+ Nuevo Usuario",
    createButtonLabelForm: "Registrar Usuario",
    updateButtonLabel: "Actualizar Usuario",
    searchPlaceholder: "Buscar por nombre o email...",
    loadingText: "Cargando usuarios...",
    columns: ["ID", "Username", "Email", "Balance", "Staff", "Estado", "Acciones"],
    routes: {
      list: "/admin/users",
      create: "/admin/users/create",
      edit: (id) => `/admin/users/edit/${id}`,
      delete: (id) => `/admin/users/delete/${id}`
    },
    services: {
      getAll: getAllUsers,
      getById: getUserById,
      create: createUser,
      update: updateUser,
      remove: deleteUser
    },
    matchesSearch: (user, searchTerm) => textContains(user.username, searchTerm) || textContains(user.email, searchTerm),
    getInitialFormData: () => ({ username: "", password: "", email: "", first_name: "", last_name: "", is_staff: false, user_state: 1 }),
    loadOptions: async () => ({ states: await getAllStates() }),
    getFields: ({ states }, mode) => [
      { name: "username", label: "Nombre de Usuario", type: "text", required: true, placeholder: "Nombre de usuario" },
      ...(mode === "create" ? [{ name: "password", label: "Contraseña", type: "password", required: true, placeholder: "••••••••" }] : []),
      { name: "email", label: "Correo Electrónico", type: "email", required: true, placeholder: "correo@ejemplo.com" },
      { name: "first_name", label: "Nombre", type: "text", placeholder: "Ej: Juan" },
      { name: "last_name", label: "Apellidos", type: "text", placeholder: "Ej: Pérez" },
      { name: "user_state", label: mode === "create" ? "Estado Inicial" : "Estado", type: "select", options: mapSelectOptions(states) },
      { name: "is_staff", label: mode === "create" ? "Dar permisos de Administrador (Staff)" : "Es Administrador (Staff)", type: "checkbox" }
    ],
    mapEntityToForm: (user) => ({
      username: user.username || "",
      email: user.email || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      is_staff: Boolean(user.is_staff),
      user_state: user.user_state || ""
    }),
    mapFormToPayload: (formData) => formData,
    getDeleteMessage: (user) => <>¿Estás seguro de que deseas borrar permanentemente a:<br /><strong>{user?.username}</strong> ({user?.email})?</>,
    createErrorMessage: "Error al crear el usuario.",
    updateErrorMessage: "Error al actualizar el usuario.",
    updateSuccessMessage: "Usuario actualizado",
    deleteErrorMessage: "No se pudo eliminar al usuario."
  },

  events: {
    SectionComponent: EventSection,
    idParam: "id",
    listTitle: "Gestión de Eventos",
    createTitle: () => "Crear Nuevo Evento",
    editTitle: (id) => `Editar Evento #${id}`,
    deleteTitle: "¿Eliminar Evento?",
    createButtonLabel: "+ Nuevo Evento",
    createButtonLabelForm: "Crear Evento",
    updateButtonLabel: "Actualizar Evento",
    searchPlaceholder: "Buscar por nombre...",
    loadingText: "Cargando eventos...",
    columns: ["ID", "Evento", "Descripción", "Fecha Creación", "Fecha Cierre", "Fecha Resolución", "Categoría", "Estado", "Acciones"],
    routes: {
      list: "/admin/events",
      create: "/admin/events/create",
      detail: (id) => `/admin/events/${id}/detail`,
      edit: (id) => `/admin/events/edit/${id}`,
      delete: (id) => `/admin/events/delete/${id}`
    },
    services: {
      getAll: getAllEvents,
      getById: getEventById,
      create: createEvent,
      update: updateEvent,
      remove: deleteEvent
    },
    matchesSearch: (event, searchTerm) => textContains(event.name, searchTerm),
    getInitialFormData: () => ({ name: "", description: "", closing_date: "", event_category: "" }),
    loadOptions: async () => ({ categories: await getAllEventCategories() }),
    getFields: ({ categories }) => [
      { name: "name", label: "Nombre del Evento", type: "text", required: true, placeholder: "Ej: Final Champions League 2026" },
      { name: "event_category", label: "Categoría del Evento", type: "select", required: true, placeholder: "Selecciona una categoría...", options: mapSelectOptions(categories) },
      { name: "closing_date", label: "Fecha y Hora de Cierre", type: "datetime-local", required: true },
      { name: "description", label: "Descripción", type: "textarea", required: true, placeholder: "Detalles sobre el evento..." }
    ],
    mapEntityToForm: (event) => ({
      name: event.name || "",
      description: event.description || "",
      closing_date: event.closing_date ? event.closing_date.substring(0, 16) : "",
      event_category: event.event_category?.id || event.event_category || ""
    }),
    mapFormToPayload: (formData) => formData,
    getDeleteMessage: (_event, params) => <>¿Estás seguro de que deseas borrar permanentemente el evento con ID <strong>{params.id}</strong>?</>,
    createErrorMessage: "Error al crear el evento. Revisa los datos.",
    updateErrorMessage: "Error al actualizar el evento.",
    updateSuccessMessage: "Evento actualizado correctamente",
    deleteErrorMessage: "Error al eliminar el evento."
  },

  exchangeProducts: {
    SectionComponent: ExchangeProductSection,
    idParam: "id",
    listTitle: "Gestión de Productos Canjeables",
    createTitle: () => "Crear Nuevo Producto de Canje",
    editTitle: (id) => `Editar Producto #${id}`,
    deleteTitle: "¿Eliminar Producto?",
    createButtonLabel: "+ Nuevo Producto",
    createButtonLabelForm: "Crear Producto",
    updateButtonLabel: "Actualizar Producto",
    searchPlaceholder: "Buscar por nombre...",
    loadingText: "Cargando productos...",
    columns: ["ID", "Producto", "Descripción", "Precio", "Estado", "Acciones"],
    routes: {
      list: "/admin/exchange_products",
      create: "/admin/exchange_products/create",
      edit: (id) => `/admin/exchange_products/edit/${id}`,
      delete: (id) => `/admin/exchange_products/delete/${id}`
    },
    services: {
      getAll: getAllExchangeProducts,
      getById: getExchangeProductById,
      create: createExchangeProduct,
      update: updateExchangeProduct,
      remove: deleteExchangeProduct
    },
    matchesSearch: (product, searchTerm) => textContains(product.name, searchTerm),
    getInitialFormData: () => ({ name: "", description: "", price: "", is_active: false }),
    getFields: () => [
      { name: "name", label: "Nombre del Producto", type: "text", required: true, placeholder: "Ej: Camiseta Oficial" },
      { name: "price", label: "Precio (Puntos)", type: "number", step: "0.01", required: true, placeholder: "Ej: 1500" },
      { name: "description", label: "Descripción del Producto", type: "textarea", required: true, placeholder: "Detalla las características del producto..." },
      { name: "is_active", label: "Producto disponible para canje (Activo)", type: "checkbox" }
    ],
    mapEntityToForm: (product) => ({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      is_active: Boolean(product.is_active)
    }),
    mapFormToPayload: (formData) => ({ ...formData, price: parseFloat(formData.price) }),
    getDeleteMessage: (_product, params) => <>¿Estás seguro de que deseas borrar permanentemente el producto con ID <strong>{params.id}</strong>?</>,
    createErrorMessage: "Error al crear el producto. Revisa los datos.",
    updateErrorMessage: "Error al actualizar el producto.",
    updateSuccessMessage: "Producto actualizado correctamente",
    deleteErrorMessage: "Error al eliminar el producto."
  },

  categories: {
    SectionComponent: CategorySection,
    idParam: "id",
    listTitle: "Gestión de Categorías",
    createTitle: () => "Crear Nueva Categoría",
    editTitle: (id) => `Editar Categoría #${id}`,
    deleteTitle: "¿Eliminar Categoría?",
    createButtonLabel: "+ Nueva Categoría",
    createButtonLabelForm: "Crear Categoría",
    updateButtonLabel: "Actualizar Categoría",
    searchPlaceholder: "Buscar por nombre...",
    loadingText: "Cargando categorías...",
    columns: ["ID", "Categoría", "Acciones"],
    routes: {
      list: "/admin/categories",
      create: "/admin/categories/create",
      edit: (id) => `/admin/categories/edit/${id}`,
      delete: (id) => `/admin/categories/delete/${id}`
    },
    services: {
      getAll: getAllCategories,
      getById: getCategoryById,
      create: createCategory,
      update: updateCategory,
      remove: deleteCategory
    },
    matchesSearch: (category, searchTerm) => textContains(category.name, searchTerm),
    getInitialFormData: () => ({ name: "" }),
    getFields: () => [
      { name: "name", label: "Nombre de la Categoría", type: "text", required: true, placeholder: "Ej: Fútbol" }
    ],
    mapEntityToForm: (category) => ({ name: category.name || "" }),
    mapFormToPayload: (formData) => formData,
    getDeleteMessage: (category) => <>¿Estás seguro de que deseas borrar permanentemente la categoría <strong>{category?.name}</strong>?</>,
    createErrorMessage: "Error al crear la categoría.",
    updateErrorMessage: "Error al actualizar la categoría.",
    updateSuccessMessage: "Categoría actualizada correctamente",
    deleteErrorMessage: "No se pudo eliminar la categoría. Comprueba que no tenga eventos asociados."
  },

  transactions: {
    SectionComponent: TransactionSection,
    idParam: "id",
    listTitle: "Gestión de Transacciones",
    createTitle: () => "Crear Nueva Transacción",
    editTitle: (id) => `Editar Transacción #${id}`,
    deleteTitle: "¿Eliminar Transacción?",
    createButtonLabel: "+ Nueva Transacción",
    createButtonLabelForm: "Ejecutar Transacción",
    updateButtonLabel: "Actualizar Transacción",
    searchPlaceholder: "Buscar por usuario o descripción...",
    loadingText: "Cargando transacciones...",
    columns: ["ID", "Usuario", "Fecha", "Cantidad", "Descripción", "Tipo", "Acciones"],
    routes: {
      list: "/admin/transactions",
      create: "/admin/transactions/create",
      edit: (id) => `/admin/transactions/edit/${id}`,
      delete: (id) => `/admin/transactions/delete/${id}`
    },
    services: {
      getAll: getAllTransactions,
      getById: getTransactionById,
      create: createTransaction,
      update: updateTransaction,
      remove: deleteTransaction
    },
    matchesSearch: (transaction, searchTerm) => textContains(transaction.user_username || transaction.user, searchTerm) || textContains(transaction.description, searchTerm),
    getInitialFormData: () => ({ user: "", amount: "", description: "" }),
    loadOptions: async () => ({ users: await getAllUsers() }),
    getFields: ({ users }, mode) => [
      ...(mode === "create" ? [{ name: "user", label: "Usuario Destinatario", type: "select", required: true, placeholder: "Selecciona un usuario...", options: mapSelectOptions(users, (user) => `${user.username} (${user.email})`) }] : []),
      ...(mode === "create" ? [{ name: "amount", label: "Cantidad (Puntos)", type: "number", step: "0.01", required: true, placeholder: "Ej: 50.00" }] : []),
      { name: "description", label: "Descripción / Motivo", type: "textarea", required: true, placeholder: "Escribe el motivo de la transacción..." }
    ],
    mapEntityToForm: (transaction) => ({ description: transaction.description || "" }),
    mapFormToPayload: (formData) => ({ ...formData, amount: formData.amount !== "" ? parseFloat(formData.amount) : undefined }),
    getDeleteMessage: (_transaction, params) => <>¿Estás seguro de que deseas borrar permanentemente la transacción con ID <strong>{params.id}</strong>?</>,
    createErrorMessage: "Error al crear la transacción. Revisa los datos.",
    updateErrorMessage: "Error al actualizar la transacción.",
    updateSuccessMessage: "Transacción actualizada correctamente",
    deleteErrorMessage: "Error al eliminar la transacción."
  },

  options: {
    idParam: "option_id",
    createTitle: () => "Crear Nueva Opción de Apuesta",
    editTitle: (id) => `Editar Opción #${id}`,
    deleteTitle: "¿Eliminar Opción?",
    createButtonLabelForm: "Crear Opción",
    updateButtonLabel: "Actualizar Opción",
    services: {
      getById: getOptionById,
      create: createOption,
      update: updateOption,
      remove: deleteOption
    },
    getCancelPath: (params) => `/admin/events/${params.id}/detail`,
    getInitialFormData: () => ({ name: "", cuote: "", event: "" }),
    getFields: () => [
      { name: "name", label: "Nombre de la Opción", type: "text", required: true, placeholder: "Ej: Gana el equipo local" },
      { name: "cuote", label: "Cuota", type: "number", step: "0.01", required: true, placeholder: "Ej: 1.75" }
    ],
    mapEntityToForm: (option) => ({ name: option.name || "", cuote: option.cuote || "", event: option.event || "" }),
    mapFormToPayload: (formData, params) => ({ ...formData, cuote: parseFloat(formData.cuote), event: params.id }),
    getDeleteMessage: (_option, params) => <>¿Estás seguro de que deseas borrar permanentemente la opción con ID <strong>{params.option_id}</strong>?</>,
    createErrorMessage: "Error al crear la opción. Revisa los datos.",
    updateErrorMessage: "Error al actualizar la opción.",
    updateSuccessMessage: "Opción actualizada correctamente",
    deleteErrorMessage: "Error al eliminar la opción."
  }
};
