import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import OptionSection from "../../components/entities/OptionSection";
import { getEventById, openEvent, forceCloseEvent, cancelEvent } from "../../services/event_services";

export default function AdminEventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadEventData = async () => {
    setLoading(true);
    const data = await getEventById(id);
    setEvent(data);
    setLoading(false);
  };

  useEffect(() => {
    loadEventData();
  }, [id]);

  const runStateAction = async (message, action, successMessage, errorMessage) => {
    if (!window.confirm(message)) return;
    const response = await action(id);
    const data = await response.json();
    if (response.ok) {
      alert(successMessage);
      loadEventData();
    } else {
      alert(data.error || errorMessage);
    }
  };

  if (loading) return <div className="admin-page"><p>Cargando detalles...</p></div>;
  if (!event) return <div className="admin-page"><p>Evento no encontrado.</p></div>;

  return (
    <AdminLayout>
      <section className="event-info-section">
        <AdminPageHeader
          title={`Detalles: ${event.name}`}
          actions={<button className="refresh-btn" onClick={() => navigate("/admin/events")}>Volver al listado</button>}
        />

        <div className="detail-card">
          <p><strong>Descripción:</strong> {event.description}</p>
          <div className="detail-grid">
            <p><strong>Categoría:</strong> {event.event_category?.name}</p>
            <p><strong>Estado:</strong> {event.event_state?.name}</p>
            <p><strong>Fecha Cierre:</strong> {new Date(event.closing_date).toLocaleString()}</p>
          </div>
        </div>
      </section>

      <div className="admin-actions-bar">
        {event.event_state?.id === 1 && (
          <button
            className="activate-event-btn"
            onClick={() => runStateAction(
              "¿Estás seguro de que quieres abrir este evento al público?",
              openEvent,
              "Evento abierto correctamente",
              "Error al abrir el evento"
            )}
          >
            🔓 Abrir Evento al Público
          </button>
        )}

        {event.event_state?.id === 2 && (
          <button
            className="activate-event-btn"
            onClick={() => runStateAction(
              "¿Estás seguro de que quieres cerrar este evento al público?",
              forceCloseEvent,
              "Evento cerrado correctamente",
              "Error al cerrar el evento"
            )}
          >
            🔓 Forzar Cierre de Evento
          </button>
        )}

        {event.event_state?.id === 3 && (
          <button className="activate-event-btn" onClick={() => navigate(`/admin/events/${id}/resolve`)}>
            🏆 Resolver Evento
          </button>
        )}

        {(event.event_state?.id === 2 || event.event_state?.id === 3) && (
          <button
            className="activate-event-btn"
            onClick={() => runStateAction(
              "¿Estás seguro de que quieres cancelar este evento?",
              cancelEvent,
              "Evento cancelado correctamente",
              "Error al cancelar el evento"
            )}
          >
            🔓 Cancelar Evento
          </button>
        )}
      </div>

      <hr className="admin-divider" />

      <section className="options-management-section">
        <AdminPageHeader
          title="Opciones de Apuesta"
          actions={
            <button className="create-btn" onClick={() => navigate(`/admin/events/${id}/options/create`)}>
              + Nueva Opción
            </button>
          }
        />

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre de Opción</th>
                <th>Cuota</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {event.options && event.options.length > 0 ? (
                event.options.map((option) => (
                  <OptionSection
                    key={option.id}
                    entity={option}
                    onEdit={() => navigate(`/admin/events/${id}/options/edit/${option.id}`)}
                    onDelete={() => navigate(`/admin/events/${id}/options/delete/${option.id}`)}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    Este evento no tiene opciones creadas todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
