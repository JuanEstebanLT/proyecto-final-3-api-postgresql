import express from 'express';
import pool from './db.js';

/*
 * ======================================================
 * CONFIGURACIÓN PRINCIPAL DE LA API
 * ======================================================
 * Este bloque crea la aplicación de Express, permite
 * recibir datos JSON y define el puerto del servidor.
 */
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

/*
 * ======================================================
 * VALIDACIONES REUTILIZABLES
 * ======================================================
 * Estas funciones comprueban los identificadores y los
 * datos recibidos antes de ejecutar consultas en la base.
 */
const obtenerIdValido = (valor) => {
  const id = Number(valor);

  return Number.isInteger(id) && id > 0 ? id : null;
};

const productoEsValido = (producto) => {
  if (!producto || typeof producto !== 'object' || Array.isArray(producto)) {
    return false;
  }

  const { nombre, precio, stock } = producto;

  return (
    typeof nombre === 'string'
    && nombre.trim() !== ''
    && typeof precio === 'number'
    && Number.isFinite(precio)
    && precio >= 0
    && Number.isInteger(stock)
    && stock >= 0
  );
};

/*
 * ======================================================
 * RUTA PRINCIPAL
 * ======================================================
 * Esta ruta permite comprobar que la API está funcionando
 * y responde correctamente con el código HTTP 200.
 */
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API Proyecto 3 funcionando' });
});

/*
 * ======================================================
 * RUTA DE ESTADO
 * ======================================================
 * Esta ruta entrega una respuesta sencilla que indica que
 * el servicio se encuentra disponible.
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

/*
 * ======================================================
 * OBTENER TODOS LOS PRODUCTOS
 * ======================================================
 * Consulta los productos ordenados por su identificador y
 * responde con un arreglo JSON y el código HTTP 200.
 */
app.get('/api/productos', async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT id, nombre, precio, stock, created_at
      FROM productos
      ORDER BY id;
    `);

    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error('Error al consultar los productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/*
 * ======================================================
 * OBTENER UN PRODUCTO POR ID
 * ======================================================
 * Valida el identificador y utiliza una consulta con $1
 * para buscar el producto de forma parametrizada.
 */
app.get('/api/productos/:id', async (req, res) => {
  const id = obtenerIdValido(req.params.id);

  if (!id) {
    return res.status(400).json({ error: 'ID de producto inválido' });
  }

  try {
    const resultado = await pool.query(
      `SELECT id, nombre, precio, stock, created_at
       FROM productos
       WHERE id = $1;`,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al consultar el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/*
 * ======================================================
 * CREAR UN PRODUCTO
 * ======================================================
 * Valida nombre, precio y stock antes de insertar el nuevo
 * registro mediante parámetros. La creación correcta usa 201.
 */
app.post('/api/productos', async (req, res) => {
  if (!productoEsValido(req.body)) {
    return res.status(400).json({ error: 'Datos de producto inválidos' });
  }

  const { nombre, precio, stock } = req.body;

  try {
    const resultado = await pool.query(
      `INSERT INTO productos (nombre, precio, stock)
       VALUES ($1, $2, $3)
       RETURNING id, nombre, precio, stock, created_at;`,
      [nombre.trim(), precio, stock]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/*
 * ======================================================
 * ACTUALIZAR UN PRODUCTO
 * ======================================================
 * Valida el ID y los datos enviados. La consulta actualiza
 * el registro y devuelve el producto con sus nuevos valores.
 */
app.put('/api/productos/:id', async (req, res) => {
  const id = obtenerIdValido(req.params.id);

  if (!id) {
    return res.status(400).json({ error: 'ID de producto inválido' });
  }

  if (!productoEsValido(req.body)) {
    return res.status(400).json({ error: 'Datos de producto inválidos' });
  }

  const { nombre, precio, stock } = req.body;

  try {
    const resultado = await pool.query(
      `UPDATE productos
       SET nombre = $1, precio = $2, stock = $3
       WHERE id = $4
       RETURNING id, nombre, precio, stock, created_at;`,
      [nombre.trim(), precio, stock, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/*
 * ======================================================
 * ELIMINAR UN PRODUCTO
 * ======================================================
 * Valida el ID y elimina el registro con una consulta
 * parametrizada. Si no existe, responde con el código 404.
 */
app.delete('/api/productos/:id', async (req, res) => {
  const id = obtenerIdValido(req.params.id);

  if (!id) {
    return res.status(400).json({ error: 'ID de producto inválido' });
  }

  try {
    const resultado = await pool.query(
      'DELETE FROM productos WHERE id = $1 RETURNING id;',
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/*
 * ======================================================
 * INICIO DEL SERVIDOR
 * ======================================================
 * La aplicación empieza a escuchar solicitudes y muestra
 * en la consola la dirección utilizada para acceder a ella.
 */
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
