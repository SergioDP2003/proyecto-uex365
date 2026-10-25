import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateEvent, getEventById, getAllEventCategories } from "../../services/event_services";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import "../../styles/Admin.css"; // CSS unificado

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventCategories, setEventCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    closing_date: "",
    event_category: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [eventData, categories] = await Promise.all([
        getEventById(id),
        getAllEventCategories()
      ]);
      if (categories) setEventCategories(categories);
      if (eventData) {
        const formattedDate = eventData.closing_date
          ? eventData.closing_date.substring(0, 16)
          : "";
        setFormData({
          name: eventData.name,
          description: eventData.description,
          closing_date: formattedDate,
          event_category: eventData.event_category.id
        });
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await updateEvent(id, formData);
    if (success) {
      alert("Evento actualizado correctamente");
      navigate("/admin/events");
    } else {
      alert("Error al actualizar");
    }
  };

  if (loading) return <div className="admin-page"><p className="admin-loading">Cargando...</p></div>;

  return (
    <div className="admin-page">
      <Header />
      <main className="admin-main-content">
        <h1 className="admin-title">Editar Evento #{id}</h1>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre del Evento</label>
            <input type="text" required value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Categoría del Evento</label>
            <select required value={formData.event_category}
              onChange={(e) => setFormData({...formData, event_category: e.target.value})}>
              <option value="">Selecciona una categoría...</option>
              {eventCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Fecha y Hora de Cierre</label>
            <input type="datetime-local" required value={formData.closing_date}
              onChange={(e) => setFormData({...formData, closing_date: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea rows="4" required value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate("/admin/events")}>
              Cancelar
            </button>
            <button type="submit" className="submit-btn">
              Actualizar Evento
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}