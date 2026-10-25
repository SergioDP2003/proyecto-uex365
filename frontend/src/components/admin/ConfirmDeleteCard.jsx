import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminPageLayout from "./AdminPageLayout";

const ConfirmDeleteCard = ({
  title = "¿Eliminar?",
  message = "¿Estás seguro de que deseas borrar permanentemente este elemento?",
  fetchItem,
  onDelete,
  onCancel,
  itemLabelKey = "name"
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (fetchItem) {
      fetchItem(id).then(data => {
        setItem(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [id, fetchItem]);

  const handleDelete = async () => {
    const success = await onDelete(id);
    if (success) {
      onCancel ? onCancel() : navigate(-1);
    }
  };

  if (loading) return <AdminPageLayout><main className="admin-main-content"><p className="admin-loading">Cargando...</p></main></AdminPageLayout>;

  const displayName = item ? (item[itemLabelKey] || item.username || item.id) : "";

  return (
    <AdminPageLayout>
      <main className="admin-main-content">
        <div className="delete-confirm-card">
          <div className="warning-icon">⚠️</div>
          <h1 className="admin-title">{title}</h1>
          <div className="confirm-message">
            {message}
            {displayName && <><br /><strong>{displayName}</strong></>}
          </div>
          <p className="danger-note">Esta acción no se puede deshacer.</p>
          <div className="form-actions center">
            <button className="cancel-btn" onClick={() => onCancel ? onCancel() : navigate(-1)}>
              No, Cancelar
            </button>
            <button className="delete-confirm-btn" onClick={handleDelete}>
              Sí, Eliminar Permanentemente
            </button>
          </div>
        </div>
      </main>
    </AdminPageLayout>
  );
};

export default ConfirmDeleteCard;