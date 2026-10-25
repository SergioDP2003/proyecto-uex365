import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "./AdminLayout";

export default function AdminDeletePage({ config }) {
  const params = useParams();
  const navigate = useNavigate();
  const id = params[config.idParam || "id"];
  const [entity, setEntity] = useState(null);
  const [loading, setLoading] = useState(Boolean(config.services.getById));

  useEffect(() => {
    const loadEntity = async () => {
      if (!config.services.getById) return;
      const data = await config.services.getById(id);
      setEntity(data);
      setLoading(false);
    };
    loadEntity();
  }, [id, config]);

  const cancelPath = config.getCancelPath ? config.getCancelPath(params) : config.routes.list;

  const confirmDelete = async () => {
    const success = await config.services.remove(id, params);
    if (success) navigate(cancelPath);
    else alert(config.deleteErrorMessage);
  };

  if (loading) {
    return <div className="admin-page"><p className="admin-loading">Cargando...</p></div>;
  }

  return (
    <AdminLayout>
      <div className="delete-confirm-card">
        <div className="warning-icon">⚠️</div>
        <h1 className="admin-title">{config.deleteTitle}</h1>
        <div className="confirm-message">
          {config.getDeleteMessage(entity, params)}
        </div>
        <p className="danger-note">Esta acción no se puede deshacer.</p>
        <div className="form-actions center">
          <button className="cancel-btn" onClick={() => navigate(cancelPath)}>No, Cancelar</button>
          <button className="delete-confirm-btn" onClick={confirmDelete}>Sí, Eliminar Permanentemente</button>
        </div>
      </div>
    </AdminLayout>
  );
}
