# 🚛 HINO CONNECT API - Documentación Técnica Completa

API REST reactiva para gestión de flota de vehículos HINO usando Spring Boot WebFlux y PostgreSQL (Neon).

## 📋 Tabla de Contenidos

1. [Tecnologías y Dependencias](#-tecnologías-y-dependencias)
2. [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
3. [Estructura de Carpetas](#-estructura-de-carpetas)
4. [Configuración](#-configuración)
5. [Modelos de Datos](#-modelos-de-datos)
6. [Seguridad y Autenticación](#-seguridad-y-autenticación)
7. [Endpoints API](#-endpoints-api)
8. [Instalación y Ejecución](#-instalación-y-ejecución)
9. [Testing](#-testing)

---

## 🚀 Tecnologías y Dependencias

### Framework Principal
- **Spring Boot 3.5.6** - Framework base para aplicaciones Java
- **Spring WebFlux** - Programación reactiva no bloqueante
- **Java 17** - Versión LTS de Java

### Base de Datos
- **Spring Data R2DBC** - Acceso reactivo a bases de datos relacionales
- **R2DBC PostgreSQL Driver** - Driver reactivo para PostgreSQL
- **PostgreSQL** - Base de datos relacional (Neon Cloud)

### Seguridad
- **Spring Security** - Framework de seguridad
- **JJWT 0.12.5** - Librería para generación y validación de tokens JWT
  - `jjwt-api` - API principal
  - `jjwt-impl` - Implementación
  - `jjwt-jackson` - Integración con Jackson

### Documentación
- **SpringDoc OpenAPI 2.7.0** - Generación automática de documentación API
- **Swagger UI** - Interfaz visual para probar endpoints

### Validación
- **Spring Boot Starter Validation** - Validación de datos con Jakarta Bean Validation

### Utilidades
- **Lombok** - Reducción de código boilerplate (getters, setters, constructores)
- **Project Reactor** - Librería de programación reactiva

### Testing
- **Spring Boot Starter Test** - Testing con JUnit 5
- **Reactor Test** - Testing para código reactivo
- **Spring Security Test** - Testing de seguridad

---

## 🏗️ Arquitectura del Proyecto

### Patrón de Diseño: Arquitectura en Capas

```
┌─────────────────────────────────────┐
│         CONTROLLER LAYER            │  ← REST Controllers (API Endpoints)
│  (Manejo de peticiones HTTP)        │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│          SERVICE LAYER              │  ← Lógica de negocio
│  (Reglas de negocio y validaciones) │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│        REPOSITORY LAYER             │  ← Acceso a datos (R2DBC)
│  (Operaciones CRUD reactivas)       │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         DATABASE LAYER              │  ← PostgreSQL (Neon)
│  (Almacenamiento persistente)       │
└─────────────────────────────────────┘
```

### Flujo de Datos Reactivo

```
Cliente → Controller → Service → Repository → Database
   ↓         ↓          ↓           ↓            ↓
  HTTP    Mono/Flux  Mono/Flux  Mono/Flux    PostgreSQL
```

---

## 📁 Estructura de Carpetas

```
ms-catalogo-vehiculos/
│
├── src/
│   ├── main/
│   │   ├── java/pe/edu/vallegrande/ms_catalogo_vehiculos/
│   │   │   │
│   │   │   ├── config/                    # ⚙️ Configuraciones
│   │   │   │   ├── CorsConfig.java        # Configuración CORS
│   │   │   │   ├── OpenApiConfig.java     # Configuración Swagger
│   │   │   │   └── R2dbcConfig.java       # Configuración R2DBC
│   │   │   │
│   │   │   ├── controller/                # 🎮 Controladores REST
│   │   │   │   ├── AuthController.java    # Autenticación
│   │   │   │   ├── RolController.java     # CRUD Roles
│   │   │   │   ├── UsuarioController.java # CRUD Usuarios
│   │   │   │   ├── ConductorController.java # CRUD Conductores
│   │   │   │   ├── VehiculoController.java  # CRUD Vehículos
│   │   │   │   └── MovimientoController.java # CRUD Movimientos
│   │   │   │
│   │   │   ├── dto/                       # 📦 Data Transfer Objects
│   │   │   │   ├── ApiResponse.java       # Respuesta estándar API
│   │   │   │   ├── LoginRequest.java      # Request de login
│   │   │   │   └── LoginResponse.java     # Response de login
│   │   │   │
│   │   │   ├── exception/                 # ⚠️ Manejo de excepciones
│   │   │   │   └── GlobalExceptionHandler.java
│   │   │   │
│   │   │   ├── model/                     # 🗂️ Entidades del dominio
│   │   │   │   ├── Rol.java
│   │   │   │   ├── Usuario.java
│   │   │   │   ├── Conductor.java
│   │   │   │   ├── Vehiculo.java
│   │   │   │   └── Movimiento.java
│   │   │   │
│   │   │   ├── repository/                # 💾 Repositorios R2DBC
│   │   │   │   ├── RolRepository.java
│   │   │   │   ├── UsuarioRepository.java
│   │   │   │   ├── ConductorRepository.java
│   │   │   │   ├── VehiculoRepository.java
│   │   │   │   └── MovimientoRepository.java
│   │   │   │
│   │   │   ├── security/                  # 🔒 Seguridad
│   │   │   │   ├── JwtUtil.java           # Utilidades JWT
│   │   │   │   └── SecurityConfig.java    # Configuración Spring Security
│   │   │   │
│   │   │   ├── service/                   # 💼 Servicios
│   │   │   │   ├── AuthService.java       # Servicio de autenticación
│   │   │   │   ├── RolService.java
│   │   │   │   ├── UsuarioService.java
│   │   │   │   ├── ConductorService.java
│   │   │   │   ├── VehiculoService.java
│   │   │   │   └── MovimientoService.java
│   │   │   │
│   │   │   └── HinoPeruCatalogoVehiculosApplication.java  # 🚀 Main
│   │   │
│   │   └── resources/
│   │       ├── application.yml            # Configuración principal
│   │       └── application-prod.yml       # Configuración producción (opcional)
│   │
│   └── test/                              # 🧪 Tests
│
├── pom.xml                                # Maven dependencies
└── README-API.md                          # Esta documentación
```

---

## ⚙️ Configuración

### 1. Base de Datos (application.yml)

```yaml
spring:
  application:
    name: hino-connect-api
  
  # Configuración R2DBC (Reactive Database Connectivity)
  r2dbc:
    url: r2dbc:postgresql://ep-shy-recipe-ad84kx35-pooler.c-2.us-east-1.aws.neon.tech:5432/neondb?sslmode=require
    username: neondb_owner
    password: npg_Eo9ldCsZ7AKr

server:
  port: 8080

# Configuración JWT
jwt:
  secret: hinoconnect2024secretkeysupersecureandlongforproduction
  expiration: 86400000  # 24 horas en milisegundos

# Configuración Swagger/OpenAPI
springdoc:
  api-docs:
    path: /api-docs
  swagger-ui:
    path: /swagger-ui.html
    enabled: true

# Logs para debugging
logging:
  level:
    org.springframework.r2dbc: DEBUG
    io.r2dbc.postgresql: DEBUG
```

### 2. Configuración CORS (CorsConfig.java)

Permite peticiones desde cualquier origen (frontend):

```java
- Métodos permitidos: GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD
- Headers permitidos: Authorization, Content-Type, Accept, etc.
- Credenciales: Habilitadas
- Max Age: 3600 segundos (1 hora)
```

### 3. Configuración de Seguridad (SecurityConfig.java)

```java
- Rutas públicas: /api/v1/auth/**, /swagger-ui/**, /api-docs/**
- Rutas GET: Públicas (lectura sin autenticación)
- Rutas POST/PUT/DELETE: Requieren autenticación JWT
- CSRF: Deshabilitado (API REST stateless)
- Password Encoder: BCrypt
```

### 4. Configuración R2DBC (R2dbcConfig.java)

```java
- Repositorios: Habilitados en paquete repository
- Auditoría: Habilitada (@EnableR2dbcAuditing)
- Transaction Manager: Reactivo (R2dbcTransactionManager)
```

---

## 🗂️ Modelos de Datos

### 1. Rol
```java
{
  "id": Integer,
  "nombre": String,           // UNIQUE, NOT NULL
  "descripcion": String,
  "createdAt": LocalDateTime,
  "updatedAt": LocalDateTime,
  "deletedAt": LocalDateTime  // Soft delete
}
```

### 2. Usuario
```java
{
  "id": Integer,
  "email": String,            // UNIQUE, NOT NULL
  "passwordHash": String,     // Encriptado con BCrypt
  "nombre": String,
  "apellido": String,
  "telefono": String,
  "rolId": Integer,           // FK → roles(id)
  "activo": Boolean,
  "ultimoLogin": LocalDateTime,
  "createdAt": LocalDateTime,
  "updatedAt": LocalDateTime,
  "deletedAt": LocalDateTime
}
```

### 3. Conductor
```java
{
  "id": Integer,
  "codigo": String,           // UNIQUE, NOT NULL (ej: C001)
  "nombre": String,
  "apellido": String,
  "dni": String,              // UNIQUE, NOT NULL
  "telefono": String,
  "licencia": String,
  "vehiculoAsignado": String,
  "estado": String,           // Activo, Inactivo, En Viaje
  "fechaIngreso": LocalDate,
  "activo": Boolean,
  "createdAt": LocalDateTime,
  "updatedAt": LocalDateTime,
  "deletedAt": LocalDateTime
}
```

### 4. Vehículo
```java
{
  "id": Integer,
  "codigo": String,           // UNIQUE, NOT NULL (ej: V0001)
  "placa": String,            // UNIQUE, NOT NULL
  "marca": String,            // Hino
  "modelo": String,
  "tipo": String,             // Camión, Semitrailer, etc.
  "anioFabricacion": Integer,
  "numeroChasis": String,
  "capacidadCarga": BigDecimal, // en kg
  "combustible": String,      // Diesel, Gasolina, etc.
  "estadoActual": String,     // En operación, En mantenimiento, Disponible, Inactivo
  "imagenUrl": String,
  "activo": Boolean,
  "createdAt": LocalDateTime,
  "updatedAt": LocalDateTime,
  "deletedAt": LocalDateTime
}
```

### 5. Movimiento
```java
{
  "id": Integer,
  "codigo": String,           // UNIQUE, NOT NULL (ej: MOV-001)
  "vehiculoId": Integer,      // FK → vehiculos(id)
  "conductorId": Integer,     // FK → conductores(id)
  "origen": String,
  "destino": String,
  "fechaHoraSalida": LocalDateTime,
  "fechaHoraLlegadaEstimada": LocalDateTime,
  "fechaHoraLlegadaReal": LocalDateTime,
  "tipoMovimiento": String,   // Transporte de carga, Viaje vacío, etc.
  "cargaPasajeros": String,
  "estado": String,           // Programado, En curso, Completado, Cancelado, Inactivo
  "observaciones": String,
  "createdAt": LocalDateTime,
  "updatedAt": LocalDateTime,
  "deletedAt": LocalDateTime
}
```

---

## 🔒 Seguridad y Autenticación

### Flujo de Autenticación JWT

```
1. Cliente envía credenciales → POST /api/v1/auth/login
2. Backend valida usuario y password (BCrypt)
3. Backend genera token JWT (válido 24h)
4. Cliente recibe token
5. Cliente incluye token en header: Authorization: Bearer {token}
6. Backend valida token en cada petición protegida
```

### Generación de Token JWT

```java
Token contiene:
- Subject: email del usuario
- Claims: nombre completo, rol
- Issued At: fecha de emisión
- Expiration: fecha de expiración (24h)
- Signature: firmado con HMAC-SHA256
```

### Encriptación de Passwords

```java
- Algoritmo: BCrypt
- Rounds: 10 (por defecto)
- Salt: Generado automáticamente
```

### Endpoints Públicos vs Protegidos

| Tipo | Endpoints | Autenticación |
|------|-----------|---------------|
| Público | `/api/v1/auth/**` | ❌ No requerida |
| Público | `/swagger-ui/**`, `/api-docs/**` | ❌ No requerida |
| Público | `GET /api/v1/**` | ❌ No requerida |
| Protegido | `POST /api/v1/**` | ✅ JWT requerido |
| Protegido | `PUT /api/v1/**` | ✅ JWT requerido |
| Protegido | `DELETE /api/v1/**` | ✅ JWT requerido |

---

## 🚀 Instalación y Ejecución

### Requisitos Previos

- Java 17 o superior
- Maven 3.6+
- Conexión a internet (para Neon PostgreSQL)

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd ms-catalogo-vehiculos
```

### 2. Compilar el Proyecto

```bash
# Windows
mvnw.cmd clean install

# Linux/Mac
./mvnw clean install
```

### 3. Ejecutar la Aplicación

```bash
# Windows
mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

### 4. Verificar que está Funcionando

```bash
# Health check
curl http://localhost:8080/api/v1/roles

# Debería retornar lista de roles
```

### 5. Acceder a Swagger UI

Abre en tu navegador:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api-docs

---

## 🧪 Testing

### Probar Login

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hinoconnect.com",
    "password": "admin123"
  }'
```

### Probar Endpoint Protegido

```bash
# 1. Obtener token del login anterior
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 2. Usar token en petición
curl -X POST http://localhost:8080/api/v1/vehiculos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "codigo": "V0010",
    "placa": "XYZ-999",
    "marca": "HINO",
    "modelo": "GH-500",
    "tipo": "Camión",
    "anioFabricacion": 2024,
    "capacidadCarga": 15000,
    "combustible": "Diesel",
    "estadoActual": "Disponible",
    "activo": true
  }'
```

---

## 📡 Endpoints API

### Formato de Respuesta Estándar

Todas las respuestas siguen este formato:

```json
{
  "success": boolean,
  "message": string,
  "data": object | array | null
}
```

**Ejemplo de éxito:**
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": { ... }
}
```

**Ejemplo de error:**
```json
{
  "success": false,
  "message": "Error: Usuario no encontrado",
  "data": null
}
```

### � Adutenticación

#### POST /api/v1/auth/login
Autentica un usuario y retorna token JWT.

**Request:**
```json
{
  "email": "admin@hinoconnect.com",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "email": "admin@hinoconnect.com",
    "nombre": "Admin Sistema",
    "rol": "ADMIN"
  }
}
```

---

### 👥 Roles

#### GET /api/v1/roles
Lista todos los roles activos.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": [
    {
      "id": 1,
      "nombre": "ADMIN",
      "descripcion": "Administrador del sistema",
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-01T10:00:00",
      "deletedAt": null
    }
  ]
}
```

#### GET /api/v1/roles/{id}
Obtiene un rol por ID.

#### POST /api/v1/roles
Crea un nuevo rol.

**Request:**
```json
{
  "nombre": "SUPERVISOR",
  "descripcion": "Supervisor de operaciones"
}
```

#### PUT /api/v1/roles/{id}
Actualiza un rol existente.

#### DELETE /api/v1/roles/{id}
Elimina un rol (soft delete).

---

### 👤 Usuarios

#### GET /api/v1/usuarios
Lista todos los usuarios activos.

#### GET /api/v1/usuarios/{id}
Obtiene un usuario por ID.

#### POST /api/v1/usuarios
Crea un nuevo usuario.

**Request:**
```json
{
  "email": "nuevo@hinoconnect.com",
  "passwordHash": "password123",
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "987654321",
  "rolId": 2,
  "activo": true
}
```

**Nota:** El password se encripta automáticamente con BCrypt.

#### PUT /api/v1/usuarios/{id}
Actualiza un usuario existente.

#### DELETE /api/v1/usuarios/{id}
Elimina un usuario (soft delete).

---

### 🚗 Conductores

#### GET /api/v1/conductores
Lista todos los conductores activos.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": [
    {
      "id": 1,
      "codigo": "C001",
      "nombre": "Carlos",
      "apellido": "Rodríguez",
      "dni": "12345678",
      "telefono": "987111222",
      "licencia": "A-III-a",
      "vehiculoAsignado": "HINO-GH-001",
      "estado": "Activo",
      "fechaIngreso": "2023-01-15",
      "activo": true,
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-01T10:00:00",
      "deletedAt": null
    }
  ]
}
```

#### GET /api/v1/conductores/{id}
Obtiene un conductor por ID.

#### GET /api/v1/conductores/estado/{estado}
Busca conductores por estado (Activo, Inactivo, En Viaje).

**Ejemplo:** `GET /api/v1/conductores/estado/Activo`

#### POST /api/v1/conductores
Crea un nuevo conductor.

**Request:**
```json
{
  "codigo": "C004",
  "nombre": "Miguel",
  "apellido": "Torres",
  "dni": "45678901",
  "telefono": "987444555",
  "licencia": "A-III-b",
  "vehiculoAsignado": null,
  "estado": "Activo",
  "fechaIngreso": "2024-10-10",
  "activo": true
}
```

#### PUT /api/v1/conductores/{id}
Actualiza un conductor existente.

#### DELETE /api/v1/conductores/{id}
Elimina un conductor (soft delete).

---

### 🚚 Vehículos

#### GET /api/v1/vehiculos
Lista todos los vehículos activos.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": [
    {
      "id": 1,
      "codigo": "V0001",
      "placa": "ABC-123",
      "marca": "HINO",
      "modelo": "GH-300",
      "tipo": "Camión",
      "anioFabricacion": 2022,
      "numeroChasis": "HINO2022GH300001",
      "capacidadCarga": 15000.00,
      "combustible": "Diesel",
      "estadoActual": "En operación",
      "imagenUrl": null,
      "activo": true,
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-01T10:00:00",
      "deletedAt": null
    }
  ]
}
```

#### GET /api/v1/vehiculos/{id}
Obtiene un vehículo por ID.

#### GET /api/v1/vehiculos/estado/{estado}
Busca vehículos por estado (En operación, En mantenimiento, Disponible, Inactivo).

**Ejemplo:** `GET /api/v1/vehiculos/estado/Disponible`

#### POST /api/v1/vehiculos
Crea un nuevo vehículo.

**Request:**
```json
{
  "codigo": "V0010",
  "placa": "XYZ-999",
  "marca": "HINO",
  "modelo": "GH-500",
  "tipo": "Semitrailer",
  "anioFabricacion": 2024,
  "numeroChasis": "HINO2024GH500010",
  "capacidadCarga": 25000.00,
  "combustible": "Diesel",
  "estadoActual": "Disponible",
  "imagenUrl": "https://example.com/imagen.jpg",
  "activo": true
}
```

#### PUT /api/v1/vehiculos/{id}
Actualiza un vehículo existente.

#### DELETE /api/v1/vehiculos/{id}
Elimina un vehículo (soft delete).

---

### 📍 Movimientos

#### GET /api/v1/movimientos
Lista todos los movimientos activos.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": [
    {
      "id": 1,
      "codigo": "MOV-001",
      "vehiculoId": 1,
      "conductorId": 1,
      "origen": "Lima",
      "destino": "Arequipa",
      "fechaHoraSalida": "2024-10-10T08:00:00",
      "fechaHoraLlegadaEstimada": "2024-10-10T20:00:00",
      "fechaHoraLlegadaReal": null,
      "tipoMovimiento": "Transporte de carga",
      "cargaPasajeros": "Carga general 10 toneladas",
      "estado": "En curso",
      "observaciones": null,
      "createdAt": "2024-10-10T07:00:00",
      "updatedAt": "2024-10-10T07:00:00",
      "deletedAt": null
    }
  ]
}
```

#### GET /api/v1/movimientos/{id}
Obtiene un movimiento por ID.

#### GET /api/v1/movimientos/estado/{estado}
Busca movimientos por estado (Programado, En curso, Completado, Cancelado, Inactivo).

**Ejemplo:** `GET /api/v1/movimientos/estado/En%20curso`

#### GET /api/v1/movimientos/vehiculo/{vehiculoId}
Busca todos los movimientos de un vehículo específico.

**Ejemplo:** `GET /api/v1/movimientos/vehiculo/1`

#### GET /api/v1/movimientos/conductor/{conductorId}
Busca todos los movimientos de un conductor específico.

**Ejemplo:** `GET /api/v1/movimientos/conductor/1`

#### POST /api/v1/movimientos
Crea un nuevo movimiento.

**Request:**
```json
{
  "codigo": "MOV-010",
  "vehiculoId": 2,
  "conductorId": 3,
  "origen": "Lima",
  "destino": "Cusco",
  "fechaHoraSalida": "2024-10-15T06:00:00",
  "fechaHoraLlegadaEstimada": "2024-10-15T22:00:00",
  "fechaHoraLlegadaReal": null,
  "tipoMovimiento": "Transporte de carga",
  "cargaPasajeros": "Carga refrigerada 18 toneladas",
  "estado": "Programado",
  "observaciones": "Requiere cadena de frío"
}
```

#### PUT /api/v1/movimientos/{id}
Actualiza un movimiento existente.

**Request (actualizar estado a completado):**
```json
{
  "codigo": "MOV-001",
  "vehiculoId": 1,
  "conductorId": 1,
  "origen": "Lima",
  "destino": "Arequipa",
  "fechaHoraSalida": "2024-10-10T08:00:00",
  "fechaHoraLlegadaEstimada": "2024-10-10T20:00:00",
  "fechaHoraLlegadaReal": "2024-10-10T19:45:00",
  "tipoMovimiento": "Transporte de carga",
  "cargaPasajeros": "Carga general 10 toneladas",
  "estado": "Completado",
  "observaciones": "Entrega exitosa"
}
```

#### DELETE /api/v1/movimientos/{id}
Elimina un movimiento (soft delete).

---

## 🔍 Características Especiales

### Soft Delete
Todos los registros se eliminan lógicamente usando el campo `deletedAt`:
- Los registros eliminados no aparecen en consultas normales
- Se pueden recuperar si es necesario
- Mantiene integridad referencial

### Programación Reactiva
- Uso de `Mono<T>` para operaciones que retornan 0 o 1 elemento
- Uso de `Flux<T>` para operaciones que retornan 0 a N elementos
- No bloqueante, mejor rendimiento bajo alta concurrencia

### Auditoría Automática
- `createdAt`: Se establece automáticamente al crear
- `updatedAt`: Se actualiza automáticamente en cada modificación
- Triggers de base de datos registran cambios en `logs_auditoria`

---

## 🐛 Troubleshooting

### Error: "Connection refused" o "Unable to connect to database"

**Solución:**
1. Verifica que Neon PostgreSQL esté activo
2. Revisa las credenciales en `application.yml`
3. Asegúrate de tener conexión a internet
4. Verifica que el firewall permita conexiones SSL

### Error: "JWT token expired"

**Solución:**
1. Realiza login nuevamente para obtener un nuevo token
2. Los tokens expiran después de 24 horas

### Error: "Access Denied" o "403 Forbidden"

**Solución:**
1. Verifica que estés enviando el token en el header: `Authorization: Bearer {token}`
2. Asegúrate de que el token sea válido
3. Verifica que el usuario tenga los permisos necesarios

### Error de compilación Maven

**Solución:**
```bash
# Limpiar y recompilar
mvnw clean install -U

# Si persiste, eliminar carpeta .m2 y volver a compilar
```

### Puerto 8080 ya en uso

**Solución:**
```bash
# Cambiar puerto en application.yml
server:
  port: 8081
```

---

## 📊 Características de la Base de Datos

### Índices Optimizados
- `idx_usuarios_email` - Búsquedas por email
- `idx_conductores_dni` - Búsquedas por DNI
- `idx_vehiculos_placa` - Búsquedas por placa
- `idx_movimientos_estado` - Filtros por estado
- `idx_movimientos_fecha_salida` - Ordenamiento por fecha

### Vistas Predefinidas
- `vista_conductores_completa` - Conductores con estadísticas de viajes
- `vista_vehiculos_uso` - Vehículos con estadísticas de uso
- `vista_movimientos_completa` - Movimientos con datos completos

### Triggers Automáticos
- `update_updated_at` - Actualiza timestamp en modificaciones
- `log_auditoria` - Registra cambios en tablas principales

---

## 📈 Mejores Prácticas

### Para el Frontend

1. **Almacenar el token JWT de forma segura**
   ```javascript
   // Usar localStorage o sessionStorage
   localStorage.setItem('token', response.data.token);
   ```

2. **Incluir token en todas las peticiones protegidas**
   ```javascript
   const token = localStorage.getItem('token');
   axios.get('/api/v1/vehiculos', {
     headers: { 'Authorization': `Bearer ${token}` }
   });
   ```

3. **Manejar errores de autenticación**
   ```javascript
   if (error.response.status === 401) {
     // Token expirado, redirigir a login
     window.location.href = '/login';
   }
   ```

4. **Validar datos antes de enviar**
   - Campos requeridos no vacíos
   - Formatos correctos (email, fechas, números)
   - Longitudes máximas respetadas

### Para el Backend

1. **Usar transacciones para operaciones múltiples**
2. **Validar datos de entrada en servicios**
3. **Manejar excepciones apropiadamente**
4. **Documentar cambios en la API**

---

## 📝 Notas Importantes

- ✅ Todos los endpoints **GET** son públicos (no requieren autenticación)
- 🔒 Los endpoints **POST, PUT, DELETE** requieren token JWT
- 🔓 El endpoint `/api/v1/auth/login` es público
- 📚 Swagger UI está disponible sin autenticación
- 🔄 CORS está configurado para aceptar peticiones desde cualquier origen
- ⏰ Los tokens JWT expiran después de 24 horas
- 🗑️ Los DELETE son soft delete (no eliminan físicamente)
- 🔐 Las contraseñas se encriptan automáticamente con BCrypt

---

## 🚀 Próximas Mejoras

- [ ] Implementar refresh tokens
- [ ] Agregar paginación en listados
- [ ] Implementar filtros avanzados
- [ ] Agregar endpoints de reportes
- [ ] Implementar WebSocket para tracking en tiempo real
- [ ] Agregar caché con Redis
- [ ] Implementar rate limiting
- [ ] Agregar métricas con Actuator

---

## 👥 Soporte

Para soporte técnico o consultas:
- **Email**: soporte@vallegrande.edu.pe
- **Documentación**: http://localhost:8080/swagger-ui.html

---

## 📄 Licencia

Apache 2.0 - Valle Grande © 2024

---

**Desarrollado con ❤️ por Valle Grande para HINO Connect**
