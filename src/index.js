import express from 'express';

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
 * INICIO DEL SERVIDOR
 * ======================================================
 * La aplicación empieza a escuchar solicitudes y muestra
 * en la consola la dirección utilizada para acceder a ella.
 */
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
