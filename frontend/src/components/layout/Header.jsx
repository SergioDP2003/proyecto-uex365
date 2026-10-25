import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Header.css';
import { logoutUsuario } from '../../services/authService';
import logoLetras from '../../assets/uex364_letras.png';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const navigate = useNavigate(); 

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []); 

    const handleLogout = async () => {
        try {
            await logoutUsuario(); 
        } catch (error) {
            console.error("Error en logout:", error);
        }
        setIsLoggedIn(false);
        setIsDropdownOpen(false);
        navigate('/'); 
    };

    return (
        <header className="uex-header">
            
            <div className="uex-logo">
                {}
                <Link to={isLoggedIn ? "/home" : "/"}>
                    <img 
                        src={logoLetras} 
                        alt="Uex365" 
                        className="uex-logo-img" 
                    />
                </Link>
            </div>
            
            <nav className="uex-header-center">
                {!isLoggedIn ? (
                    <>
                        <Link to="/" className="nav-link">Inicio</Link>
                        <Link to="/como-funciona" className="nav-link">¿Cómo funciona?</Link>
                    </>
                ) : (
                    <>
                        <Link to="/home" className="nav-link">Inicio </Link>
                        <Link to="/available_events" className="nav-link">Todos los Eventos</Link>
                        <Link to="/ranking" className="nav-link">Ranking</Link>
                        <Link to="/exchange_shop" className="nav-link">Tienda</Link>
                        <Link to="/roulette" className="nav-link">Ruleta Diaria</Link>
                        {}
                        <Link to="/carrito" className="nav-link" >
                            Carrito
                        </Link>
                    </>
                )}
            </nav>

            <div className="uex-header-right">
                {!isLoggedIn ? (
                    <div className="uex-auth-buttons">
                        <Link to="/register">
                            <button className="uex-register-btn">Registrarse</button>
                        </Link>
                        <Link to="/login">
                            <button className="uex-login-btn">Iniciar Sesión</button>
                        </Link>
                    </div>
                ) : (
                    <div className="uex-profile-menu">
                        <div 
                            className="uex-avatar" 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            style={{ cursor: 'pointer', fontSize: '1.5rem' }} // Añadido un cursor pointer para que sea evidente que es clickable
                        >
                            👤 
                        </div>

                        {isDropdownOpen && (
                            <div className="uex-dropdown">
                                {/* Opciones de gestión personal */}
                                <Link to="/perfil" onClick={() => setIsDropdownOpen(false)}>Mi Perfil</Link>
                                <Link to="/historial_apuestas" onClick={() => setIsDropdownOpen(false)}>Historial de Apuestas</Link>
                                <hr />
                                <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                                    Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;