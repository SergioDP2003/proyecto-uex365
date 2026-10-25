import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, deleteUser } from "../../services/user_services";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import "../../styles/Admin.css";

export default function DeleteUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getUserById(id).then(data => { setUser(data); setLoading(false); }); }, [id]);

  const confirmDelete = async () => {
    if (await deleteUser(id)) navigate("/admin/users");
    else alert("No se pudo eliminar al usuario.");
  };

  if (loading) return <div className="admin-page"><p className="admin-loading">Cargando...</p></div>;
  return (
    <div className="admin-page">
      <Header />
      <main className="admin-main-content">
        <div className="delete-confirm-card">
          <div className="warning-icon">⚠️</div>
          <h1 className="admin-title">¿Eliminar Usuario?</h1>
          <div className="confirm-message">¿Estás seguro de que deseas borrar permanentemente a:<br /><strong>{user?.username}</strong> ({user?.email})?</div>
          <p className="danger-note">Esta acción no se puede deshacer.</p>
          <div className="form-actions center">
            <button className="cancel-btn" onClick={() => navigate("/admin/users")}>No, Cancelar</button>
            <button className="delete-confirm-btn" onClick={confirmDelete}>Sí, Eliminar Permanentemente</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}