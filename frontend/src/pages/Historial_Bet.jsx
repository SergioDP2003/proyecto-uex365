// components/pages/Historial_Bet.jsx
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useEffect, useState } from "react";
import { getBetFromUser } from "../services/bet_services";
import "../styles/Admin.css";
import { useNavigate, useParams } from "react-router-dom";

export default function HistorialBet() {
  const navigate = useNavigate();
  const { id } = useParams(); // Por si se pasa /admin/bets/user/:id
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Identificamos de quién son las apuestas de forma segura
  const currentUserId = localStorage.getItem("user_id") 

  useEffect(() => {
    fetchBets();
  }, [currentUserId]);

  const fetchBets = async () => {
    setLoading(true);
    const data = await getBetFromUser(currentUserId);
    // Aseguramos que sea un array por si el backend falló o vino vacío
    setBets(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  // Filtrado flexible: puedes buscar tanto por el ID de la apuesta como por el estado de la misma
  const filteredBets = bets.filter(bet =>
    bet.id.toString().includes(searchTerm) || 
    (bet.bet_state_name && bet.bet_state_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="admin-page">
      <Header />
      <main className="admin-main-content">
        <div className="table-container-header">
          <h1 className="admin-title">Historial de Apuestas</h1>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button className="refresh-btn" onClick={fetchBets}>Actualizar</button>
          </div>
        </div>

        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Buscar por ID de apuesta o estado..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>

        <div className="admin-table-wrapper">
          {loading ? (
            <p className="loading-text">Cargando historial de apuestas...</p>
          ) : filteredBets.length === 0 ? (
            <p className="loading-text">No se encontraron apuestas para este usuario.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID Apuesta</th>
                  <th>Fecha de Creación</th>
                  <th>Cantidad Apostada</th>
                  <th>Cuota Final</th>
                  <th>Ganancia Potencial</th>
                  <th>Tipo de Apuesta</th>
                  <th>Estado</th>
                  <th>Resultado</th>
                </tr>
              </thead>
              <tbody>
                {filteredBets.map((bet) => (
                  <tr key={bet.id}>
                    <td>#{bet.id}</td>
                    <td>{bet.creation_date ? bet.creation_date.substring(0, 10) : "N/A"}</td>
                    <td style={{ fontWeight: "bold" }}>{bet.bet_amount} pts</td>
                    <td style={{ fontWeight: "bold" }}>{bet.final_cuote}</td>
                    <td style={{ color: "#2ecc71", fontWeight: "bold" }}>
                      {bet.profit ? `${bet.profit} pts` : "Calculando..."}
                    </td>
                    <td>
                      <span className="state-text">
                        {bet.bet_type.name  || "Simple"}
                      </span>
                    </td>
                    <td>
                      {/* Reutiliza el estilo de estados de tu Admin.css */}
                      <span className={`state-badge ${bet.bet_state.name?.toLowerCase() || 'pendiente'}`}>
                        {bet.bet_state.name || "Pendiente"}
                      </span>
                    </td>
                    <td>
                      <span>
                        {bet.bet_state?.id === 1 || bet.bet_state?.id === 4 ? (
                          "-"
                        ) : bet.is_winner ? (
                          <span style={{ color: 'green', fontWeight: 'bold' }}>Ganadora</span>
                        ) : (
                          <span style={{ color: 'red' }}>Perdedora</span>
                        )}
                      </span>
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