import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateExchangeProduct, getExchangeProductById } from "../../services/exchange_services";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import "../../styles/Admin.css"; // CSS unificado

export default function EditExchangeProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    is_active: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const exchangeProductData = await getExchangeProductById(id);
      if (exchangeProductData) {
        setFormData({
          name: exchangeProductData.name,
          description: exchangeProductData.description,
          price: exchangeProductData.price,
          is_active: exchangeProductData.is_active
        });
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await updateExchangeProduct(id, formData);
    if (success) {
      alert("Producto actualizado correctamente");
      navigate("/admin/exchange_products");
    } else {
      alert("Error al actualizar");
    }
  };

  if (loading) return <div className="admin-page"><p className="admin-loading">Cargando...</p></div>;

  return (
    <div className="admin-page">
      <Header />
      <main className="admin-main-content">
        <h1 className="admin-title">Editar Producto #{id}</h1>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre del Producto</label>
            <input type="text" required value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Precio (Puntos)</label>
            <input type="number" step="0.01" required value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Descripción del Producto</label>
            <textarea rows="4" value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required />
          </div>
          <div className="form-group checkbox-group">
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <input type="checkbox" checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})} />
              Producto disponible (Activo)
            </label>
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate("/admin/exchange_products")}>
              Cancelar
            </button>
            <button type="submit" className="submit-btn">
              Actualizar Producto
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}