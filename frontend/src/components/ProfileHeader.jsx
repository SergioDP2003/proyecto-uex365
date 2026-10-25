import './ProfileHeader.css';

export function ProfileHeader({ profile, stats }) {
  return (
    <div className="profile-header">
      <div className="profile-banner">
        <div className="profile-avatar">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.username} />
          ) : (
            <div className="avatar-placeholder">
              {profile?.username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="profile-info">
          <h1>{profile?.first_name || profile?.username}</h1>
          <p className="username">@{profile?.username}</p>
          {profile?.email && <p className="email">{profile.email}</p>}
        </div>
      </div>

      <div className="profile-stats-overview">
        <div className="stat-card">
          <div className="stat-value">{stats?.balance?.toFixed(2) || '0.00'} pts</div>
          <div className="stat-label">Saldo</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.bets?.total || 0}</div>
          <div className="stat-label">Total Apuestas</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.bets?.win_rate?.toFixed(1) || '0'}%</div>
          <div className="stat-label">Tasa Ganancia</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.bets?.total_profit?.toFixed(2) || '0.00'} pts</div>
          <div className="stat-label">Ganancia Neta</div>
        </div>
      </div>
    </div>
  );
}
