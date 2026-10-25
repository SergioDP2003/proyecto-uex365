import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUsuario, googleLoginUsuario, getMe } from '../../services/authService';
import AuthForm, { AuthField } from '../../components/auth/AuthForm';

const LoginView = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSuccessfulAuth = async () => {
    const userData = await getMe();
    if (userData) {
      localStorage.setItem('is_admin', userData.is_admin);
      localStorage.setItem('username', userData.username);
      localStorage.setItem('user_id', userData.id);
    }
    if(userData.is_admin){
      navigate('/admin')
    }else {
      navigate('/home');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const result = await loginUsuario(username, password);

    if (result.success) {
      await handleSuccessfulAuth();
    } else {
      setErrorMsg(result.message);
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
      title="Iniciar Sesión"
      errorMsg={errorMsg}
      onSubmit={handleSubmit}
      buttonText="Entrar"
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
        label="Contraseña"
        type="password"
        value={password}
        onChange={setPassword}
        required
      />
      <div className="auth-link" style={{ marginTop: '10px', textAlign: 'center' }}>
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </div>
    </AuthForm>
  );
};

export default LoginView;