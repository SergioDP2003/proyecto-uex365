import { useEffect, useState } from 'react';
import { profileApi } from '../api/profileApi';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './Ranking.css';

export function Ranking() {
  const [rankingData, setRankingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoading(true);
        const data = await profileApi.getRanking(50);
        setRankingData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching ranking:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  if (loading) {
    return (
      <div className="ranking-page">
        <Header />
        <div className="ranking-shell">
          <div className="ranking-loading-card">
            <div className="ranking-loading">Cargando ranking global...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="ranking-page">
        <Header />
        <div className="ranking-shell">
          <div className="ranking-error-card">
            <div className="ranking-error">Error: {error}</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const summary = rankingData?.summary || {};
  const ranking = rankingData?.ranking || [];

  return (
    <div className="ranking-page">
      <Header />
      <div className="ranking-shell">
        <div className="ranking-content">
          <div className="ranking-header">
            <h1>Ranking global</h1>
            <p>Comparativa de rendimiento entre usuarios</p>
          </div>

          <div className="ranking-summary">
            <div className="summary-card">
              <span className="summary-label">Usuarios</span>
              <span className="summary-value">{summary.total_users || 0}</span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Apuestas totales</span>
              <span className="summary-value">{summary.total_bets || 0}</span>
            </div>
          </div>

          <div className="ranking-table-wrapper">
            <table className="ranking-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Usuario</th>
                  <th>Balance</th>
                  <th>Total apuestas</th>
                  <th>Win rate</th>
                  <th>Beneficio</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((row) => (
                  <tr key={row.user_id}>
                    <td className="position-cell">{row.position}</td>
                    <td>
                      <div className="user-cell">
                        <div className="avatar-mini">
                          {row.avatar_url ? (
                            <img src={row.avatar_url} alt={row.username} />
                          ) : (
                            <span>{row.username?.charAt(0)?.toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <div className="username">@{row.username}</div>
                          <div className="name">{[row.first_name, row.last_name].filter(Boolean).join(' ') || 'Sin nombre'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="balance-cell">{row.balance?.toFixed(2) || '0.00'} pts</td>
                    <td className="bets-total-cell">{row.bets?.total || 0}</td>
                    <td className="winrate-cell">{row.bets?.win_rate?.toFixed(1) || '0.0'}%</td>
                    <td className={row.bets?.total_profit >= 0 ? 'positive' : 'negative'}>
                      {row.bets?.total_profit?.toFixed(2) || '0.00'} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {ranking.length === 0 && (
              <div className="empty-ranking">No hay datos de ranking todavía.</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}