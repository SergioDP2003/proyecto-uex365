import { useEffect, useState } from "react";
import { getAllEvents } from "../../services/event_services";
import DataTable from "../../components/admin/DataTable";
import { useNavigate } from "react-router-dom";

export default function GestionEvent() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    const data = await getAllEvents();
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Evento", className: "user-name" },
    { key: "description", label: "Descripción" },
    { key: "creation_date", label: "Fecha Creación" },
    { key: "closing_date", label: "Fecha Cierre" },
    { key: "resolution_date", label: "Fecha Resolución" },
    { key: "event_category", label: "Categoría", render: (val) => val?.name || "Sin categoría" },
    { key: "event_state", label: "Estado", render: (val) => <span className="state-text">{val?.name || "Sin estado"}</span> }
  ];

  return (
    <DataTable
      title="Gestión de Eventos"
      columns={columns}
      data={events}
      loading={loading}
      onRefresh={fetchEvents}
      onNew={() => navigate("/admin/events/create")}
      onEdit={(id) => navigate(`/admin/events/edit/${id}`)}
      onDelete={(id) => navigate(`/admin/events/delete/${id}`)}
      searchFields={["name", "description"]}
      emptyMessage="No hay eventos disponibles."
    />
  );
}