import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deleteOption } from "../../services/option_services";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import "../../styles/Admin.css"; // CSS unificado

export default function DeleteOption() {
  const { id, option_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [id, option_id]);

  const confirmDelete = async () => {
    const success = await deleteOption(option_id);
    if (success) {
      navigate(`/admin/events/${id}/detail`);
    } else {
      alert("No se pudo eliminar la opción.");
    }
  };

  if (loading) return <div className="admin-page"><p className="admin-loading">Cargando...</p></div>;

  return (
    <div className="admin-page">
      <Header />
      <main className="admin-main-content">
        <div className="delete-confirm-card">
          <div className="warning-icon">⚠️</div>
          <h1 className="admin-title">¿Eliminar Opción?</h1>
          <div className="confirm-message">
            ¿Estás seguro de que deseas borrar permanentemente esta opción?
          </div>
          <p className="danger-note">Esta acción no se puede deshacer.</p>
          <div className="form-actions center">
            <button className="cancel-btn" onClick={() => navigate(`/admin/events/${id}/detail`)}>
              No, Cancelar
            </button>
            <button className="delete-confirm-btn" onClick={confirmDelete}>
              Sí, Eliminar Permanentemente
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}