-- ======================================================
-- TABLA DE PRODUCTOS
-- ======================================================
-- Esta tabla almacena la información de los productos que
-- serán consultados y administrados mediante la API REST.
CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  precio NUMERIC(12,2) NOT NULL CHECK (precio >= 0),
  stock INTEGER NOT NULL CHECK (stock >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================
-- DATOS INICIALES
-- ======================================================
-- Estos productos permiten comprobar el funcionamiento del
-- endpoint GET /api/productos al crear la base por primera vez.
INSERT INTO productos (nombre, precio, stock) VALUES
  ('Teclado', 85000.00, 10),
  ('Mouse', 45000.00, 15),
  ('Monitor', 750000.00, 5);
