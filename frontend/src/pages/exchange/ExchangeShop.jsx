import { useEffect, useState } from "react";
import { getAvailableExchangeProducts, createExchange } from "../../services/exchange_services";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import "../../styles/ExchangeShop.css";
import { useNavigate } from "react-router-dom";

export default function ExchangeShop() {
  const navigate = useNavigate();
  const [exchangeProducts, setExchangeProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getAvailableExchangeProducts();
      setExchangeProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleBuy = async (productId) => {
    const user_id = localStorage.getItem("user_id");
    const success = await createExchange({
      user: user_id,
      exchange_product: productId,
    });
    if (success) {
      alert("Producto comprado correctamente");
      navigate("/exchange_shop");
    } else {
      alert("Error al comprar");
    }
  };

  if (loading)
    return (
      <div className="shop-page">
        <p className="shop-loading">Cargando productos...</p>
      </div>
    );

  return (
    <div className="shop-page">
      <Header />
      <div className="shop-content">
        <h1 className="shop-title">Tienda de Intercambio</h1>

        <div className="shop-grid">
          {exchangeProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">
                  Precio: <strong>{product.price} puntos</strong>
                </p>
              </div>
              <button
                className="shop-buy-btn"
                onClick={() => handleBuy(product.id)}
              >
                Comprar
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}