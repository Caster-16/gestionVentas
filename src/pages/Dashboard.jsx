import React, { useState, useMemo, useEffect } from 'react'; 
import { 
  TrendingUp, Users, Plus, Search, X, ShoppingBag, Sparkles, Package 
} from 'lucide-react';

import Header from '../componentes/Header';
import Banner from '../componentes/Banner';
import MetricasCards from '../componentes/MetricasCards';
import HistorialVentas from '../componentes/HistorialVentas';

// 1. IMPORTACIÓN DE TU COMPONENTE INVENTARIO
import Inventario from '../componentes/Inventario'; 

import '../styles/dashboard.css'; 

export default function Dashboard({ onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewSaleModal, setShowNewSaleModal] = useState(false);
  
  // ESTADO PARA PASAR EL INVENTARIO EN UN MODAL/VENTANA EMERGENTE
  const [showInventarioModal, setShowInventarioModal] = useState(false);
  
  const [notificationCount, setNotificationCount] = useState(3);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const [salesData, setSalesData] = useState([]);

  // CONSULTA AL ARCHIVO PLANO
  useEffect(() => {
    fetch('http://localhost:5000/api/ventas')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error al conectar con la persistencia');
        }
        return res.json();
      })
      .then((data) => setSalesData(data))
      .catch((err) => console.error("Error leyendo reporte en línea desde archivo plano:", err));
  }, []);

  const [newSale, setNewSale] = useState({
    producto: '', 
    monto: ''     
  });

  // ENVIAR PRODUCTO A LA VITRINA (.txt)
  const handleAddSale = (e) => {
    e.preventDefault();
    if (!newSale.producto.trim() || !newSale.monto) return;

    const randomizedId = `PR-${Math.floor(1000 + Math.random() * 9000)}`;
    const fechaHoy = new Date().toISOString().split('T')[0];

    const updatedSale = {
      id: randomizedId,
      cliente: "Vitrina Vendedor", 
      producto: newSale.producto,
      monto: parseFloat(newSale.monto), 
      status: 'Completado', 
      fecha: fechaHoy, 
      cantidad: 1 
    };

    fetch('http://localhost:5000/api/ventas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedSale)
    })
      .then((res) => {
        if (!res.ok) throw new Error('No se pudo persistir el producto en la vitrina');
        return res.json();
      })
      .then((data) => {
        setSalesData([data, ...salesData]);
        setShowNewSaleModal(false);
        setNewSale({ producto: '', monto: '' });
      })
      .catch((err) => console.error("Error cargando producto a la vitrina plano:", err));
  };

  const filteredSales = useMemo(() => {
    return salesData.filter(sale => 
      sale.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [salesData, searchTerm]);

  return (
    <div className="dashboard-container">
      
      {/* SIDEBAR */}
      <aside className="sidebar" style={{ transform: showMobileSidebar ? 'translateX(0)' : '' }}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">M</div>
            <span className="logo-title">MAREA</span>
          </div>
          <button onClick={() => setShowMobileSidebar(false)} className="btn-menu-toggle" style={{ color: 'white', display: 'block' }}>
            <X className="w-6 h-6 md:hidden" />
          </button>
        </div>

        <nav className="sidebar-menu">
          <p className="menu-title">PANEL PRINCIPAL</p>
          <a href="#dashboard" className="menu-item active">
            <TrendingUp className="w-5 h-5" />
            <span>Control</span>
          </a>
          <a href="#leads" className="menu-item">
            <Users className="w-5 h-5" />
            <span>Mis Clientes</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-badge">
            <div className="profile-avatar">AD</div>
            <div className="profile-info">
              <h4>Administrador</h4>
              <span className="profile-status">
                <span className="status-dot"></span> Conectado
              </span>
            </div>
          </div>
          <button onClick={onLogout} className="btn-logout">
            <span>CERRAR SESIÓN</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="main-wrapper">
        <Header 
          setShowMobileSidebar={setShowMobileSidebar}
          notificationCount={notificationCount}
          setNotificationCount={setNotificationCount}
        />

        <main className="main-body">
          {/* Banner */}
          <Banner setShowNewSaleModal={setShowNewSaleModal} />

          {/* Métricas */}
          <MetricasCards salesData={salesData} />

          {/* Panel de Gráficos e Información */}
          <div className="analytics-grid">
            <div className="panel-card">
              <h3>Monto Facturado por Transacción (Soles)</h3>
              <div className="chart-container">
                {salesData.slice(0, 6).reverse().map((sale) => {
                  const heightPercent = Math.min((sale.monto / 6000) * 100, 100);
                  return (
                    <div key={sale.id} className="chart-column">
                      <div className="chart-bar-hover-box">S/ {sale.monto.toLocaleString('es-PE')}</div>
                      <div className="chart-bar" style={{ height: `${heightPercent}%` }} />
                      <span className="chart-col-label">{sale.id}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="panel-card">
              <h3>Gestión de Vitrina</h3>
              <div className="quick-ops-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                
                {/* BOTÓN 1: AGREGAR PRODUCTO */}
                <button onClick={() => setShowNewSaleModal(true)} className="btn-action-primary">
                  <Plus className="w-5 h-5" />
                  <span>Agregar Producto a Vitrina</span>
                </button>

                {/* BOTÓN 2: ABRE TU VENTANA EMERGENTE DE INVENTARIO */}
                <button 
                  onClick={() => setShowInventarioModal(true)} 
                  className="btn-action-secondary" 
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Package className="w-5 h-5" />
                  <span>Inventario</span>
                </button>

                <div className="tip-box" style={{ marginTop: '0.25rem' }}>
                  <div className="tip-header">
                    <Sparkles className="w-4 h-4" />
                    <span>Vitrina Comercial</span>
                  </div>
                  <p>Los productos añadidos aquí se guardarán directamente en el archivo plano y se actualizarán inmediatamente en la página pública de tus clientes.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Listado de Historial */}
          <HistorialVentas 
            salesData={salesData}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredSales={filteredSales}
          />
        </main>
      </div>

      {/* MODAL: NUEVO PRODUCTO */}
      {showNewSaleModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                <ShoppingBag className="w-5 h-5" />
                <span>Publicar Nuevo Producto</span>
              </h3>
              <button onClick={() => setShowNewSaleModal(false)} className="btn-modal-close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSale} className="modal-body">
              <div className="form-group">
                <label>Nombre del Producto / Servicio</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Laptop Core i7 / Suscripción Mensual"
                  value={newSale.producto}
                  onChange={(e) => setNewSale({...newSale, producto: e.target.value})}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Precio de Venta al Público (S/.)</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  step="0.01"
                  placeholder="Ej. 1499.90"
                  value={newSale.monto}
                  onChange={(e) => setNewSale({...newSale, monto: e.target.value})}
                  className="form-control"
                />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowNewSaleModal(false)} className="btn-modal-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-modal-submit">
                  Publicar en mi Vitrina
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL INVENTARIO */}
      {showInventarioModal && (
        <div className="modal-overlay">
          
          <div className="modal-content" style={{ maxWidth: '900px', width: '95%' }}>
            <div className="modal-header">
              <h3>
                <Package className="w-5 h-5" />
                <span>Control de Inventario</span>
              </h3>
              <button onClick={() => setShowInventarioModal(false)} className="btn-modal-close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="modal-body">
              
              <Inventario />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}