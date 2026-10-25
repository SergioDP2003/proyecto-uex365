import './TransactionsStats.css';

export function TransactionsStats({ transactions }) {
  if (!transactions) return null;

  const { total, total_amount, by_type } = transactions;

  return (
    <div className="transactions-stats">
      <h2>Historial de Transacciones</h2>
      
      <div className="transactions-overview">
        <div className="overview-card">
          <div className="overview-value">{total || 0}</div>
          <div className="overview-label">Total Transacciones</div>
        </div>
        <div className="overview-card">
          <div className="overview-value">{total_amount?.toFixed(2) || '0.00'} pts</div>
          <div className="overview-label">Cantidad Total</div>
        </div>
      </div>

      {by_type && by_type.length > 0 ? (
        <div className="transactions-by-type">
          <h3>Desglose por Tipo</h3>
          <div className="type-list">
            {by_type.map((type) => (
              <div key={type.transaction_type__id} className="type-row">
                <div className="type-info">
                  <span className="type-name">{type.transaction_type__name}</span>
                  <span className="type-count">({type.total} transacciones)</span>
                </div>
                <div className="type-amount">
                  {type.amount?.toFixed(2) || '0.00'} pts
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-transactions">Sin transacciones aún</div>
      )}
    </div>
  );
}
