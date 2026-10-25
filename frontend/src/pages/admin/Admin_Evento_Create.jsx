import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent, getAllEventCategories } from "../../services/event_services";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import "../../styles/Admin.css";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [eventCategories, setEventCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    closing_date: "",
    event_category: ""
  });

  useEffect(() => {
    getAllEventCategories().then(setEventCategories);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Convertimos amount a número antes de enviar
    
    const success = await createEvent(formData);
    if (success) {
      navigate("/admin/events");
    } else {
      alert("Error al crear el evento. Revisa los datos.");
    }
  };

  return (
    <div className="admin-page">
      <Header />
      <main className="admin-main-content">
        <h1 className="admin-title">Crear Nuevo Evento</h1>
        
        <form className="admin-form" onSubmit={handleSubmit}>
          
          {/* Nombre del Evento */}
          <div className="form-group">
            <label>Nombre del Evento</label>
            <input 
              type="text" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              placeholder="Ej: Final Champions League 2026"
            />
          </div>

          {/* Categoría del Evento */}
          <div className="form-group">
            <label>Categoría</label>
            <select 
              required
              value={formData.event_category}
              onChange={(e) => setFormData({...formData, event_category: e.target.value})}
            >
              <option value="">Selecciona una categoría...</option>
              {eventCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha de Cierre */}
          <div className="form-group">
            <label>Fecha y Hora de Cierre</label>
            <input 
              type="datetime-local" 
              required 
              value={formData.closing_date}
              onChange={(e) => setFormData({...formData, closing_date: e.target.value})} 
            />
          </div>

          {/* Descripción */}
          <div className="form-group">
            <label>Descripción del Evento</label>
            <textarea 
              required
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Detalles sobre el evento..."
              style={{ 
                background: "#0a0a0a", 
                color: "white", 
                border: "1px solid #333", 
                padding: "12px", 
                borderRadius: "6px",
                resize: "none" 
              }}
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={() => navigate("/admin/events")}
            >
              Cancelar
            </button>
            <button type="submit" className="submit-btn">
              Crear Evento
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}