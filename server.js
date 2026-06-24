const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 1. Base de datos de inventario (en memoria)
let inventario = [
  { id: 1, name: 'Panes', category: 'Ingredientes', stock: 120, minStock: 50, unit: 'u.' },
  { id: 2, name: 'Tomates', category: 'Ingredientes', stock: 15, minStock: 20, unit: 'u.' },
  { id: 3, name: 'Papas', category: 'Ingredientes', stock: 45, minStock: 15, unit: 'kg' },
  { id: 4, name: 'Aceite', category: 'Ingredientes', stock: 3, minStock: 5, unit: 'L' },
  { id: 5, name: 'Bolsas', category: 'Desechables', stock: 300, minStock: 100, unit: 'u.' },
  { id: 6, name: 'Servilletas', category: 'Desechables', stock: 500, minStock: 150, unit: 'u.' },
  { id: 7, name: 'Cubiertos plásticos', category: 'Desechables', stock: 80, minStock: 100, unit: 'u.' }
];

// 2. Historial de ventas realizado (en memoria)
let ventas = [];

// ==========================================
// ENDPOINTS DE INVENTARIO
// ==========================================

// GET: Obtener todos los insumos
app.get('/api/inventario', (req, res) => {
  res.json(inventario);
});

// POST: Agregar un nuevo insumo
app.post('/api/inventario', (req, res) => {
  const { name, category, stock, minStock, unit } = req.body;
  if (!name || stock === undefined) {
    return res.status(400).json({ error: 'Nombre y stock son requeridos' });
  }

  const nuevoInsumo = {
    id: Date.now(),
    name,
    category,
    stock: parseFloat(stock),
    minStock: parseFloat(minStock) || 0,
    unit
  };

  inventario.unshift(nuevoInsumo);
  res.status(201).json(nuevoInsumo);
});

// PATCH: Modificar el stock manualmente (+ / -)
app.patch('/api/inventario/:id/stock', (req, res) => {
  const id = parseInt(req.params.id);
  const { cantidad } = req.body;

  const insumo = inventario.find(p => p.id === id);
  if (!insumo) return res.status(404).json({ error: 'Insumo no encontrado' });

  insumo.stock = Math.max(0, insumo.stock + parseFloat(cantidad));
  insumo.stock = Number(insumo.stock.toFixed(2));

  res.json(insumo);
});

// DELETE: Eliminar un insumo
app.delete('/api/inventario/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = inventario.findIndex(p => p.id === id);

  if (index === -1) return res.status(404).json({ error: 'Insumo no encontrado' });

  inventario.splice(index, 1);
  res.json({ message: 'Insumo eliminado correctamente', id });
});


// ==========================================
// NUEVO: ENDPOINTS DE VENTAS
// ==========================================

// GET: Obtener el historial de todas las ventas realizadas
app.get('/api/ventas', (req, res) => {
  res.json(ventas);
});

// POST: Registrar una nueva venta (Resta del inventario automáticamente)
app.post('/api/ventas', (req, res) => {
  const { insumoId, cantidadVendida, totalDinero } = req.body;

  // Validaciones iniciales
  if (!insumoId || !cantidadVendida || cantidadVendida <= 0) {
    return res.status(400).json({ error: 'ID de insumo y cantidad válida requeridos.' });
  }

  // Buscar el producto en el inventario
  const insumo = inventario.find(p => p.id === parseInt(insumoId));
  
  if (!insumo) {
    return res.status(404).json({ error: 'El insumo seleccionado no existe en el inventario.' });
  }

  // Verificar si hay suficiente cantidad en el stock para cubrir la venta
  if (insumo.stock < cantidadVendida) {
    return res.status(400).json({ 
      error: `Stock insuficiente. Intentas vender ${cantidadVendida} ${insumo.unit} de ${insumo.name} pero solo quedan ${insumo.stock} ${insumo.unit}.` 
    });
  }

  // Descontar la cantidad vendida del inventario
  insumo.stock = Math.max(0, insumo.stock - parseFloat(cantidadVendida));
  insumo.stock = Number(insumo.stock.toFixed(2)); // Corregir decimales flotantes de JS

  // Crear el ticket/registro de venta
  const nuevaVenta = {
    id: `VTA-${Date.now()}`,
    insumoId: insumo.id,
    insumoName: insumo.name,
    cantidadVendida: parseFloat(cantidadVendida),
    unit: insumo.unit,
    totalDinero: parseFloat(totalDinero) || 0, // Opcional, por si llevas caja registradora
    fecha: new Date().toISOString()
  };

  // Guardar en el historial de ventas
  ventas.unshift(nuevaVenta);

  // Devolver la venta registrada y el estado actualizado del insumo para actualizar el Frontend
  res.status(201).json({
    message: 'Venta registrada con éxito y stock actualizado.',
    venta: nuevaVenta,
    insumoActualizado: insumo
  });
});

app.listen(PORT, () => {
  console.log(`Servidor de inventario y ventas corriendo en http://localhost:${PORT}`);
});