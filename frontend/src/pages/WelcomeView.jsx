import { Link } from 'react-router-dom';
import '../styles/WelcomeView.css';
import logoUex from '../assets/uex365.png';
import logoEscuela from '../assets/EscuelaLudopata.png';

const WelcomeView = () => {
    return (
        <div className="welcome-container">
            <div className="welcome-hero">
                <div className="logo-wrapper">
                    <img src={logoUex} alt="Logo UEx365" className="logo" />
                    <span className="separator">x</span>
                    <img src={logoEscuela} alt="Logo Escuela Ludópata" className="logo" />
                </div>
                <h3 className="tagline">
                    La plataforma oficial de pronósticos de la Universidad
                </h3>
                <p className="description">
                    ¿Cuál será el porcentaje de aprobados en ese examen imposible? ¿Qué nota media tendrán los TFG este año? 
                    Demuestra tu intuición, compite con tus compañeros y escala en el ranking de tu facultad. 
                    Un entorno cerrado, seguro y diseñado en exclusiva para la comunidad universitaria. ¿Te atreves a apostar?
                </p>
                <div className="button-group">
                    <Link to="/login" className="btn btn-login">
                        Iniciar Sesión
                    </Link>
                    <Link to="/register" className="btn btn-register">
                        Crear Cuenta
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default WelcomeView;