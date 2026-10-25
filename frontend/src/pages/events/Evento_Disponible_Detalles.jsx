import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventDetail } from "../../services/event_services";
import { getCart, addToCart, addOptionToBet } from "../../services/cart_services";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import "../../styles/EventDetail.css";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadEvent();
    loadCart();
  }, [id]);

  const loadEvent = async () => {
    const data = await getEventDetail(id);
    setEvent(data);
    setLoading(false);
  };

  const loadCart = async () => {
    const data = await getCart();
    setCart(data);
  };

  const formatBetLabel = (bet) => {
    return bet.options
      .map((opt) => `${opt.event_name} - ${opt.option_name}`)
      .join(" + ");
  };

  const handleAddNewBet = async (optionId) => {
    await addToCart({ option_id: optionId });
    await loadCart();
  };

  const optionAlreadyExistsInBet = (bet, option) => {
    return bet.options.some((cartOption) => Number(cartOption.option_id) === Number(option.id));
  };

  const handleAddToExistingBet = async (betId, option) => {
    const selectedBet = cart.find((bet) => bet.bet_cart_id === betId);
    if (selectedBet && optionAlreadyExistsInBet(selectedBet, option)) {
      alert("No puedes meter la misma opción dos veces en la misma apuesta. Crea una apuesta nueva si quieres repetir esa opción.");
      return;
    }

    await addOptionToBet(betId, option.id);
    await loadCart();
  };

  if (loading) return <div className="event-page"><p className="event-loading">Cargando...</p></div>;

  return (
    <div className="event-page">
      <Header />
      <div className="event-content">
        <h1 className="event-name">{event.name}</h1>
        <p className="event-description">{event.description}</p>

        <hr className="event-divider" />

        <h3 className="event-options-title">Opciones de apuesta</h3>

        {event.options.map((opt) => (
          <div key={opt.id} className="event-option-card">
            <div className="event-option-header">
              <span className="event-option-name">🎯 {opt.name}</span>
              <span className="event-option-cuote">Cuota: {opt.cuote}</span>
            </div>

            <button
              className="event-new-bet-btn"
              onClick={() => handleAddNewBet(opt.id)}
            >
              ➕ Nueva apuesta
            </button>

            <div className="event-existing-bets">
              <p>Añadir a apuesta existente:</p>

              {cart.length === 0 ? (
                <p className="event-no-bets">No hay apuestas en el carrito</p>
              ) : (
                cart.map((bet) => (
                  <div key={bet.bet_cart_id} className="event-bet-item">
                    <span className="event-bet-label">
                      {formatBetLabel(bet)}
                    </span>
                    <button
                      className="event-add-to-bet-btn"
                      disabled={optionAlreadyExistsInBet(bet, opt)}
                      onClick={() => handleAddToExistingBet(bet.bet_cart_id, opt)}
                    >
                      {optionAlreadyExistsInBet(bet, opt) ? "Ya añadida" : "Añadir"}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}