import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, DollarSign, Users, Target, Plus, Search, Bell, 
  LogOut, Menu, X, ChevronRight, ShoppingBag, Award, Sparkles 
} from 'lucide-react';
import Header from '../componentes/Header';
import Banner from '../componentes/Banner';
import '../styles/dashboard.css'; // Importando estilos específicos modulares

export default function Dashboard({ onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewSaleModal, setShowNewSaleModal] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Historial de ventas iniciales
  const [salesData, setSalesData] = useState([
    { id: 'MA-9081', cliente: 'Sofía Valenzuela', producto: 'Suscripción Premium Marea', monto: 1200, status: 'Completado' },
    { id: 'MA-9080', cliente: 'Carlos Mendoza', producto: 'Licencia Corporativa', monto: 3500, status: 'Completado' },
    { id: 'MA-9079', cliente: 'Constructora Beta S.A.', producto: 'Consultoría Especializada', monto: 5800, status: 'Pendiente' },
    { id: 'MA-9078', cliente: 'Ana María Silva', producto: 'Suscripción Básica Marea', monto: 450, status: 'Completado' }
  ]);

  const [newSale, setNewSale] = useState({
    cliente: '',
    producto: 'Suscripción Premium Marea',
    monto: '',
    status: 'Completado'
  });

  const handleAddSale = (e) => {
    e.preventDefault();
    if (!newSale.cliente.trim() || !newSale.monto) return;

    const randomizedId = `MA-${Math.floor(1000 + Math.random() * 9000)}`;

    const updatedSale = {
      id: randomizedId,
      cliente: newSale.cliente,
      producto: newSale.producto,
      monto: parseFloat(newSale.monto),
      status: newSale.status
    };

    setSalesData([updatedSale, ...salesData]);
    setShowNewSaleModal(false);
    setNewSale({ cliente: '', producto: 'Suscripción Premium Marea', monto: '', status: 'Completado' });
  };

  const metrics = useMemo(() => {
    const completadas = salesData.filter(s => s.status === 'Completado');
    const totalVendido = completadas.reduce((acc, s) => acc + s.monto, 0);
    const totalClientes = new Set(salesData.map(s => s.cliente)).size;
    const metaObjetivo = 25000;
    const porcentajeMeta = Math.min(Math.round((totalVendido / metaObjetivo) * 100), 100);

    return {
      totalVendido,
      totalClientes,
      porcentajeMeta,
      metaObjetivo,
      tasaConversión: '82.4%'
    };
  }, [salesData]);

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
      {}
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
            <LogOut className="w-4 h-4" />
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

          {/* Tarjetas de Métricas */}
          {}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-data">
                <span className="metric-label">Venta Facturada</span>
                <p className="metric-value">${metrics.totalVendido.toLocaleString('es-CL')}</p>
              </div>
              <div className="metric-icon-box orange">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-data">
                <span className="metric-label">Clientes</span>
                <p className="metric-value">{metrics.totalClientes}</p>
              </div>
              <div className="metric-icon-box blue">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="metric-card" style={{ gridColumn: 'span 2' }}>
              <div className="metric-progress-wrapper">
                <div className="metric-progress-header">
                  <span>META MENSUAL</span>
                  <span>{metrics.porcentajeMeta}% (${metrics.totalVendido.toLocaleString('es-CL')} / ${metrics.metaObjetivo.toLocaleString('es-CL')})</span>
                </div>
                <div className="progress-track">
                  <div className="progress-bar" style={{ width: `${metrics.porcentajeMeta}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Panel de Gráficos e Información */}
          {}
          <div className="analytics-grid">
            <div className="panel-card">
              <h3>Monto Facturado por Transacción</h3>
              <div className="chart-container">
                {salesData.slice(0, 6).reverse().map((sale) => {
                  const heightPercent = Math.min((sale.monto / 6000) * 100, 100);
                  return (
                    <div key={sale.id} className="chart-column">
                      <div className="chart-bar-hover-box">${sale.monto.toLocaleString('es-CL')}</div>
                      <div className="chart-bar" style={{ height: `${heightPercent}%` }} />
                      <span className="chart-col-label">{sale.id}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="panel-card">
              <h3>Operaciones</h3>
              <div className="quick-ops-wrapper">
                <button onClick={() => setShowNewSaleModal(true)} className="btn-action-primary">
                  <Plus className="w-5 h-5" />
                  <span>Registrar Venta</span>
                </button>
                <div className="tip-box">
                  <div className="tip-header">
                    <Sparkles className="w-4 h-4" />
                    <span>Tip del día</span>
                  </div>
                  <p>Mantén un seguimiento con tus clientes prospecto en menos de 24 horas para duplicar tu tasa de cierre.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Listado de Historial */}
          {}
          <div className="table-panel">
            <div className="table-header">
              <div className="table-header-info">
                <h3>Historial de Ventas</h3>
                <p>Visualiza y administra todos los tratos de tu equipo</p>
              </div>
              <div className="table-search-bar">
                <div className="search-input-wrapper">
                  <Search className="search-icon w-4 h-4" />
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar cliente, id o producto..."
                    className="search-input"
                  />
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Servicio o Producto</th>
                    <th>Monto</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.map((sale) => (
                    <tr key={sale.id}>
                      <td className="cell-id">{sale.id}</td>
                      <td className="cell-customer">{sale.cliente}</td>
                      <td>{sale.producto}</td>
                      <td className="cell-amount">${sale.monto.toLocaleString('es-CL')}</td>
                      <td>
                        <span className={`status-badge ${sale.status.toLowerCase()}`}>
                          {sale.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL NUEVA VENTA */}
      {}
      {showNewSaleModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                <ShoppingBag className="w-5 h-5" />
                <span>Registrar Nueva Venta</span>
              </h3>
              <button onClick={() => setShowNewSaleModal(false)} className="btn-modal-close">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddSale} className="modal-body">
              <div className="form-group">
                <label>Nombre del Cliente</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Sofía Valenzuela"
                  value={newSale.cliente}
                  onChange={(e) => setNewSale({...newSale, cliente: e.target.value})}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Servicio o Producto</label>
                <select 
                  value={newSale.producto}
                  onChange={(e) => setNewSale({...newSale, producto: e.target.value})}
                  className="form-control"
                >
                  <option value="Suscripción Premium Marea">Suscripción Premium Marea</option>
                  <option value="Licencia Corporativa">Licencia Corporativa</option>
                  <option value="Consultoría Especializada">Consultoría Especializada</option>
                  <option value="Suscripción Básica Marea">Suscripción Básica Marea</option>
                </select>
              </div>

              <div className="form-group">
                <label>Monto de Venta ($ USD)</label>
                <input 
                  type="number" 
                  required
                  placeholder="Ej. 1500"
                  value={newSale.monto}
                  onChange={(e) => setNewSale({...newSale, monto: e.target.value})}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Estado de Transacción</label>
                <div className="radio-group-horizontal">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="status"
                      checked={newSale.status === 'Completado'}
                      onChange={() => setNewSale({...newSale, status: 'Completado'})}
                    />
                    <span>Completado</span>
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="status"
                      checked={newSale.status === 'Pendiente'}
                      onChange={() => setNewSale({...newSale, status: 'Pendiente'})}
                    />
                    <span>Pendiente</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowNewSaleModal(false)} className="btn-modal-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-modal-submit">
                  Confirmar Venta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}