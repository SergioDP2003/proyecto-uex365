import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../services/user_services";
import "../../styles/Admin.css";
import { useNavigate } from "react-router-dom";

export default function GestionUser() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchUsers(); }, []);
  const fetchUsers = async () => { setLoading(true); const data = await getAllUsers(); setUsers(data); setLoading(false); };
  const filteredUsers = users.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="admin-page">
      <Header />
      <main className="admin-main-content">
        <div className="table-container-header">
          <h1 className="admin-title">Gestión de Usuarios</h1>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button className="back-btn" onClick={() => navigate("/admin/")}>Volver al Panel</button>
            <button className="refresh-btn" onClick={fetchUsers}>Actualizar</button>
            <button className="create-btn" onClick={() => navigate("/admin/users/create")}>+ Nuevo Usuario</button>
          </div>
        </div>
        <div className="search-bar"><input type="text" placeholder="Buscar por nombre o email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
        <div className="admin-table-wrapper">
          {loading ? <p className="loading-text">Cargando usuarios...</p> :
            <table className="admin-table">
              <thead><tr><th>ID</th><th>Username</th><th>Email</th><th>Balance</th><th>Staff</th><th>Estado</th><th>Acciones</th></tr></thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td><td className="user-name">{user.username}</td><td>{user.email}</td><td>{user.balance}</td>
                    <td><span className={`badge ${user.is_staff ? 'is-staff' : 'is-user'}`}>{user.is_staff ? "Admin" : "Usuario"}</span></td>
                    <td><span className="state-text">{user.user_state_name || "Sin estado"}</span></td>
                    <td><div className="actions-container">
                      <button className="action-btn edit" onClick={() => navigate(`/admin/users/edit/${user.id}`)}>Editar</button>
                      <button className="action-btn delete" onClick={() => navigate(`/admin/users/delete/${user.id}`)}>Eliminar</button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        </div>
      </main>
      <Footer />
    </div>
  );
}