import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useEffect, useState } from "react";
import { getAllExchangeProducts } from "../../services/exchange_services";
import "../../styles/Admin.css"; // CSS unificado
import { useNavigate } from "react-router-dom";

export default function GestionExchangeProduct() {
  const navigate = useNavigate();
  const [exchangeProducts, setExchangeProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchExchangeProducts();
  }, []);

  const fetchExchangeProducts = async () => {
    setLoading(true);
    const data = await getAllExchangeProducts();
    setExchangeProducts(data);
    setLoading(false);
  };

  const filteredExchangeProducts = exchangeProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page">
      <Header />
      <main className="admin-main-content">
        <div className="table-container-header">
          <h1 className="admin-title">Gestión de Productos</h1>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button className="back-btn" onClick={() => navigate("/admin/")}>
              Volver al Panel
            </button>
            <button className="refresh-btn" onClick={fetchExchangeProducts}>
              Actualizar
            </button>
            <button className="create-btn" onClick={() => navigate("/admin/exchange_products/create")}>
              + Nuevo Producto
            </button>
          </div>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="admin-table-wrapper">
          {loading ? (
            <p className="loading-text">Cargando productos...</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredExchangeProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td className="user-name">{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.price}</td>
                    <td>{product.is_active ? "Activo" : "Inactivo"}</td>
                    <td>
                      <div className="actions-container">
                        <button
                          className="action-btn edit"
                          onClick={() => navigate(`/admin/exchange_products/edit/${product.id}`)}
                        >
                          Editar
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => navigate(`/admin/exchange_products/delete/${product.id}`)}
                        >
                          Eliminar
                        </button>
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