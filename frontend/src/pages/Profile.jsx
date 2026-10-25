import { useState, useEffect } from 'react';
import { profileApi } from '../api/profileApi';
import { ProfileHeader } from '../components/ProfileHeader';
import { BetsStats } from '../components/BetsStats';
import { TransactionsStats } from '../components/TransactionsStats';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './Profile.css';

export function Profile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    avatar_url: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileData, statsData] = await Promise.all([
          profileApi.getProfile(),
          profileApi.getStats(),
        ]);
        setProfile(profileData);
        setStats(statsData);
        setFormData({
          username: profileData.username || '',
          email: profileData.email || '',
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
          avatar_url: profileData.avatar_url || '',
        });
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleCancelEdit = () => {
    setFormData({
      username: profile.username || '',
      email: profile.email || '',
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      avatar_url: profile.avatar_url || '',
    });
    setIsEditing(false);
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const updatedProfile = await profileApi.updateProfile(formData);
      setProfile(updatedProfile);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err.message || 'No se pudo actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Header />
        <div className="profile-shell">
          <div className="loading-card">
            <div className="loading">Cargando perfil...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <Header />
        <div className="profile-shell">
          <div className="error-card">
            <div className="error">Error: {error}</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Header />
      <div className="profile-shell">
        <div className="profile-content">
          {profile && stats && (
            <>
              <ProfileHeader profile={profile} stats={stats} />

              <div className="profile-edit-card">
                <div className="profile-edit-header">
                  <div>
                    <h2>Datos de perfil</h2>
                    <p>Edita tus datos públicos y de contacto. El saldo, permisos y estado no se pueden cambiar desde aquí.</p>
                  </div>
                  {!isEditing && (
                    <button className="profile-edit-btn" onClick={() => setIsEditing(true)}>
                      Editar datos
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form className="profile-edit-form" onSubmit={handleSaveProfile}>
                    <div className="profile-form-grid">
                      <div className="profile-form-group">
                        <label>Usuario</label>
                        <input name="username" value={formData.username} onChange={handleFieldChange} required />
                      </div>
                      <div className="profile-form-group">
                        <label>Email</label>
                        <input name="email" type="email" value={formData.email} onChange={handleFieldChange} required />
                      </div>
                      <div className="profile-form-group">
                        <label>Nombre</label>
                        <input name="first_name" value={formData.first_name} onChange={handleFieldChange} />
                      </div>
                      <div className="profile-form-group">
                        <label>Apellidos</label>
                        <input name="last_name" value={formData.last_name} onChange={handleFieldChange} />
                      </div>
                      <div className="profile-form-group profile-form-wide">
                        <label>URL del avatar</label>
                        <input name="avatar_url" value={formData.avatar_url} onChange={handleFieldChange} placeholder="https://..." />
                      </div>
                    </div>
                    <div className="profile-edit-actions">
                      <button type="button" className="profile-cancel-btn" onClick={handleCancelEdit}>Cancelar</button>
                      <button type="submit" className="profile-save-btn" disabled={saving}>
                        {saving ? 'Guardando...' : 'Guardar cambios'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-readonly-grid">
                    <div><span>Usuario</span><strong>@{profile.username}</strong></div>
                    <div><span>Email</span><strong>{profile.email || 'Sin email'}</strong></div>
                    <div><span>Nombre</span><strong>{profile.first_name || 'Sin nombre'}</strong></div>
                    <div><span>Apellidos</span><strong>{profile.last_name || 'Sin apellidos'}</strong></div>
                  </div>
                )}
              </div>

              <div className="stats-section">
                <BetsStats bets={stats.bets} />
                <TransactionsStats transactions={stats.transactions} />
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
