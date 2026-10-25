import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateTransaction, getTransactionById } from "../../services/transaction_services";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import "../../styles/Admin.css"; // CSS unificado

export default function EditTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const transactionData = await getTransactionById(id);
      if (transactionData) {
        setFormData({
          description: transactionData.description
        });
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await updateTransaction(id, formData);
    if (success) {
      alert("Transacción actualizada correctamente");
      navigate("/admin/transactions");
    } else {
      alert("Error al actualizar");
    }
  };

  if (loading) return <div className="admin-page"><p className="admin-loading">Cargando...</p></div>;

  return (
    <div className="admin-page">
      <Header />
      <main className="admin-main-content">
        <h1 className="admin-title">Editar Transacción #{id}</h1>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Descripción de la Transacción</label>
            <textarea
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Escribe el motivo o detalles de la transacción..."
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate("/admin/transactions")}>
              Cancelar
            </button>
            <button type="submit" className="submit-btn">
              Actualizar Transacción
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}