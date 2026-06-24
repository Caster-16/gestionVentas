import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, Utensils, Flame, Clock, Search, LogOut, 
  Menu, X, Plus, ChevronRight, Sparkles, Heart 
} from 'lucide-react';
import '../styles/dashboard.css'; // Reutiliza tus estilos base para mantener consistencia visual

export default function VistaClientes({ onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Catálogo de comida y promociones del portal
  const [foodMenu, setFoodMenu] = useState([
    { id: 'COM-01', nombre: 'Combo Marea Burger', descripcion: 'Doble carne con queso cheddar, tocino y papas fritas.', precio: 8500, categoria: 'Promociones', popular: true },
    { id: 'COM-02', nombre: 'Pizza Familiar Suprema', descripcion: 'Pepperoni, jamón, pimentón, cebolla y extra queso.', precio: 12000, categoria: 'Pizzas', popular: false },
    { id: 'COM-03', nombre: 'Alitas de Pollo BBQ (12 und)', descripcion: 'Bañadas en salsa BBQ artesanal acompañadas de aderezo ranch.', precio: 7500, categoria: 'Promociones', popular: true },
    { id: 'COM-04', nombre: 'Tacubaya Burrito', descripcion: 'Carne mechada, frijoles refritos, guacamole y salsa de la casa.', precio: 6200, categoria: 'Mexicana', popular: false },
    { id: 'COM-05', nombre: 'Chorrillana Mar y Tierra', descripcion: 'Papas fritas con lomo, camarones salteados, huevo y cebolla.', precio: 14500, categoria: 'Especialidades', popular: true }
  ]);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  // Filtrar platillos por buscador
  const filteredMenu = useMemo(() => {
    return foodMenu.filter(item => 
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [foodMenu, searchTerm]);

  return (
    <div className="dashboard-container">
      
      {/* SIDEBAR CLIENTE (Simplificado) */}
      <aside className="sidebar" style={{ transform: showMobileSidebar ? 'translateX(0)' : '' }}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">M</div>
            <span className="logo-title">MAREA FOOD</span>
          </div>
          <button onClick={() => setShowMobileSidebar(false)} className="btn-menu-toggle" style={{ color: 'white', display: 'block' }}>
            <X className="w-6 h-6 md:hidden" />
          </button>
        </div>

        <nav className="sidebar-menu">
          <p className="menu-title">MENÚ USUARIO</p>
          <a href="#Explorar" className="menu-item active">
            <Utensils className="w-5 h-5" />
            <span>Hacer Pedido</span>
          </a>
          <a href="#promos" className="menu-item">
            <Flame className="w-5 h-5" />
            <span>Promociones del Día</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-badge">
            <div className="profile-avatar">CL</div>
            <div className="profile-info">
              <h4>Cliente Marea</h4>
              <span className="profile-status">
                <span className="status-dot"></span> Hambriento
              </span>
            </div>
          </div>
          <button onClick={onLogout} className="btn-logout">
            <LogOut className="w-4 h-4" />
            <span>CERRAR SESIÓN</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL DE COMIDAS */}
      <main className="main-body">
        
        {/* Banner de Comidas (Centrado perfecto como arreglamos antes) */}
        <div className="welcome-banner">
          <div className="welcome-banner-glow" />
          <div className="welcome-content" style={{ margin: '0 auto', alignItems: 'center', textAlign: 'center' }}>
            <h2>¡Tu comida favorita a un clic!</h2>
            <p>Disfruta de las mejores promociones gastronómicas de la semana. Despacho rápido directamente a tu puerta.</p>
            <button onClick={handleAddToCart} className="btn-welcome-action" style={{ alignSelf: 'center' }}>
              <ShoppingBag className="w-4 h-4" />
              <span>Mi Carrito ({cartCount})</span>
            </button>
          </div>
        </div>

        {/* Tarjetas de Métricas convertidas en Destacados/Promos rápidas */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-data">
              <span className="metric-label">Envío Gratis desde</span>
              <p className="metric-value">$15.000</p>
            </div>
            <div className="metric-icon-box orange">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-data">
              <span className="metric-label">Cupón Activo</span>
              <p className="metric-value">MAREA25</p>
            </div>
            <div className="metric-icon-box blue">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>

          <div className="metric-card" style={{ gridColumn: 'span 2' }}>
            <div className="metric-progress-wrapper">
              <div className="metric-progress-header">
                <span>NIVEL DE DEMANDA EN LA COCINA</span>
                <span>Normal (Tiempo estimado: 25-35 min)</span>
              </div>
              <div className="progress-track">
                <div className="progress-bar" style={{ width: `35%`, backgroundColor: '#10b981' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Listado de Menú y Carta */}
        <div className="table-panel">
          <div className="table-header">
            <div className="table-header-info">
              <h3>Carta Digital de Platos</h3>
              <p>Selecciona tus preparaciones favoritas y arma tu orden</p>
            </div>
            <div className="table-search-bar">
              <div className="search-input-wrapper">
                <Search className="search-icon w-4 h-4" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar pizza, hamburguesa, combos..."
                  className="search-input"
                />
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Platillo / Menú</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredMenu.map((item) => (
                  <tr key={item.id}>
                    <td className="cell-id">{item.id}</td>
                    <td className="cell-customer">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {item.nombre}
                        {item.popular && (
                          <span className="status-badge completado" style={{ fontSize: '10px', padding: '2px 6px' }}>
                            ¡PROMO!
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{item.descripcion}</td>
                    <td className="cell-amount">${item.precio.toLocaleString('es-CL')}</td>
                    <td>
                      <button 
                        onClick={handleAddToCart}
                        className="btn-action-primary" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '0.5rem' }}
                      >
                        <Plus className="w-3 h-3" />
                        <span>Agregar</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}