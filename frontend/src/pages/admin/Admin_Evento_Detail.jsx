import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, openEvent, forceCloseEvent, cancelEvent } from "../../services/event_services";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import "../../styles/Admin.css"; 

export default function DetailEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEventData();
  }, [id]);

  const loadEventData = async () => {
    setLoading(true);
    const data = await getEventById(id);
    setEvent(data);
    setLoading(false);
  };

  const handleActivate = async () => {
    if (window.confirm("¿Estás seguro de que quieres abrir este evento al público?")) {
      const response = await openEvent(id);
      const data = await response.json();
      if (response.ok) {
        alert("Evento abierto correctamente");
        loadEventData(); // Recargamos para ver el cambio de estado
      } else {
        alert(data.error || "Error al abrir el evento");
      }
    }
  };

  const handleForceClose = async () => {
    if (window.confirm("¿Estás seguro de que quieres cerrar este evento al público?")) {
      const response = await forceCloseEvent(id);
      const data = await response.json();
      if (response.ok) {
        alert("Evento cerrado correctamente");
        loadEventData(); 
      } else {
        alert(data.error || "Error al cerrar el evento");
      }
    }
  };

  const handleCancel = async () => {
    if (window.confirm("¿Estás seguro de que quieres cancelar este evento?")) {
      const response = await cancelEvent(id);
      const data = await response.json();
      if (response.ok) {
        alert("Evento cancelado correctamente");
        loadEventData(); 
      } else {
        alert(data.error || "Error al cerrar el evento");
      }
    }
  };

  if (loading) return <div className="admin-page"><p>Cargando detalles...</p></div>;
  if (!event) return <div className="admin-page"><p>Evento no encontrado.</p></div>;

  return (
    <div className="admin-page">
      <Header />
      <main className="admin-main-content">
        
        {/* Bloque de Información del Evento */}
        <section className="event-info-section">
          <div className="table-container-header">
            <h1 className="admin-title">Detalles: {event.name}</h1>
            <button className="refresh-btn" onClick={() => navigate("/admin/events")}>
              Volver al listado
            </button>
          </div>
          
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
                <button className="activate-event-btn" onClick={handleActivate}>
                    🔓 Abrir Evento al Público
                </button>
            )}
            {event.event_state?.id === 2 && (
                <button className="activate-event-btn" onClick={handleForceClose}>
                    🔓 Forzar Cierre de Evento
                </button>
            )}
            {event.event_state?.id === 3 && (
              <button 
                className="activate-event-btn" 
                onClick={() => navigate(`/admin/events/${id}/resolve`)}
              >
                🏆 Resolver Evento
              </button>
            )}
            {(event.event_state?.id === 2 || event.event_state?.id === 3) && (
                <button className="activate-event-btn" onClick={handleCancel}>
                    🔓 Cancelar Evento
                </button>
            )}
        </div>

        <hr className="admin-divider" />

        {/* Bloque de Gestión de Opciones (Bets/Options) */}
        <section className="options-management-section">
          <div className="table-container-header">
            <h2 className="admin-subtitle">Opciones de Apuesta</h2>
            <button 
              className="create-btn"
              onClick={() => navigate(`/admin/events/${id}/options/create`)}
            >
              + Nueva Opción
            </button>
          </div>

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
                  event.options.map((opt) => (
                    <tr key={opt.id}>
                      <td>{opt.id}</td>
                      <td className="user-name">{opt.name}</td>
                      <td><strong>{opt.cuote}</strong></td>
                      <td>{opt.is_winner ? "✅ Ganadora" : "❌ No Ganadora"}</td>
                      <td>
                        <button 
                          className="action-btn edit"
                          onClick={() => navigate(`/admin/events/${id}/options/edit/${opt.id}`)}
                        >
                          Editar
                        </button>
                        <button 
                          className="action-btn delete"
                          onClick={() => navigate(`/admin/events/${id}/options/delete/${opt.id}`)}
                        >
                          Borrar
                        </button>
                      </td>
                    </tr>
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
      </main>
      <Footer />
    </div>
  );
}