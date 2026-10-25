import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUsuario, loginUsuario, googleLoginUsuario, getMe } from '../../services/authService';
import AuthForm, { AuthField } from '../../components/auth/AuthForm';

const RegisterView = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleSuccessfulAuth = async () => {
    const userData = await getMe();
    if (userData) {
      localStorage.setItem('is_admin', userData.is_admin);
      localStorage.setItem('username', userData.username);
    }
    setTimeout(() => {
      navigate('/home');
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const registerResult = await registerUsuario(username, email, password);

    if (registerResult.success) {
      setSuccessMsg('¡Registro correcto! Iniciando sesión...');

      const loginResult = await loginUsuario(username, password);
      if (loginResult.success) {
        await handleSuccessfulAuth();
      } else {
        setErrorMsg('Registrado, pero falló el inicio de sesión automático.');
      }
    } else {
      setErrorMsg(registerResult.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setErrorMsg('');
    const result = await googleLoginUsuario(credentialResponse.credential);
    
    if (result.success) {
      await handleSuccessfulAuth();
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <AuthForm
      title="Crear Cuenta"
      errorMsg={errorMsg}
      successMsg={successMsg}
      onSubmit={handleSubmit}
      buttonText="Registrarse"
      onGoogleSuccess={handleGoogleSuccess}
      onGoogleError={() => setErrorMsg('Error al conectar con Google')}
    >
      <AuthField
        label="Usuario"
        type="text"
        value={username}
        onChange={setUsername}
        required
      />
      <AuthField
        label="Correo Electrónico"
        type="email"
        value={email}
        onChange={setEmail}
        required
      />
      <AuthField
        label="Contraseña"
        type="password"
        value={password}
        onChange={setPassword}
        required
        minLength="4"
      />
      
      <div className="auth-link" style={{ marginTop: '10px', textAlign: 'center' }}>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </div>
    </AuthForm>
  );
};

export default RegisterView;