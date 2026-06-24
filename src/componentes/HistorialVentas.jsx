import React from 'react';
import { Search } from 'lucide-react';

export default function HistorialVentas({ salesData = [], searchTerm, setSearchTerm, filteredSales = [] }) {
  return (
    <div className="table-panel">
      <div className="table-header">
        <div className="table-header-info">
          <h3>Historial de Ventas </h3>
          <p>Visualiza todas las ventas registradas en tiempo real</p>
        </div>
        <div className="table-search-bar">
          <div className="search-input-wrapper">
            <Search className="search-icon w-4 h-4" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente o producto..."
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
              <th>Fecha de Venta</th> 
              <th>Cliente</th>
              <th>Producto</th>
              <th>Cantidad</th> 
              <th>Monto Total</th>
              {/* <th>Estado BPMN</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredSales.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                  No se encontraron registros en el archivo plano.
                </td>
              </tr>
            ) : (
              filteredSales.map((sale) => (
                <tr key={sale.id}>
                  <td className="cell-id">{sale.id}</td>
                  <td className="cell-date">{sale.fecha || 'Sin fecha'}</td> {/* Renderizado de fecha */}
                  <td className="cell-customer">{sale.cliente}</td>
                  <td>{sale.producto}</td>
                  <td style={{ textAlign: 'center' }}>{sale.cantidad || 1} u.</td> {/* Renderizado de cantidad */}
                  <td className="cell-amount">
                    S/ {(sale.monto || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td>
                    <span className={`status-badge ${sale.status ? sale.status.toLowerCase() : 'pendiente'}`}>
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}