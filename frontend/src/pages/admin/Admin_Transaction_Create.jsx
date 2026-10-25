import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createTransaction } from "../../services/transaction_services";
import { getAllUsers } from "../../services/user_services";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import "../../styles/Admin.css"; // CSS unificado

export default function CreateTransaction() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    user: ""
  });

  useEffect(() => {
    getAllUsers().then(setUsers);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      amount: parseFloat(formData.amount)
    };
    const success = await createTransaction(dataToSend);
    if (success) {
      navigate("/admin/transactions");
    } else {
      alert("Error al crear la transacción. Revisa los datos.");
    }
  };

  return (
    <div className="admin-page">
      <Header />
      <main className="admin-main-content">
        <h1 className="admin-title">Crear Nueva Transacción</h1>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuario Destinatario</label>
            <select
              required
              value={formData.user}
              onChange={(e) => setFormData({...formData, user: e.target.value})}
            >
              <option value="">Selecciona un usuario...</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.username} ({u.email})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Cantidad (Puntos)</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              placeholder="Ej: 50.00"
            />
          </div>
          <div className="form-group">
            <label>Descripción / Motivo</label>
            <textarea
              required
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Escribe el motivo de la transacción..."
            />
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate("/admin/transactions")}>
              Cancelar
            </button>
            <button type="submit" className="submit-btn">
              Ejecutar Transacción
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}