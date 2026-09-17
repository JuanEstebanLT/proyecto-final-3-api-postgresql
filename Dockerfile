# ======================================================
# IMAGEN BASE
# ======================================================
# Se utiliza Node.js sobre Alpine para mantener una imagen
# sencilla y de menor tamaño.
FROM node:22-alpine

# ======================================================
# DIRECTORIO DE TRABAJO
# ======================================================
# Las siguientes instrucciones se ejecutan dentro de esta
# carpeta de la imagen.
WORKDIR /app

# ======================================================
# INSTALACIÓN DE DEPENDENCIAS
# ======================================================
# Se copian primero los archivos de npm para aprovechar la
# caché y se instalan únicamente dependencias de producción.
COPY package*.json ./
RUN npm ci --omit=dev

# ======================================================
# CÓDIGO FUENTE
# ======================================================
# La imagen necesita solamente el código de la API.
COPY src ./src

# ======================================================
# PUERTO E INICIO DE LA APLICACIÓN
# ======================================================
# La API escucha en el puerto 3000 y se inicia mediante el
# script start definido en package.json.
EXPOSE 3000
CMD ["npm", "start"]
