#!/usr/bin/env bash

set -e

# ======================================================
# AYUDA DEL SCRIPT
# ======================================================
# Muestra los comandos disponibles para administrar los
# servicios definidos en Docker Compose.
mostrar_ayuda() {
  echo "Uso:"
  echo "  ./scripts/manage.sh up"
  echo "  ./scripts/manage.sh down"
  echo "  ./scripts/manage.sh build"
  echo "  ./scripts/manage.sh ps"
  echo "  ./scripts/manage.sh logs"
  echo "  ./scripts/manage.sh restart"
  echo "  ./scripts/manage.sh help"
  echo ""
  echo "Comandos:"
  echo "  up       Inicia los servicios en segundo plano."
  echo "  down     Detiene los servicios sin borrar volúmenes."
  echo "  build    Construye las imágenes de los servicios."
  echo "  ps       Muestra el estado de los contenedores."
  echo "  logs     Muestra y sigue los logs de los servicios."
  echo "  restart  Reinicia los servicios sin borrar volúmenes."
  echo "  help     Muestra esta ayuda."
}

# ======================================================
# ADMINISTRACIÓN DE DOCKER COMPOSE
# ======================================================
# Ejecuta una acción según el comando recibido. Cuando no
# se recibe ningún argumento, se muestra la ayuda.
comando="${1:-help}"

case "$comando" in
  up)
    echo "Iniciando los servicios..."
    docker compose up -d
    ;;
  down)
    echo "Deteniendo los servicios sin borrar los volúmenes..."
    docker compose down
    ;;
  build)
    echo "Construyendo las imágenes..."
    docker compose build
    ;;
  ps)
    echo "Consultando el estado de los contenedores..."
    docker compose ps
    ;;
  logs)
    echo "Mostrando los logs de los servicios..."
    docker compose logs -f
    ;;
  restart)
    echo "Reiniciando los servicios sin borrar los volúmenes..."
    docker compose down
    docker compose up -d
    ;;
  help)
    mostrar_ayuda
    ;;
  *)
    echo "Error: comando desconocido '$comando'." >&2
    echo "" >&2
    mostrar_ayuda >&2
    exit 1
    ;;
esac
