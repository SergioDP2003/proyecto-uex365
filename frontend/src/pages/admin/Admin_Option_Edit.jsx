import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateOption, getOptionById } from "../../services/option_services";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import "../../styles/Admin.css"; // CSS unificado

export default function EditOption() {
  const { id, option_id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    cuote: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const optionData = await getOptionById(option_id);
      if (optionData) {
        setFormData({
          name: optionData.name,
          cuote: optionData.cuote
        });
      }
      setLoading(false);
    };
    loadData();
  }, [id, option_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await updateOption(option_id, formData);
    if (success) {
      alert("Opción actualizada correctamente");
      navigate(`/admin/events/${id}/detail`);
    } else {
      alert("Error al actualizar");
    }
  };

  if (loading) return <div className="admin-page"><p className="admin-loading">Cargando...</p></div>;

  return (
    <div className="admin-page">
      <Header />
      <main className="admin-main-content">
        <h1 className="admin-title">Editar Opción #{option_id}</h1>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre de la Opción (Resultado)</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Ej: Gana Local"
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
              placeholder="Ej: 1.50"
            />
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
              Cancelar
            </button>
            <button type="submit" className="submit-btn">
              Actualizar Opción
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}