import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import '../../styles/AuthViews.css';

export const AuthField = ({ label, type = 'text', value, onChange, required, minLength }) => (
  <div className="auth-field">
    <label>{label}</label>
    <input
      type={type}
      className="auth-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      minLength={minLength}
    />
  </div>
);

const AuthForm = ({
  title,
  errorMsg,
  successMsg,
  onSubmit,
  buttonText,
  onGoogleSuccess, // Recibimos la función de éxito
  onGoogleError,   // Recibimos la función de error
  children
}) => (
  <div className="auth-container">
    <form onSubmit={onSubmit} className="auth-card">
      <h2 className="auth-title">{title}</h2>

      {errorMsg && <p className="auth-error">{errorMsg}</p>}
      {successMsg && <p className="auth-success">{successMsg}</p>}

      {children}

      <button type="submit" className="auth-button">
        {buttonText}
      </button>

      {/* Renderizado condicional: si le pasamos la función, muestra el botón de Google */}
      {onGoogleSuccess && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ margin: '15px 0', color: '#888', fontSize: '0.9rem' }}>
            o acceder con
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={onGoogleError}
              useOneTap
            />
          </div>
        </div>
      )}

      {/* Botón para volver al inicio */}
      <Link to="/" className="auth-back-link" style={{ display: 'block', marginTop: '20px', textAlign: 'center' }}>
        Volver al inicio
      </Link>
    </form>
  </div>
);

export default AuthForm;