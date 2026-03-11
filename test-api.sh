#!/bin/bash

# Script de prueba de API - BarbersiteApp
# Uso: ./test-api.sh

API_URL="http://localhost:4000/api"
TOKEN=""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== BarbersiteApp API Test Suite ===${NC}\n"

# 1. Test de Autenticación
echo -e "${YELLOW}1. Probando autenticación...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juanperez@barber.com",
    "password": "admin123"
  }')

echo "Response: $LOGIN_RESPONSE"
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Error: No se pudo obtener token${NC}\n"
  exit 1
fi

echo -e "${GREEN}✓ Token obtenido: ${TOKEN:0:20}...${NC}\n"

# 2. Test de Roles
echo -e "${YELLOW}2. Probando GET /roles${NC}"
ROLES=$(curl -s -X GET "$API_URL/roles" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $ROLES"
echo -e "${GREEN}✓ Roles obtenidos${NC}\n"

# 3. Test de Usuarios
echo -e "${YELLOW}3. Probando GET /usuarios${NC}"
USUARIOS=$(curl -s -X GET "$API_URL/usuarios" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $USUARIOS"
echo -e "${GREEN}✓ Usuarios obtenidos${NC}\n"

# 4. Test de Clientes
echo -e "${YELLOW}4. Probando GET /clientes${NC}"
CLIENTES=$(curl -s -X GET "$API_URL/clientes" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $CLIENTES"
echo -e "${GREEN}✓ Clientes obtenidos${NC}\n"

# 5. Test de Barberos
echo -e "${YELLOW}5. Probando GET /barberos${NC}"
BARBEROS=$(curl -s -X GET "$API_URL/barberos" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $BARBEROS"
echo -e "${GREEN}✓ Barberos obtenidos${NC}\n"

# 6. Test de Marcas
echo -e "${YELLOW}6. Probando GET /marcas${NC}"
MARCAS=$(curl -s -X GET "$API_URL/marcas" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $MARCAS"
echo -e "${GREEN}✓ Marcas obtenidas${NC}\n"

# 7. Test de Categorías
echo -e "${YELLOW}7. Probando GET /categorias-productos${NC}"
CATEGORIAS=$(curl -s -X GET "$API_URL/categorias-productos" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $CATEGORIAS"
echo -e "${GREEN}✓ Categorías obtenidas${NC}\n"

# 8. Test de Productos
echo -e "${YELLOW}8. Probando GET /productos${NC}"
PRODUCTOS=$(curl -s -X GET "$API_URL/productos" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $PRODUCTOS"
echo -e "${GREEN}✓ Productos obtenidos${NC}\n"

# 9. Test de Servicios
echo -e "${YELLOW}9. Probando GET /servicios${NC}"
SERVICIOS=$(curl -s -X GET "$API_URL/servicios" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $SERVICIOS"
echo -e "${GREEN}✓ Servicios obtenidos${NC}\n"

# 10. Test de Compras
echo -e "${YELLOW}10. Probando GET /compras${NC}"
COMPRAS=$(curl -s -X GET "$API_URL/compras" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $COMPRAS"
echo -e "${GREEN}✓ Compras obtenidas${NC}\n"

# 11. Test de Ventas
echo -e "${YELLOW}11. Probando GET /ventas${NC}"
VENTAS=$(curl -s -X GET "$API_URL/ventas" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $VENTAS"
echo -e "${GREEN}✓ Ventas obtenidas${NC}\n"

# 12. Test de Citas
echo -e "${YELLOW}12. Probando GET /citas${NC}"
CITAS=$(curl -s -X GET "$API_URL/citas" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $CITAS"
echo -e "${GREEN}✓ Citas obtenidas${NC}\n"

# 13. Test de Permisos
echo -e "${YELLOW}13. Probando GET /permisos${NC}"
PERMISOS=$(curl -s -X GET "$API_URL/permisos" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $PERMISOS"
echo -e "${GREEN}✓ Permisos obtenidos${NC}\n"

# 14. Test de Tipos de Documento
echo -e "${YELLOW}14. Probando GET /tipos-documento${NC}"
TIPOS=$(curl -s -X GET "$API_URL/tipos-documento" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $TIPOS"
echo -e "${GREEN}✓ Tipos de documento obtenidos${NC}\n"

# 15. Test de Alquiler Silla
echo -e "${YELLOW}15. Probando GET /alquiler-silla${NC}"
ALQUILER=$(curl -s -X GET "$API_URL/alquiler-silla" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $ALQUILER"
echo -e "${GREEN}✓ Alquileres obtenidos${NC}\n"

echo -e "${GREEN}=== Todas las pruebas completadas exitosamente ===${NC}"
