import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createOption } from "../../services/option_services";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import "../../styles/Admin.css"; // CSS unificado

export default function CreateOption() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    cuote: "",
    event: id
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      cuote: parseFloat(formData.cuote),
    };
    const success = await createOption(dataToSend);
    if (success) {
      navigate(`/admin/events/${id}/detail`);
    } else {
      alert("Error al crear la opción. Revisa los datos.");
    }
  };

  return (
    <div className="admin-page">
      <Header />
      <main className="admin-main-content">
        <h1 className="admin-title">Crear Nueva Opción de Apuesta</h1>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre de la Opción (Resultado)</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Ej: Gana Local, Empate, Más de 2.5 goles..."
            />
          </div>
          <div className="form-group">
            <label>Cuota (Multiplicador)</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.cuote}
              onChange={(e) => setFormData({...formData, cuote: e.target.value})}
              placeholder="Ej: 1.85"
            />
          </div>
          <div className="form-group">
            <label>ID del Evento Asociado</label>
            <input
              type="text"
              disabled
              value={formData.event}
              className="input-disabled"
            />
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate(`/admin/events/${id}/detail/`)}>
              Cancelar
            </button>
            <button type="submit" className="submit-btn">
              Crear Opción
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}