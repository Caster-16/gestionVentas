import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import '../styles/login.css';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);

    // Simulación de consulta a tu backend de Node.js
    setTimeout(() => {
      setLoading(false);
      if (username.toLowerCase() === 'admin' && password === '123456') {
        onLoginSuccess();
      } else {
        setError('El usuario o la contraseña son incorrectos.');
      }
    }, 1200);
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        
        {/* Formulario (Lado Izquierdo) */}
        <div className="login-form-side">
          <div className="login-logo-container">
            <div className="logo-wrapper">
              <svg className="logo-orbit" viewBox="0 0 100 50" fill="none">
                <path d="M5 45 C 15 10, 85 5, 95 30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M15 48 C 30 20, 80 15, 90 35" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
              </svg>
              <span className="logo-text">
                M<span>A</span>R<span>E</span>A
              </span>
            </div>
          </div>

          <div className="login-header-text">
            <h1>Iniciar Sesión</h1>
            <p>Ingresa tus credenciales para acceder a la plataforma</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error-alert">
                <AlertCircle className="icon-error" />
                <span>{error}</span>
              </div>
            )}

            <div className="input-group">
              <label>Usuario</label>
              <div className="input-wrapper">
                <span className="input-icon"><User /></span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Escribe tu usuario..."
                  disabled={loading}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Contraseña</label>
              <div className="input-wrapper">
                <span className="input-icon"><Lock /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Escribe tu contraseña..."
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn-toggle-password"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div className="forgot-password-link">
              <a href="#recuperar" onClick={(e) => { e.preventDefault(); setError('Usa las credenciales demo: admin / 123456'); }}>
                ¿Olvidó su Contraseña?
              </a>
            </div>

            <button type="submit" disabled={loading} className="btn-submit-login">
              {loading ? (
                <span className="spinner-loader">
                  <svg className="spinner" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>AUTENTICANDO...</span>
                </span>
              ) : (
                <>
                  <span>INGRESAR</span>
                  <ArrowRight className="btn-arrow" />
                </>
              )}
            </button>

            <div className="demo-credentials-badge">
               <strong>Credenciales:</strong> admin / 123456
            </div>
          </form>
        </div>

        {/* Banner Ilustrativo (Lado Derecho) */}
        <div className="login-banner-side">
          <div className="banner-circle-bg-1" />
          <div className="banner-circle-bg-2" />

          <div className="banner-logo-badge">
            <div className="badge-glow" />
            <div className="badge-logo-container">
              <svg className="badge-svg" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="45" fill="#FFC72C" />
                <path d="M50 20 C35 20, 30 35, 30 45 C30 55, 35 60, 42 60 C42 52, 48 48, 50 44 C52 48, 58 52, 58 60 C65 60, 70 55, 70 45 C70 35, 65 20, 50 20 Z" fill="#0056B3" />
                <circle cx="50" cy="35" r="8" fill="#FFFFFF" />
                <path d="M42 60 C 45 68, 48 76, 50 80 C 52 76, 55 68, 58 60 Z" fill="#0056B3" />
              </svg>
            </div>
          </div>

          <div className="banner-text-content">
            <h2>Bienvenido al Portal de Ventas</h2>
            <div className="banner-divider" />
            <p>
              Gestiona tus clientes, visualiza reportes de rendimiento y haz seguimiento de tus metas diarias en un solo lugar.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}