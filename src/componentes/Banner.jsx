import React from 'react';
import '../styles/banner.css';
import { Plus } from 'lucide-react';

export default function Banner({ setShowNewSaleModal }) {
  return (
    <div className="welcome-banner">
      <div className="welcome-banner-glow" />
      <div className="welcome-content">
        <h2>¡Bienvenido al panel, Admin!</h2>
        <p>Tu esfuerzo de hoy será el progreso del mañana. Juntos logramos tu meta.</p>
        <button onClick={() => setShowNewSaleModal(true)} className="btn-welcome-action">
          <Plus className="w-4 h-4" />
          <span>Registrar Nueva Venta</span>
        </button>
      </div>
    </div>
  );
}