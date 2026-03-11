# Script de prueba de API - BarbersiteApp (PowerShell)
# Uso: .\test-api.ps1

$API_URL = "http://localhost:4000/api"
$TOKEN = ""

# Función para imprimir con colores
function Write-ColorOutput {
    param(
        [string]$color,
        [string]$message
    )
    Write-Host $message -ForegroundColor $color
}

Write-ColorOutput Yellow "=== BarbersiteApp API Test Suite ==="
Write-Host ""

# 1. Test de Autenticación
Write-ColorOutput Yellow "1. Probando autenticación..."
try {
    $loginBody = @{
        email = "juanperez@barber.com"
        password = "admin123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$API_URL/auth/login" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $loginBody

    $TOKEN = $loginResponse.token

    if ([string]::IsNullOrEmpty($TOKEN)) {
        Write-ColorOutput Red "Error: No se pudo obtener token"
        exit 1
    }

    Write-ColorOutput Green "Token obtenido correctamente"
} catch {
    Write-ColorOutput Red "Error de autenticacion: $_"
    exit 1
}

Write-Host ""

# Función auxiliar para hacer requests
function Test-Endpoint {
    param(
        [int]$Number,
        [string]$Endpoint,
        [string]$Name
    )

    Write-ColorOutput Yellow "$Number. Probando GET /$Endpoint"
    try {
        $response = Invoke-RestMethod -Uri "$API_URL/$Endpoint" `
            -Method GET `
            -Headers @{"Authorization" = "Bearer $TOKEN"}

        Write-ColorOutput Green "OK - $Name obtenidos"
    } catch {
        Write-ColorOutput Red "Error en $Endpoint : $_"
    }
    Write-Host ""
}

# Ejecutar tests
Test-Endpoint 2 "roles" "Roles"
Test-Endpoint 3 "usuarios" "Usuarios"
Test-Endpoint 4 "clientes" "Clientes"
Test-Endpoint 5 "barberos" "Barberos"
Test-Endpoint 6 "marcas" "Marcas"
Test-Endpoint 7 "categorias-productos" "Categorias"
Test-Endpoint 8 "productos" "Productos"
Test-Endpoint 9 "servicios" "Servicios"
Test-Endpoint 10 "compras" "Compras"
Test-Endpoint 11 "ventas" "Ventas"
Test-Endpoint 12 "citas" "Citas"
Test-Endpoint 13 "permisos" "Permisos"
Test-Endpoint 14 "tipos-documento" "Tipos de documento"
Test-Endpoint 15 "alquiler-silla" "Alquileres"
Test-Endpoint 16 "disponibilidad-excepcion" "Disponibilidades"
Test-Endpoint 17 "devoluciones-proveedor" "Devoluciones"
Test-Endpoint 18 "consignaciones-proveedor" "Consignaciones"

Write-ColorOutput Green "=== Pruebas completadas ==="

