import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUser, getAllStates } from "../../services/user_services";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import "../../styles/Admin.css";

export default function CreateUser() {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [formData, setFormData] = useState({
    username: "", password: "", email: "", first_name: "", last_name: "", is_staff: false, user_state: 1
  });

  useEffect(() => { getAllStates().then(setStates); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await createUser(formData);
    if (success) navigate("/admin/users");
    else alert("Error al crear el usuario.");
  };

  return (
    <div className="admin-page">
      <Header />
      <main className="admin-main-content">
        <h1 className="admin-title">Crear Nuevo Usuario</h1>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group"><label>Usuario</label><input type="text" required onChange={(e) => setFormData({...formData, username: e.target.value})} placeholder="Nombre de usuario" /></div>
            <div className="form-group"><label>Contraseña</label><input type="password" required onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Nombre</label><input type="text" onChange={(e) => setFormData({...formData, first_name: e.target.value})} placeholder="Ej: Juan" /></div>
            <div className="form-group"><label>Apellidos</label><input type="text" onChange={(e) => setFormData({...formData, last_name: e.target.value})} placeholder="Ej: Pérez" /></div>
          </div>
          <div className="form-group"><label>Correo Electrónico</label><input type="email" required onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="correo@ejemplo.com" /></div>
          <div className="form-group"><label>Estado Inicial</label><select value={formData.user_state} onChange={(e) => setFormData({...formData, user_state: e.target.value})}>{states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
          <div className="form-group checkbox-group"><label className="admin-checkbox-label"><input type="checkbox" checked={formData.is_staff} onChange={(e) => setFormData({...formData, is_staff: e.target.checked})} /> Dar permisos de Administrador (Staff)</label></div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate("/admin/users")}>Cancelar</button>
            <button type="submit" className="submit-btn">Registrar Usuario</button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}