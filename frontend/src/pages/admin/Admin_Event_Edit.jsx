import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, updateEvent, getAllEventCategories } from "../../services/event_services";
import AdminForm from "../../components/admin/AdminForm";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getEventById(id), getAllEventCategories()]).then(([eventData, cats]) => {
      if (eventData) {
        setInitialData({
          name: eventData.name,
          description: eventData.description,
          closing_date: eventData.closing_date?.substring(0, 16) || "",
          event_category: eventData.event_category?.id || ""
        });
      }
      setCategories(cats);
      setLoading(false);
    });
  }, [id]);

  const fields = [
    { name: "name", label: "Nombre", type: "text", required: true },
    { name: "description", label: "Descripción", type: "textarea", required: true },
    { name: "closing_date", label: "Fecha de Cierre", type: "datetime-local", required: true },
    {
      name: "event_category",
      label: "Categoría",
      type: "select",
      options: [
        { value: "", label: "Selecciona..." },
        ...categories.map(cat => ({ value: cat.id, label: cat.name }))
      ]
    }
  ];

  const handleSubmit = async (formData) => {
    const success = await updateEvent(id, formData);
    if (success) navigate("/admin/events");
    else alert("Error al actualizar");
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <AdminForm
      title={`Editar Evento #${id}`}
      fields={fields}
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/admin/events")}
      submitText="Actualizar Evento"
    />
  );
}