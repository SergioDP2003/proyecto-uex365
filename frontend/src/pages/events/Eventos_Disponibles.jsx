import { useEffect, useState } from "react";
import { getAvailableEvents } from "../../services/event_services";
import { Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import "../../styles/AvailableEvents.css";

export default function AvailableEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getAvailableEvents();
      setEvents(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="events-page"><p className="events-loading">Cargando eventos...</p></div>;

  return (
    <div className="events-page">
      <Header />
      <div className="events-content">
        <h1 className="events-title">Eventos disponibles</h1>

        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <Link to={`/available_events/${event.id}`} className="event-card-link">
                <h3 className="event-card-name">{event.name}</h3>
              </Link>
              <p className="event-card-desc">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}