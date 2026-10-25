import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCart, checkoutCart, clearCart, removeOptionFromBet } from "../../services/cart_services";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import "../../styles/Cart.css";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [betAmounts, setBetAmounts] = useState({});

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getCart();
    const normalized = Array.isArray(data)
      ? data
      : data.cart || data.data || [];
    setCart(normalized);
  };

  const handleCheckout = async () => {
    const bets = cart.map(item => ({
      bet_cart_id: item.bet_cart_id,
      bet_amount: betAmounts[item.bet_cart_id] || 0
    }));
    await checkoutCart({ bets });
    alert("Apuestas realizadas");
    load();
  };

  const handleClearCart = async () => {
    await clearCart();
    await load();
  };

  const handleRemoveOption = async (betId, optionId) => {
    await removeOptionFromBet(betId, optionId);
    await load();
  };

  const getPotentialWin = (item) => {
    const amount = Number(betAmounts[item.bet_cart_id] || 0);
    const finalCuote = Number(item.final_cuote || 0);
    return amount * finalCuote;
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <Header />
        <div className="cart-content">
          <h1 className="cart-title">Carrito de Apuestas</h1>
          <div className="cart-empty-state">
            <div className="cart-empty-icon">🛒</div>
            <p className="cart-empty-title">Tu carrito está vacío</p>
            <p className="cart-empty-subtitle">
              Todavía no has añadido ninguna apuesta. ¡Explora los eventos disponibles!
            </p>
            <Link to="/available_events" className="cart-empty-link">
              Ver eventos disponibles
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Header />
      <div className="cart-content">
        <h1 className="cart-title">Carrito de Apuestas</h1>

        {cart.map((item, index) => (
          <div key={index} className="cart-bet-card">
            <div className="cart-bet-header">Apuesta #{index + 1}</div>

            {item.options.map((opt) => (
              <div key={opt.option_id} className="cart-option-row">
                <div className="cart-option-info">
                  <span className="cart-option-name">🎯 {opt.option_name}</span>
                  <span className="cart-option-cuote">{opt.cuote}</span>
                </div>
                <button
                  className="cart-remove-btn"
                  onClick={() => handleRemoveOption(item.bet_cart_id, opt.option_id)}
                >
                  Eliminar
                </button>
              </div>
            ))}

            <div className="cart-total-row">
              <div>
                <span className="cart-final-cuote cart-potential-win">
                  Total cuota: {Number(item.final_cuote).toFixed(2)}   
                </span>
                <span className="cart-final-cuote">
                  Ganancia si acierta: {getPotentialWin(item).toFixed(2)} pts
                </span>
              </div>
              <div className="cart-amount-group">
                <label>Cantidad:</label>
                <input
                  type="number"
                  className="cart-amount-input"
                  value={betAmounts[item.bet_cart_id] || 0}
                  min={0}
                  onChange={(e) =>
                    setBetAmounts({
                      ...betAmounts,
                      [item.bet_cart_id]: Number(e.target.value)
                    })
                  }
                />
              </div>
            </div>
          </div>
        ))}

        <div className="cart-actions">
          <button className="cart-btn cart-btn-clear" onClick={handleClearCart}>
            Limpiar carrito
          </button>
          <button className="cart-btn cart-btn-checkout" onClick={handleCheckout}>
            Finalizar apuesta
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}