import './BetsStats.css';

export function BetsStats({ bets }) {
  if (!bets) return null;

  const { wins, losses, pending, total } = bets;
  const total_non_zero = wins + losses + pending;

  return (
    <div className="bets-stats">
      <h2>Estadísticas de Apuestas</h2>
      
      <div className="bets-distribution">
        <div className="distribution-chart">
          <div className="chart-container">
            {total_non_zero > 0 ? (
              <>
                {wins > 0 && (
                  <div 
                    className="bar-segment wins" 
                    style={{ width: `${(wins / total_non_zero) * 100}%` }}
                    title={`Wins: ${wins}`}
                  ></div>
                )}
                {losses > 0 && (
                  <div 
                    className="bar-segment losses" 
                    style={{ width: `${(losses / total_non_zero) * 100}%` }}
                    title={`Losses: ${losses}`}
                  ></div>
                )}
                {pending > 0 && (
                  <div 
                    className="bar-segment pending" 
                    style={{ width: `${(pending / total_non_zero) * 100}%` }}
                    title={`Pending: ${pending}`}
                  ></div>
                )}
              </>
            ) : (
              <div className="no-bets">Sin apuestas aún</div>
            )}
          </div>
        </div>

        <div className="distribution-legend">
          <div className="legend-item">
            <span className="legend-color wins"></span>
            <span className="legend-text">Ganancias: {wins}</span>
          </div>
          <div className="legend-item">
            <span className="legend-color losses"></span>
            <span className="legend-text">Pérdidas: {losses}</span>
          </div>
          <div className="legend-item">
            <span className="legend-color pending"></span>
            <span className="legend-text">Pendientes: {pending}</span>
          </div>
        </div>
      </div>

      <div className="bets-details">
        <div className="detail-item">
          <span className="detail-label">Total Apostado:</span>
          <span className="detail-value">{bets.total_wagered?.toFixed(2) || '0.00'} pts</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Apuesta Promedio:</span>
          <span className="detail-value">{bets.average_bet?.toFixed(2) || '0.00'} pts</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Ganancia Total:</span>
          <span className={`detail-value ${bets.total_profit >= 0 ? 'positive' : 'negative'}`}>
            {bets.total_profit?.toFixed(2) || '0.00'} pts
          </span>
        </div>
      </div>
    </div>
  );
}
