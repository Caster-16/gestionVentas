import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VistaClientes from './pages/VistaClientes';
import './App.css'

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const handleLogin = () => setIsAdminAuthenticated(true);
  const handleLogout = () => setIsAdminAuthenticated(false);
 
  return (
    <Router>
      <Routes>
        
        {/* 1. RUTA PRINCIPAL: Login del Administrador */}
        <Route 
          path="/" 
          element={
            isAdminAuthenticated ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              // Le pasamos la función handleLogin a tu componente Login
              <Login onLogin={handleLogin} />
            )
          } 
        />

        {/* 2. RUTA PRIVADA: Panel de Control de Ventas y Gestión */}
        <Route 
          path="/admin/dashboard" 
          element={
            isAdminAuthenticated ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />

        {/* 3. RUTA PÚBLICA (EL LINK ESPECIAL): Tu cliente entra directo aquí */}
        <Route path="/menu" element={<VistaClientes />} />

        {/* CUALQUIER OTRA URL ERRÓNEA REDIRIGE AL LOGIN (RAÍZ) */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App
