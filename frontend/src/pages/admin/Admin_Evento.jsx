import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useEffect, useState } from "react";
import { getAllEvents } from "../../services/event_services";
import "../../styles/Admin.css"; // CSS unificado
import { useNavigate } from "react-router-dom";

export default function GestionEvent() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const data = await getAllEvents();
    setEvents(data);
    setLoading(false);
  };

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page">
      <Header />
      <main className="admin-main-content">
        <div className="table-container-header">
          <h1 className="admin-title">Gestión de Eventos</h1>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button className="back-btn" onClick={() => navigate("/admin/")}>
              Volver al Panel
            </button>
            <button className="refresh-btn" onClick={fetchEvents}>
              Actualizar
            </button>
            <button className="create-btn" onClick={() => navigate("/admin/events/create")}>
              + Nuevo Evento
            </button>
          </div>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="admin-table-wrapper">
          {loading ? (
            <p className="loading-text">Cargando eventos...</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Evento</th>
                  <th>Descripción</th>
                  <th>Fecha Creación</th>
                  <th>Fecha Cierre</th>
                  <th>Fecha Resolución</th>
                  <th>Categoría</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id}>
                    <td>{event.id}</td>
                    <td className="user-name">{event.name}</td>
                    <td>{event.description}</td>
                    <td>{event.creation_date}</td>
                    <td>{event.closing_date}</td>
                    <td>{event.resolution_date}</td>
                    <td>
                      <span className="state-text">
                        {event.event_category?.name || "Sin categoría"}
                      </span>
                    </td>
                    <td>
                      <span className="state-text">
                        {event.event_state?.name || "Sin estado"}
                      </span>
                    </td>
                    <td>
                      <div className="actions-container">
                        <button
                          className="action-btn view"
                          onClick={() => navigate(`/admin/events/${event.id}/detail`)}
                        >
                          Ver
                        </button>
                        <button
                          className="action-btn edit"
                          onClick={() => navigate(`/admin/events/edit/${event.id}`)}
                        >
                          Editar
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => navigate(`/admin/events/delete/${event.id}`)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}