import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useEffect, useState } from "react";
import { getAllTransactions } from "../../services/transaction_services";
import "../../styles/Admin.css";
import { useNavigate } from "react-router-dom";

export default function GestionTransaction() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    const data = await getAllTransactions();
    setTransactions(data);
    setLoading(false);
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.user_username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page">
      <Header />
      <main className="admin-main-content">
        <div className="table-container-header">
          <h1 className="admin-title">Gestión de Transacciones</h1>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button className="back-btn" onClick={() => navigate("/admin/")}>Volver al Panel</button>
            <button className="refresh-btn" onClick={fetchTransactions}>Actualizar</button>
            <button className="create-btn" onClick={() => navigate("/admin/transactions/create")}>+ Nueva Transacción</button>
          </div>
        </div>

        <div className="search-bar">
          <input type="text" placeholder="Buscar por nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="admin-table-wrapper">
          {loading ? (
            <p className="loading-text">Cargando transacciones...</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th><th>Usuario</th><th>Fecha</th><th>Cantidad</th><th>Descripción</th><th>Tipo</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td className="user-name">{transaction.user_username}</td>
                    <td>{transaction.date}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.description}</td>
                    <td><span className="state-text">{transaction.transaction_type_name || "Sin tipo"}</span></td>
                    <td>
                      <div className="actions-container">
                        <button className="action-btn edit" onClick={() => navigate(`/admin/transactions/edit/${transaction.id}`)}>Editar</button>
                        <button className="action-btn delete" onClick={() => navigate(`/admin/transactions/delete/${transaction.id}`)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}