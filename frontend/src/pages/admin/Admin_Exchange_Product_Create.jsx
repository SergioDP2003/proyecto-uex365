import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createExchangeProduct } from "../../services/exchange_services";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import "../../styles/Admin.css"; // CSS unificado

export default function CreateExchangeProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    is_active: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      amount: parseFloat(formData.price)
    };
    const success = await createExchangeProduct(dataToSend);
    if (success) {
      navigate("/admin/exchange_products");
    } else {
      alert("Error al crear el producto. Revisa los datos.");
    }
  };

  return (
    <div className="admin-page">
      <Header />
      <main className="admin-main-content">
        <h1 className="admin-title">Crear Nuevo Producto de Canje</h1>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre del Producto</label>
            <input type="text" required value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Ej: Camiseta Oficial" />
          </div>
          <div className="form-group">
            <label>Precio (Puntos)</label>
            <input type="number" step="0.01" required value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              placeholder="Ej: 1500" />
          </div>
          <div className="form-group">
            <label>Descripción del Producto</label>
            <textarea required rows="4" value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Detalla las características del producto..." />
          </div>
          <div className="form-group checkbox-group">
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <input type="checkbox" checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})} />
              Producto disponible para canje (Activo)
            </label>
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate("/admin/exchange_products")}>
              Cancelar
            </button>
            <button type="submit" className="submit-btn">
              Crear Producto
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}