import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getMe } from '../../services/authService';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import "../../styles/Admin.css";

function HomeAdmin() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => { const loadUser = async () => { const data = await getMe(); setUserData(data); }; loadUser(); }, []);

  const adminSections = [
    { title: "Gestionar Usuarios", desc: "Administra los perfiles, saldos, permisos y estados de cuenta de los usuarios.", path: "/admin/users", icon: "👥" },
    { title: "Gestionar Eventos", desc: "Crea, edita o finaliza los eventos de apuestas y sus cuotas en tiempo real.", path: "/admin/events", icon: "🏆" },
    { title: "Gestionar Categorías", desc: "Crea, edita o elimina las categorías usadas para clasificar los eventos.", path: "/admin/categories", icon: "🏷️" },
    { title: "Gestionar Productos Canjeables", desc: "Gestiona el inventario de la tienda, precios en puntos y stock disponible.", path: "/admin/exchange_products", icon: "🎁" },
    { title: "Gestionar Transacciones", desc: "Gestiona transacciones de los usuarios, ajustar puntos y ver movimientos", path: "/admin/transactions", icon: "💵" }
  ];

  return (
    <div className="admin-page">
      <Header />
      <main className="admin-content">
        <div className="admin-header-section">
          <div className="admin-status-badge">Panel de Control</div>
          <h1 className="admin-title">Admin Center</h1>
          <p className="admin-subtitle">Selecciona una sección para gestionar la plataforma</p>
        </div>
        <div className="admin-grid">
          {adminSections.map((section, index) => (
            <div key={index} className="admin-card">
              <div className="admin-card-icon">{section.icon}</div>
              <h2 className="admin-card-title">{section.title}</h2>
              <p className="admin-card-desc">{section.desc}</p>
              <button className="admin-card-btn" onClick={() => navigate(section.path)}>Ir</button>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default HomeAdmin;