import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAvailableEvents } from '../services/event_services';
import '../styles/HomeView.css';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const HomeView = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getAvailableEvents();
        // Solo mostramos los primeros 6 eventos para no saturar la portada
        setEvents(data.slice(0, 6));
        setError(null);
      } catch (err) {
        setError('No se pudieron cargar los eventos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Calcula la cuota más alta entre las opciones del evento
  const getBestOdds = (options) => {
    if (!options || options.length === 0) return null;
    return Math.max(...options.map(opt => opt.cuote));
  };

  // Formatea la fecha de cierre a un formato legible
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="home-container">
      <Header />

      <div className="home-content">
        <div className="welcome-msg">
          <h1>Eventos Destacados</h1>
          <p>Los eventos más candentes de la universidad. ¡Apuesta ya!</p>
        </div>

        {loading && (
          <div className="loading-events">Cargando eventos...</div>
        )}

        {error && !loading && (
          <div className="error-events">{error}</div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="empty-events">No hay eventos disponibles en este momento.</div>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="events-grid">
            {events.map(event => {
              const bestOdds = getBestOdds(event.options);
              // Estado del evento: 2 = activo (abierto), 3 = cerrado, 4 = cancelado
              const statusClass = event.event_state?.id === 2 ? 'active' : 
                                  event.event_state?.id === 3 ? 'closed' : 
                                  event.event_state?.id === 4 ? 'cancelled' : '';

              return (
                <div key={event.id} className="event-card">
                  <div className="event-card-header">
                    <span className="event-category">
                      {event.event_category?.name || 'Sin categoría'}
                    </span>
                    <span className={`event-status ${statusClass}`}>
                      {event.event_state?.name || 'Desconocido'}
                    </span>
                  </div>

                  <h3 className="event-title">{event.name}</h3>
                  <p className="event-desc">{event.description}</p>

                  <div className="event-footer">
                    <div className="event-closing">
                      Cierra: <strong>{formatDate(event.closing_date)}</strong>
                    </div>
                    {bestOdds && (
                      <span className="odds-badge">Cuota máx. {bestOdds}</span>
                    )}
                  </div>

                  <Link to={`/available_events/${event.id}`} style={{ textDecoration: 'none' }}>
                    <button 
                      className="bet-button"
                      disabled={event.event_state?.id !== 2}
                    >
                      {event.event_state?.id === 2 ? 'Apostar ahora' : 'Ver evento'}
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default HomeView;