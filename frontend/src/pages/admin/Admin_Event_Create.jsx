import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent, getAllEventCategories } from "../../services/event_services";
import AdminForm from "../../components/admin/AdminForm";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => { getAllEventCategories().then(setCategories); }, []);

  const fields = [
    { name: "name", label: "Nombre del Evento", type: "text", required: true, placeholder: "Nombre del evento" },
    { name: "description", label: "Descripción", type: "textarea", required: true, placeholder: "Descripción" },
    { name: "closing_date", label: "Fecha y Hora de Cierre", type: "datetime-local", required: true },
    {
      name: "event_category",
      label: "Categoría",
      type: "select",
      options: [
        { value: "", label: "Selecciona una categoría..." },
        ...categories.map(cat => ({ value: cat.id, label: cat.name }))
      ]
    }
  ];

  const handleSubmit = async (formData) => {
    const success = await createEvent(formData);
    if (success) navigate("/admin/events");
    else alert("Error al crear evento");
  };

  return (
    <AdminForm
      title="Crear Nuevo Evento"
      fields={fields}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/admin/events")}
      submitText="Crear Evento"
    />
  );
}