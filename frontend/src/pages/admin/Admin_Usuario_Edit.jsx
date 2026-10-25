import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser, getAllStates } from "../../services/user_services";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import "../../styles/Admin.css";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", first_name: "", last_name: "", is_staff: false, user_state: "" });
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [userData, statesData] = await Promise.all([getUserById(id), getAllStates()]);
      if (userData) setFormData({ username: userData.username, email: userData.email, first_name: userData.first_name || "", last_name: userData.last_name || "", is_staff: userData.is_staff, user_state: userData.user_state });
      setStates(statesData);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (await updateUser(id, formData)) { alert("Usuario actualizado"); navigate("/admin/users"); }
    else alert("Error al actualizar");
  };

  if (loading) return <div className="admin-page"><p className="admin-loading">Cargando...</p></div>;
  return (
    <div className="admin-page">
      <Header />
      <main className="admin-main-content">
        <h1 className="admin-title">Editar Usuario #{id}</h1>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group"><label>Nombre de Usuario</label><input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} /></div>
          <div className="form-group"><label>Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
          <div className="form-row">
            <div className="form-group"><label>Nombre</label><input type="text" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} /></div>
            <div className="form-group"><label>Apellidos</label><input type="text" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} /></div>
          </div>
          <div className="form-group"><label>Estado</label><select value={formData.user_state} onChange={(e) => setFormData({...formData, user_state: e.target.value})}>{states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
          <div className="form-group checkbox-group"><label className="admin-checkbox-label"><input type="checkbox" checked={formData.is_staff} onChange={(e) => setFormData({...formData, is_staff: e.target.checked})} /> Es Administrador (Staff)</label></div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate("/admin/users")}>Cancelar</button>
            <button type="submit" className="submit-btn">Actualizar Usuario</button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}