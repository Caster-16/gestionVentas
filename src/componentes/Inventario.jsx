import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Trash2, AlertTriangle, Package, SlidersHorizontal } from 'lucide-react';
import'../styles/inventario.css';

const API_URL = 'http://localhost:5000/api/inventario';

export default function Inventario() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [filterStockBajo, setFilterStockBajo] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Formulario nuevo producto
  const [newProduct, setNewProduct] = useState({
    name: '', category: 'Ingredientes', stock: '', minStock: '', unit: 'u.'
  });

  // 1. Cargar datos del Backend al iniciar
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error conectando al backend:", err);
        setLoading(false);
      });
  }, []);

  const categories = ['Todas', 'Ingredientes', 'Desechables'];

  // Filtrado optimizado en memoria
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
      const matchesStockBajo = !filterStockBajo || product.stock <= product.minStock;
      return matchesSearch && matchesCategory && matchesStockBajo;
    });
  }, [products, searchTerm, selectedCategory, filterStockBajo]);

  // 2. BACKEND: Cambiar Stock (+ / -)
  const handleStockChange = async (id, amount) => {
    try {
      const response = await fetch(`${API_URL}/${id}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad: amount })
      });
      
      if (response.ok) {
        const updatedProduct = await response.json();
        // Sincronizar estado local con el backend
        setProducts(products.map(p => p.id === id ? updatedProduct : p));
      }
    } catch (error) {
      console.error("Error al actualizar stock:", error);
    }
  };

  // 3. BACKEND: Eliminar Producto
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este insumo?')) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error("Error al eliminar insumo:", error);
    }
  };

  // 4. BACKEND: Crear Producto
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || newProduct.stock === '') return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          category: newProduct.category,
          stock: parseFloat(newProduct.stock),
          minStock: parseFloat(newProduct.minStock) || 0,
          unit: newProduct.unit
        })
      });

      if (response.ok) {
        const createdProduct = await response.json();
        setProducts([createdProduct, ...products]); // Agregar al inicio de la tabla
        setIsModalOpen(false);
        setNewProduct({ name: '', category: 'Ingredientes', stock: '', minStock: '', unit: 'u.' });
      }
    } catch (error) {
      console.error("Error al crear insumo:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 font-medium">
        Cargando inventario desde el servidor...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen font-sans text-gray-800">
      
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-8 w-8 text-emerald-600" />
            Inventario Conectado (BD)
          </h1>
          <p className="text-sm text-gray-500 mt-1">Los cambios se guardan automáticamente en el servidor.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-lg transition shadow-sm"
        >
          <Plus className="h-5 w-5" /> Agregar Insumo
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar pan, papas, bolsas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
          <SlidersHorizontal className="h-4 w-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <button
            onClick={() => setFilterStockBajo(!filterStockBajo)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
              filterStockBajo 
                ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <AlertTriangle className="h-4 w-4" /> Stock Bajo
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Insumo</th>
                <th className="p-4">Tipo</th>
                <th className="p-4 text-center">Stock Actual</th>
                <th className="p-4 text-center">Mínimo</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const isLowStock = product.stock <= product.minStock;
                  return (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-4 font-semibold text-gray-900">{product.name}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          product.category === 'Ingredientes' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                        }`}>
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-base font-bold ${isLowStock ? 'text-amber-600' : 'text-gray-800'}`}>
                          {product.stock} <span className="text-xs font-normal text-gray-500">{product.unit}</span>
                        </span>
                      </td>
                      <td className="p-4 text-center text-gray-500">{product.minStock} {product.unit}</td>
                      <td className="p-4 text-center">
                        {isLowStock ? (
                          <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md text-xs font-semibold">Reordenar</span>
                        ) : (
                          <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-xs font-semibold">Ok</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleStockChange(product.id, -1)} className="bg-gray-100 hover:bg-gray-200 h-8 w-8 rounded font-bold">-</button>
                          <button onClick={() => handleStockChange(product.id, 1)} className="bg-gray-100 hover:bg-gray-200 h-8 w-8 rounded font-bold">+</button>
                          <div className="w-px h-6 bg-gray-200 mx-1"></div>
                          <button onClick={() => handleDeleteProduct(product.id)} className="text-gray-400 hover:text-red-600 p-1.5"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="6" className="p-8 text-center text-gray-400">Sin resultados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl border w-full max-w-md overflow-hidden">
            <div className="bg-emerald-600 p-4 text-white flex justify-between items-center">
              <h3 className="font-bold text-lg">Añadir Nuevo Insumo</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white font-bold">✕</button>
            </div>
            <form onSubmit={handleCreateProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nombre *</label>
                <input type="text" required placeholder="Ej: Tomates" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full border rounded-lg p-2 text-sm outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Tipo</label>
                  <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full border rounded-lg p-2 text-sm bg-white">
                    <option value="Ingredientes">Ingredientes</option>
                    <option value="Desechables">Desechables</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Unidad</label>
                  <select value={newProduct.unit} onChange={e => setNewProduct({...newProduct, unit: e.target.value})} className="w-full border rounded-lg p-2 text-sm bg-white">
                    <option value="u.">Unidades (u.)</option>
                    <option value="kg">Kilos (kg)</option>
                    <option value="L">Litros (L)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Stock Inicial *</label>
                  <input type="number" step="0.01" min="0" required placeholder="0" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className="w-full border rounded-lg p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Mínimo Alerta</label>
                  <input type="number" step="0.01" min="0" placeholder="0" value={newProduct.minStock} onChange={e => setNewProduct({...newProduct, minStock: e.target.value})} className="w-full border rounded-lg p-2 text-sm" />
                </div>
              </div>
              <div className="pt-4 flex gap-3 justify-end text-sm">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}