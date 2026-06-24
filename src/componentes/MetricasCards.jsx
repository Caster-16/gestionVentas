import { useMemo } from 'react';
import '../styles/metricasCards.css';

export default function MetricasCards({ salesData = [] }) {
  const metrics = useMemo(() => {
    const hoy = new Date();
    const hoyStr = hoy.toISOString().split('T')[0];
    const mesActual = hoy.getMonth();
    const anioActual = hoy.getFullYear();

    // Ajustamos las metas acordes a un valor en Soles (S/)
    const META_DIARIA = 500;   
    const META_MENSUAL = 10000; 

    const ventasCompletadas = salesData.filter(s => s.status === 'Completado');

    // --- CÁLCULOS DIARIOS ---
    const ventasDeHoy = ventasCompletadas.filter(s => {
      const fechaVenta = s.fecha ? s.fecha.split('T')[0] : '';
      return fechaVenta === hoyStr;
    });

    const gananciaDia = ventasDeHoy.reduce((acc, s) => acc + (s.monto || 0), 0);
    const productosVendidosHoy = ventasDeHoy.reduce((acc, s) => acc + (s.cantidad || 1), 0);
    const porcentajeMetaDia = Math.min(Math.round((gananciaDia / META_DIARIA) * 100), 100);

    // --- CÁLCULOS MENSUALES ---
    const ventasDelMes = ventasCompletadas.filter(s => {
      if (!s.fecha) return false;
      const fechaVenta = new Date(s.fecha);
      return fechaVenta.getMonth() === mesActual && fechaVenta.getFullYear() === anioActual;
    });

    const gananciaMes = ventasDelMes.reduce((acc, s) => acc + (s.monto || 0), 0);
    const porcentajeMetaMes = Math.min(Math.round((gananciaMes / META_MENSUAL) * 100), 100);

    return {
      gananciaDia,
      productosVendidosHoy,
      metaDiaria: META_DIARIA,
      porcentajeMetaDia,
      gananciaMes,
      metaMensual: META_MENSUAL,
      porcentajeMetaMes
    };
  }, [salesData]);

  return (
    <div className="metrics-grid">
      
      {/* Tarjeta 1: Ganancia del Día */}
      <div className="metric-card">
        <h3>Ganancia del Día</h3>
        <p className="metric-value">S/ {metrics.gananciaDia.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <span className="metric-subtext">Meta Diaria: S/ {metrics.metaDiaria.toLocaleString('es-PE')}</span>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill green" style={{ width: `${metrics.porcentajeMetaDia}%` }}></div>
        </div>
        <span className="metric-percentage">{metrics.porcentajeMetaDia}% alcanzado</span>
      </div>

      {/* Tarjeta 2: Productos Vendidos */}
      <div className="metric-card">
        <h3>Productos Vendidos</h3>
        <p className="metric-value blue">{metrics.productosVendidosHoy} u.</p>
        <span className="metric-subtext">Unidades entregadas hoy</span>
      </div>

      {/* Tarjeta 3: Ganancia Mensual */}
      <div className="metric-card">
        <h3>Ganancia Mensual</h3>
        <p className="metric-value">S/ {metrics.gananciaMes.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <span className="metric-subtext">Meta Mensual: S/ {metrics.metaMensual.toLocaleString('es-PE')}</span>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill orange" style={{ width: `${metrics.porcentajeMetaMes}%` }}></div>
        </div>
        <span className="metric-percentage">{metrics.porcentajeMetaMes}% alcanzado</span>
      </div>

    </div>
  );
}