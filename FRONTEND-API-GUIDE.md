# 🎨 HINO CONNECT - Guía Completa de API para Frontend

Documentación completa para consumir TODOS los endpoints desde el frontend.

## 📋 Tabla de Contenidos

1. [Configuración Inicial](#-configuración-inicial)
2. [Autenticación](#-autenticación)
3. [Roles](#-roles)
4. [Usuarios](#-usuarios)
5. [Conductores](#-conductores)
6. [Vehículos](#-vehículos)
7. [Movimientos](#-movimientos)
8. [Reportes](#-reportes)
9. [Configuraciones](#-configuraciones)
10. [Logs de Auditoría](#-logs-de-auditoría)
11. [Funcionalidad Restaurar](#-funcionalidad-restaurar)
12. [Paginación](#-paginación)
13. [Ejemplos de Código](#-ejemplos-de-código)

---

## ⚙️ Configuración Inicial

### Base URL

```javascript
const API_BASE_URL = "http://localhost:8081/api/v1";
```

### Configuración de Axios (Recomendado)

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 🔐 Autenticación

### Login

**Endpoint:** `POST /auth/login`

**Campos Requeridos:**
| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|------------|
| email | string | ✅ | Formato email válido |
| password | string | ✅ | Mínimo 6 caracteres |

**Ejemplo de Request:**

```javascript
const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, nombre, rol } = response.data.data;

    // Guardar token
    localStorage.setItem("token", token);
    localStorage.setItem("userName", nombre);
    localStorage.setItem("userRole", rol);

    return response.data;
  } catch (error) {
    console.error("Error en login:", error.response?.data?.message);
    throw error;
  }
};
```

**Response Exitoso:**

```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "email": "admin@hinoconnect.com",
    "nombre": "Admin Sistema",
    "rol": "Administrador"
  }
}
```

---

## 👥 Roles

### Modelo de Datos

```typescript
interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
```

### Endpoints Disponibles

#### Listar Roles

**GET** `/roles`

#### Obtener Rol por ID

**GET** `/roles/{id}`

#### Crear Rol

**POST** `/roles`

**Campos:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| nombre | string | ✅ | Nombre único del rol |
| descripcion | string | ❌ | Descripción del rol |

**Ejemplo:**

```javascript
const crearRol = async (rolData) => {
  const response = await api.post("/roles", {
    nombre: "SUPERVISOR",
    descripcion: "Supervisor de operaciones",
  });
  return response.data;
};
```

#### Actualizar Rol

**PUT** `/roles/{id}`

#### Eliminar Rol (Soft Delete)

**DELETE** `/roles/{id}`

#### Restaurar Rol

**PUT** `/roles/{id}/restore`

---

## 👤 Usuarios

### Modelo de Datos

```typescript
interface Usuario {
  id: number;
  email: string;
  passwordHash: string; // No mostrar en frontend
  nombre: string;
  apellido: string;
  telefono: string;
  rolId: number;
  activo: boolean;
  ultimoLogin: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
```

### Endpoints Disponibles

#### Listar Usuarios

**GET** `/usuarios`

#### Obtener Usuario por ID

**GET** `/usuarios/{id}`

#### Crear Usuario

**POST** `/usuarios`

**Campos:**
| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|------------|
| email | string | ✅ | Email único, formato válido |
| passwordHash | string | ✅ | Mínimo 8 caracteres (se encripta automáticamente) |
| nombre | string | ✅ | Máximo 100 caracteres |
| apellido | string | ✅ | Máximo 100 caracteres |
| telefono | string | ❌ | Máximo 20 caracteres |
| rolId | number | ✅ | ID de rol existente |
| activo | boolean | ❌ | Default: true |

**Ejemplo:**

```javascript
const crearUsuario = async (userData) => {
  const response = await api.post("/usuarios", {
    email: "nuevo@hinoconnect.com",
    passwordHash: "password123", // Se encriptará automáticamente
    nombre: "Juan",
    apellido: "Pérez",
    telefono: "987654321",
    rolId: 2,
    activo: true,
  });
  return response.data;
};
```

#### Actualizar Usuario

**PUT** `/usuarios/{id}`

#### Eliminar Usuario (Soft Delete)

**DELETE** `/usuarios/{id}`

#### Restaurar Usuario

**PUT** `/usuarios/{id}/restore`

---

## 🚗 Conductores

### Modelo de Datos

```typescript
interface Conductor {
  id: number;
  codigo: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  licencia: string;
  vehiculoAsignado: string | null;
  estado: "activo" | "inactivo";
  fechaIngreso: string; // Formato: YYYY-MM-DD
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
```

### Endpoints Disponibles

#### Listar Conductores

**GET** `/conductores`

#### Obtener Conductor por ID

**GET** `/conductores/{id}`

#### Buscar por Estado

**GET** `/conductores/estado/{estado}`

**Valores válidos:** `activo`, `inactivo`

**Ejemplo:**

```javascript
const getConductoresActivos = async () => {
  const response = await api.get("/conductores/estado/activo");
  return response.data.data;
};
```

#### Crear Conductor

**POST** `/conductores`

**Campos:**
| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|------------|
| codigo | string | ✅ | Único, ej: "C001" |
| nombre | string | ✅ | Máximo 100 caracteres |
| apellido | string | ✅ | Máximo 100 caracteres |
| dni | string | ✅ | Único, máximo 20 caracteres |
| telefono | string | ❌ | Máximo 20 caracteres |
| licencia | string | ✅ | Máximo 50 caracteres |
| vehiculoAsignado | string | ❌ | Código del vehículo |
| estado | string | ❌ | Default: "activo" |
| fechaIngreso | string | ❌ | Formato: YYYY-MM-DD |
| activo | boolean | ❌ | Default: true |

**Ejemplo:**

```javascript
const crearConductor = async (conductorData) => {
  const response = await api.post("/conductores", {
    codigo: "C010",
    nombre: "Miguel",
    apellido: "Torres",
    dni: "45678901",
    telefono: "987444555",
    licencia: "A-III-b",
    vehiculoAsignado: null,
    estado: "activo",
    fechaIngreso: "2024-10-10",
    activo: true,
  });
  return response.data;
};
```

#### Actualizar Conductor

**PUT** `/conductores/{id}`

#### Eliminar Conductor (Soft Delete)

**DELETE** `/conductores/{id}`

#### Restaurar Conductor

**PUT** `/conductores/restaurar/{id}`

---

## 🚚 Vehículos

### Modelo de Datos

```typescript
interface Vehiculo {
  id: number;
  codigo: string;
  placa: string;
  marca: string;
  modelo: string;
  tipo: string;
  anioFabricacion: number;
  numeroChasis: string;
  capacidadCarga: number; // en kg
  combustible: string;
  estadoActual: "disponible" | "en_operacion" | "en_mantenimiento" | "inactivo";
  imagenUrl: string | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
```

### Endpoints Disponibles

#### Listar Vehículos

**GET** `/vehiculos`

#### Listar Vehículos con Paginación ⭐ NUEVO

**GET** `/vehiculos/paginated?page={page}&size={size}`

**Response:**

```typescript
interface PageResponse<T> {
  content: T[]; // Datos de la página actual
  pageNumber: number; // Número de página (0-based)
  pageSize: number; // Tamaño de página
  totalElements: number; // Total de elementos
  totalPages: number; // Total de páginas
  first: boolean; // Es la primera página
  last: boolean; // Es la última página
}
```

**Ejemplo:**

```javascript
const getVehiculosPaginados = async (page = 0, size = 10) => {
  const response = await api.get(
    `/vehiculos/paginated?page=${page}&size=${size}`
  );
  return response.data.data;
};
```

#### Obtener Vehículo por ID

**GET** `/vehiculos/{id}`

#### Buscar por Estado

**GET** `/vehiculos/estado/{estado}`

**Valores válidos:** `disponible`, `en_operacion`, `en_mantenimiento`, `inactivo`

#### Crear Vehículo

**POST** `/vehiculos`

**Campos:**
| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|------------|
| codigo | string | ✅ | Único, ej: "V0001" |
| placa | string | ✅ | Único, máximo 20 caracteres |
| marca | string | ✅ | Máximo 50 caracteres |
| modelo | string | ✅ | Máximo 50 caracteres |
| tipo | string | ❌ | Ej: "Camión", "Semitrailer" |
| anioFabricacion | number | ❌ | Año válido |
| numeroChasis | string | ❌ | Máximo 50 caracteres |
| capacidadCarga | number | ❌ | En kilogramos (decimal) |
| combustible | string | ❌ | Ej: "Diesel", "Gasolina" |
| estadoActual | string | ❌ | Default: "disponible" |
| imagenUrl | string | ❌ | URL válida |
| activo | boolean | ❌ | Default: true |

**Ejemplo:**

```javascript
const crearVehiculo = async (vehiculoData) => {
  const response = await api.post("/vehiculos", {
    codigo: "V0020",
    placa: "XYZ-999",
    marca: "HINO",
    modelo: "GH-500",
    tipo: "Semitrailer",
    anioFabricacion: 2024,
    numeroChasis: "HINO2024GH500020",
    capacidadCarga: 25000.0,
    combustible: "Diesel",
    estadoActual: "disponible",
    imagenUrl: "https://example.com/vehiculo.jpg",
    activo: true,
  });
  return response.data;
};
```

#### Actualizar Vehículo

**PUT** `/vehiculos/{id}`

#### Eliminar Vehículo (Soft Delete)

**DELETE** `/vehiculos/{id}`

#### Restaurar Vehículo ⭐ NUEVO

**PUT** `/vehiculos/{id}/restore`

#### Listar Vehículos Eliminados ⭐ NUEVO

**GET** `/vehiculos/deleted`

---

## 📍 Movimientos

### Modelo de Datos

```typescript
interface Movimiento {
  id: number;
  codigo: string;
  vehiculoId: number;
  conductorId: number;
  origen: string;
  destino: string;
  fechaHoraSalida: string; // ISO 8601: "2024-10-10T08:00:00"
  fechaHoraLlegadaEstimada: string;
  fechaHoraLlegadaReal: string | null;
  tipoMovimiento: string;
  cargaPasajeros: string;
  estado: "programado" | "en_curso" | "completado" | "cancelado";
  observaciones: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
```

### Endpoints Disponibles

#### Listar Movimientos

**GET** `/movimientos`

#### Obtener Movimiento por ID

**GET** `/movimientos/{id}`

#### Buscar por Estado

**GET** `/movimientos/estado/{estado}`

**Valores válidos:** `programado`, `en_curso`, `completado`, `cancelado`

#### Buscar por Vehículo

**GET** `/movimientos/vehiculo/{vehiculoId}`

#### Buscar por Conductor

**GET** `/movimientos/conductor/{conductorId}`

**Ejemplos:**

```javascript
// Movimientos en curso
const getMovimientosEnCurso = async () => {
  const response = await api.get("/movimientos/estado/en_curso");
  return response.data.data;
};

// Movimientos de un vehículo
const getMovimientosPorVehiculo = async (vehiculoId) => {
  const response = await api.get(`/movimientos/vehiculo/${vehiculoId}`);
  return response.data.data;
};

// Movimientos de un conductor
const getMovimientosPorConductor = async (conductorId) => {
  const response = await api.get(`/movimientos/conductor/${conductorId}`);
  return response.data.data;
};
```

#### Crear Movimiento

**POST** `/movimientos`

**Campos:**
| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|------------|
| codigo | string | ✅ | Único, ej: "MOV-001" |
| vehiculoId | number | ✅ | ID de vehículo existente |
| conductorId | number | ✅ | ID de conductor existente |
| origen | string | ✅ | Máximo 255 caracteres |
| destino | string | ✅ | Máximo 255 caracteres |
| fechaHoraSalida | string | ✅ | ISO 8601: "2024-10-10T08:00:00" |
| fechaHoraLlegadaEstimada | string | ❌ | ISO 8601 |
| fechaHoraLlegadaReal | string | ❌ | ISO 8601 |
| tipoMovimiento | string | ❌ | Ej: "Transporte de carga" |
| cargaPasajeros | string | ❌ | Descripción de la carga |
| estado | string | ❌ | Default: "programado" |
| observaciones | string | ❌ | Notas adicionales |

**Ejemplo:**

```javascript
const crearMovimiento = async (movimientoData) => {
  const response = await api.post("/movimientos", {
    codigo: "MOV-050",
    vehiculoId: 2,
    conductorId: 3,
    origen: "Lima",
    destino: "Cusco",
    fechaHoraSalida: "2024-10-15T06:00:00",
    fechaHoraLlegadaEstimada: "2024-10-15T22:00:00",
    fechaHoraLlegadaReal: null,
    tipoMovimiento: "Transporte de carga",
    cargaPasajeros: "Carga refrigerada 18 toneladas",
    estado: "programado",
    observaciones: "Requiere cadena de frío",
  });
  return response.data;
};
```

#### Actualizar Movimiento

**PUT** `/movimientos/{id}`

#### Eliminar Movimiento (Soft Delete)

**DELETE** `/movimientos/{id}`

---

## 📊 Reportes ⭐ NUEVA FUNCIONALIDAD

### Modelo de Datos

```typescript
interface Reporte {
  id: number;
  tipoReporte: string;
  generadoPor: number; // ID del usuario
  fechaGeneracion: string; // ISO 8601
  parametros: string; // JSON como string
  resultado: string; // JSON como string
  createdAt: string;
  deletedAt: string | null;
}

interface ReporteRequest {
  tipoReporte: string;
  generadoPor: number;
  parametros?: string;
  resultado?: string;
}

interface ReporteResponse {
  id: number;
  tipoReporte: string;
  generadoPor: number;
  fechaGeneracion: string;
  parametros: string;
  resultado: string;
  createdAt: string;
}
```

### Endpoints Disponibles

#### Listar Reportes

**GET** `/reportes`

#### Obtener Reporte por ID

**GET** `/reportes/{id}`

#### Crear Reporte Manual

**POST** `/reportes`

**Campos:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| tipoReporte | string | ✅ | Tipo de reporte (ej: "vehiculos", "conductores") |
| generadoPor | number | ✅ | ID del usuario que genera |
| parametros | string | ❌ | Parámetros en formato JSON |
| resultado | string | ❌ | Resultado en formato JSON |

**Ejemplo:**

```javascript
const crearReporte = async (reporteData) => {
  const response = await api.post("/reportes", {
    tipoReporte: "vehiculos",
    generadoPor: 1,
    parametros: JSON.stringify({
      estado: "disponible",
      fecha: "2024-10-01",
    }),
    resultado: JSON.stringify({
      total: 25,
      disponibles: 20,
      en_operacion: 5,
    }),
  });
  return response.data;
};
```

#### Generar Reporte de Conductores ⭐ AUTOMÁTICO

**POST** `/reportes/generar/conductores?periodo={periodo}&usuarioId={usuarioId}`

**Ejemplo:**

```javascript
const generarReporteConductores = async (periodo, usuarioId) => {
  const response = await api.post(
    `/reportes/generar/conductores?periodo=${periodo}&usuarioId=${usuarioId}`
  );
  return response.data.data;
};

// Uso
const reporte = await generarReporteConductores("2025-10", 1);
console.log(reporte.resultado); // {"activos": 3, "inactivos": 1, "total_conductores": 4}
```

#### Generar Reporte de Vehículos ⭐ AUTOMÁTICO

**POST** `/reportes/generar/vehiculos?estado={estado}&usuarioId={usuarioId}`

**Ejemplo:**

```javascript
const generarReporteVehiculos = async (estado, usuarioId) => {
  const response = await api.post(
    `/reportes/generar/vehiculos?estado=${estado}&usuarioId=${usuarioId}`
  );
  return response.data.data;
};

// Uso
const reporte = await generarReporteVehiculos("todos", 1);
console.log(reporte.resultado); // {"disponibles": 2, "en_operacion": 2, "total_vehiculos": 5, "en_mantenimiento": 1}
```

#### Generar Reporte de Movimientos ⭐ AUTOMÁTICO

**POST** `/reportes/generar/movimientos?fechaInicio={inicio}&fechaFin={fin}&usuarioId={usuarioId}`

**Ejemplo:**

```javascript
const generarReporteMovimientos = async (fechaInicio, fechaFin, usuarioId) => {
  const response = await api.post(
    `/reportes/generar/movimientos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&usuarioId=${usuarioId}`
  );
  return response.data.data;
};

// Uso
const reporte = await generarReporteMovimientos("2025-10-01", "2025-10-10", 1);
console.log(reporte.resultado); // {"en_curso": 1, "completados": 2, "programados": 1, "total_movimientos": 4}
```

#### Actualizar Reporte

**PUT** `/reportes/{id}`

#### Eliminar Reporte (Soft Delete)

**DELETE** `/reportes/{id}`

#### Restaurar Reporte ⭐ NUEVO

**PUT** `/reportes/{id}/restore`

#### Listar Reportes Eliminados ⭐ NUEVO

**GET** `/reportes/deleted`

#### Filtrar por Tipo

**GET** `/reportes/tipo/{tipoReporte}`

#### Filtrar por Usuario Generador

**GET** `/reportes/usuario/{usuarioId}`

**Ejemplos:**

```javascript
// Reportes de vehículos
const getReportesVehiculos = async () => {
  const response = await api.get("/reportes/tipo/vehiculos");
  return response.data.data;
};

// Reportes generados por un usuario
const getReportesPorUsuario = async (usuarioId) => {
  const response = await api.get(`/reportes/usuario/${usuarioId}`);
  return response.data.data;
};
```

---

## ⚙️ Configuraciones ⭐ NUEVA FUNCIONALIDAD

### Modelo de Datos

```typescript
interface Configuracion {
  id: number;
  clave: string; // Clave única
  valor: string; // Valor de la configuración
  descripcion: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
```

### Endpoints Disponibles

#### Listar Configuraciones

**GET** `/configuraciones`

#### Obtener Configuración por ID

**GET** `/configuraciones/{id}`

#### Obtener por Clave

**GET** `/configuraciones/clave/{clave}`

#### Obtener Solo el Valor ⭐ ÚTIL

**GET** `/configuraciones/valor/{clave}`

**Ejemplo:**

```javascript
const getConfigValue = async (clave) => {
  const response = await api.get(`/configuraciones/valor/${clave}`);
  return response.data.data; // Retorna solo el valor
};

// Uso
const maxVelocidad = await getConfigValue("max_velocidad_carretera");
console.log(maxVelocidad); // "90"
```

#### Crear Configuración

**POST** `/configuraciones`

**Campos:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| clave | string | ✅ | Clave única (ej: "max_velocidad") |
| valor | string | ✅ | Valor de la configuración |
| descripcion | string | ❌ | Descripción de la configuración |

**Ejemplo:**

```javascript
const crearConfiguracion = async (configData) => {
  const response = await api.post("/configuraciones", {
    clave: "max_velocidad_carretera",
    valor: "90",
    descripcion: "Velocidad máxima permitida en carretera (km/h)",
  });
  return response.data;
};
```

#### Actualizar Configuración Completa

**PUT** `/configuraciones/{id}`

#### Actualizar Solo Valor ⭐ ÚTIL

**PUT** `/configuraciones/valor/{clave}`

**Request Body:**

```json
{
  "valor": "nuevo_valor"
}
```

**Ejemplo:**

```javascript
const updateConfigValue = async (clave, nuevoValor) => {
  const response = await api.put(`/configuraciones/valor/${clave}`, {
    valor: nuevoValor,
  });
  return response.data;
};

// Cambiar velocidad máxima
await updateConfigValue("max_velocidad_carretera", "100");
```

#### Eliminar Configuración (Soft Delete)

**DELETE** `/configuraciones/{id}`

#### Restaurar Configuración ⭐ NUEVO

**PUT** `/configuraciones/{id}/restore`

#### Listar Configuraciones Eliminadas ⭐ NUEVO

**GET** `/configuraciones/deleted`

#### Buscar por Patrón

**GET** `/configuraciones/buscar/{pattern}`

**Ejemplo:**

```javascript
// Buscar todas las configuraciones que contengan "velocidad"
const searchConfigs = async (pattern) => {
  const response = await api.get(`/configuraciones/buscar/${pattern}`);
  return response.data.data;
};

const configsVelocidad = await searchConfigs("velocidad");
```

---

## 📝 Logs de Auditoría ⭐ NUEVA FUNCIONALIDAD

### Modelo de Datos

```typescript
interface LogAuditoria {
  id: string; // UUID
  tabla: string; // Nombre de la tabla
  operacion: string; // INSERT, UPDATE, DELETE
  registroId: number; // ID del registro afectado
  usuarioId: number; // ID del usuario que hizo el cambio
  descripcion: string; // Descripción del cambio
  fecha: string; // ISO 8601
}
```

### Endpoints Disponibles

#### Listar Todos los Logs

**GET** `/logs-auditoria`

#### Obtener Log por ID

**GET** `/logs-auditoria/{id}`

#### Filtrar por Tabla

**GET** `/logs-auditoria/tabla/{tabla}`

**Ejemplo:**

```javascript
const getLogsByTabla = async (tabla) => {
  const response = await api.get(`/logs-auditoria/tabla/${tabla}`);
  return response.data.data;
};

// Obtener logs de vehículos
const logsVehiculos = await getLogsByTabla("vehiculos");
```

#### Filtrar por Operación

**GET** `/logs-auditoria/operacion/{operacion}`

**Valores:** `INSERT`, `UPDATE`, `DELETE`

#### Filtrar por Usuario

**GET** `/logs-auditoria/usuario/{usuarioId}`

#### Filtrar por Registro Específico

**GET** `/logs-auditoria/registro/{registroId}/tabla/{tabla}`

**Ejemplo:**

```javascript
// Ver historial de cambios de un vehículo específico
const getHistorialVehiculo = async (vehiculoId) => {
  const response = await api.get(
    `/logs-auditoria/registro/${vehiculoId}/tabla/vehiculos`
  );
  return response.data.data;
};
```

#### Filtrar por Rango de Fechas

**GET** `/logs-auditoria/fecha?fechaInicio={inicio}&fechaFin={fin}`

**Ejemplo:**

```javascript
const getLogsByFecha = async (fechaInicio, fechaFin) => {
  const params = new URLSearchParams({
    fechaInicio: fechaInicio, // "2024-10-01T00:00:00"
    fechaFin: fechaFin, // "2024-10-31T23:59:59"
  });

  const response = await api.get(`/logs-auditoria/fecha?${params}`);
  return response.data.data;
};
```

#### Obtener Logs Recientes

**GET** `/logs-auditoria/recientes?limit={limit}`

**Ejemplo:**

```javascript
const getLogsRecientes = async (limit = 50) => {
  const response = await api.get(`/logs-auditoria/recientes?limit=${limit}`);
  return response.data.data;
};
```

#### Estadísticas por Tabla

**GET** `/logs-auditoria/estadisticas/tabla/{tabla}`

#### Estadísticas por Operación

**GET** `/logs-auditoria/estadisticas/operacion/{operacion}`

**Ejemplo:**

```javascript
// Contar cuántos cambios hubo en vehículos
const getStatsVehiculos = async () => {
  const response = await api.get(
    "/logs-auditoria/estadisticas/tabla/vehiculos"
  );
  return response.data.data; // Retorna número
};
```

---

## 🔄 Funcionalidad Restaurar ⭐ NUEVA

Todas las tablas principales ahora tienen función **RESTAURAR**:

### Patrón General

```javascript
// Listar registros eliminados
const get{Tabla}Eliminados = async () => {
  const response = await api.get('/{tabla}/deleted');
  return response.data.data;
};

// Restaurar registro
const restaurar{Tabla} = async (id) => {
  const response = await api.put(`/{tabla}/${id}/restore`);
  return response.data.data;
};
```

### Ejemplos por Tabla

#### Vehículos

```javascript
// Listar vehículos eliminados
const getVehiculosEliminados = async () => {
  const response = await api.get("/vehiculos/deleted");
  return response.data.data;
};

// Restaurar vehículo
const restaurarVehiculo = async (id) => {
  const response = await api.put(`/vehiculos/${id}/restore`);
  return response.data.data;
};
```

#### Conductores

```javascript
const getConductoresEliminados = async () => {
  const response = await api.get("/conductores/deleted");
  return response.data.data;
};

const restaurarConductor = async (id) => {
  const response = await api.put(`/conductores/restaurar/${id}`);
  return response.data.data;
};
```

#### Usuarios

```javascript
const getUsuariosEliminados = async () => {
  const response = await api.get("/usuarios/deleted");
  return response.data.data;
};

const restaurarUsuario = async (id) => {
  const response = await api.put(`/usuarios/${id}/restore`);
  return response.data.data;
};
```

#### Roles

```javascript
const getRolesEliminados = async () => {
  const response = await api.get("/roles/deleted");
  return response.data.data;
};

const restaurarRol = async (id) => {
  const response = await api.put(`/roles/${id}/restore`);
  return response.data.data;
};
```

#### Reportes

```javascript
const getReportesEliminados = async () => {
  const response = await api.get("/reportes/deleted");
  return response.data.data;
};

const restaurarReporte = async (id) => {
  const response = await api.put(`/reportes/${id}/restore`);
  return response.data.data;
};
```

#### Configuraciones

```javascript
const getConfiguracionesEliminadas = async () => {
  const response = await api.get("/configuraciones/deleted");
  return response.data.data;
};

const restaurarConfiguracion = async (id) => {
  const response = await api.put(`/configuraciones/${id}/restore`);
  return response.data.data;
};
```

---

## 📊 Paginación

### Vehículos con Paginación

**GET** `/vehiculos/paginated?page={page}&size={size}`

**Response:**

```typescript
interface PageResponse<T> {
  content: T[]; // Datos de la página actual
  pageNumber: number; // Número de página (0-based)
  pageSize: number; // Tamaño de página
  totalElements: number; // Total de elementos
  totalPages: number; // Total de páginas
  first: boolean; // Es la primera página
  last: boolean; // Es la última página
}
```

**Ejemplo Completo:**

```javascript
const getVehiculosPaginados = async (page = 0, size = 10) => {
  const response = await api.get(
    `/vehiculos/paginated?page=${page}&size=${size}`
  );
  return response.data.data;
};

// Uso en React
const [vehiculos, setVehiculos] = useState([]);
const [currentPage, setCurrentPage] = useState(0);
const [totalPages, setTotalPages] = useState(0);
const [loading, setLoading] = useState(false);

const loadVehiculos = async (page) => {
  setLoading(true);
  try {
    const pageData = await getVehiculosPaginados(page, 10);
    setVehiculos(pageData.content);
    setCurrentPage(pageData.pageNumber);
    setTotalPages(pageData.totalPages);
  } catch (error) {
    console.error("Error al cargar vehículos:", error);
  } finally {
    setLoading(false);
  }
};

// Componente de paginación
const Pagination = () => (
  <div className="pagination">
    <button
      disabled={currentPage === 0}
      onClick={() => loadVehiculos(currentPage - 1)}
    >
      Anterior
    </button>

    <span>
      Página {currentPage + 1} de {totalPages}
    </span>

    <button
      disabled={currentPage >= totalPages - 1}
      onClick={() => loadVehiculos(currentPage + 1)}
    >
      Siguiente
    </button>
  </div>
);
```

---

## 💻 Ejemplos de Código Completos

### Servicio de Autenticación (React)

```javascript
// services/authService.js
import api from "./api";

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, nombre, rol } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userName", nombre);
      localStorage.setItem("userRole", rol);

      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error en login";
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  getToken: () => {
    return localStorage.getItem("token");
  },
};
```

### Servicio Completo de Vehículos (React)

```javascript
// services/vehiculoService.js
import api from "./api";

export const vehiculoService = {
  // CRUD básico
  getAll: async () => {
    const response = await api.get("/vehiculos");
    return response.data.data;
  },

  getAllPaginated: async (page = 0, size = 10) => {
    const response = await api.get(
      `/vehiculos/paginated?page=${page}&size=${size}`
    );
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`/vehiculos/${id}`);
    return response.data.data;
  },

  create: async (vehiculoData) => {
    const response = await api.post("/vehiculos", vehiculoData);
    return response.data.data;
  },

  update: async (id, vehiculoData) => {
    const response = await api.put(`/vehiculos/${id}`, vehiculoData);
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/vehiculos/${id}`);
    return response.data;
  },

  // Funciones especiales
  getByEstado: async (estado) => {
    const response = await api.get(`/vehiculos/estado/${estado}`);
    return response.data.data;
  },

  // Nuevas funciones de restaurar
  restore: async (id) => {
    const response = await api.put(`/vehiculos/${id}/restore`);
    return response.data.data;
  },

  getDeleted: async () => {
    const response = await api.get("/vehiculos/deleted");
    return response.data.data;
  },
};
```

### Servicio de Reportes (React)

```javascript
// services/reporteService.js
import api from "./api";

export const reporteService = {
  // CRUD básico
  getAll: async () => {
    const response = await api.get("/reportes");
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`/reportes/${id}`);
    return response.data.data;
  },

  create: async (reporteData) => {
    const response = await api.post("/reportes", reporteData);
    return response.data.data;
  },

  update: async (id, reporteData) => {
    const response = await api.put(`/reportes/${id}`, reporteData);
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/reportes/${id}`);
    return response.data;
  },

  // Generación automática de reportes
  generarConductores: async (periodo, usuarioId) => {
    const response = await api.post(
      `/reportes/generar/conductores?periodo=${periodo}&usuarioId=${usuarioId}`
    );
    return response.data.data;
  },

  generarVehiculos: async (estado, usuarioId) => {
    const response = await api.post(
      `/reportes/generar/vehiculos?estado=${estado}&usuarioId=${usuarioId}`
    );
    return response.data.data;
  },

  generarMovimientos: async (fechaInicio, fechaFin, usuarioId) => {
    const response = await api.post(
      `/reportes/generar/movimientos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&usuarioId=${usuarioId}`
    );
    return response.data.data;
  },

  // Filtros
  getByTipo: async (tipoReporte) => {
    const response = await api.get(`/reportes/tipo/${tipoReporte}`);
    return response.data.data;
  },

  getByUsuario: async (usuarioId) => {
    const response = await api.get(`/reportes/usuario/${usuarioId}`);
    return response.data.data;
  },

  // Restaurar
  restore: async (id) => {
    const response = await api.put(`/reportes/${id}/restore`);
    return response.data.data;
  },

  getDeleted: async () => {
    const response = await api.get("/reportes/deleted");
    return response.data.data;
  },
};
```

### Servicio de Configuraciones (React)

```javascript
// services/configuracionService.js
import api from "./api";

export const configuracionService = {
  getAll: async () => {
    const response = await api.get("/configuraciones");
    return response.data.data;
  },

  getByClave: async (clave) => {
    const response = await api.get(`/configuraciones/clave/${clave}`);
    return response.data.data;
  },

  getValue: async (clave) => {
    const response = await api.get(`/configuraciones/valor/${clave}`);
    return response.data.data; // Solo el valor
  },

  create: async (configData) => {
    const response = await api.post("/configuraciones", configData);
    return response.data.data;
  },

  updateValue: async (clave, nuevoValor) => {
    const response = await api.put(`/configuraciones/valor/${clave}`, {
      valor: nuevoValor,
    });
    return response.data.data;
  },

  search: async (pattern) => {
    const response = await api.get(`/configuraciones/buscar/${pattern}`);
    return response.data.data;
  },

  restore: async (id) => {
    const response = await api.put(`/configuraciones/${id}/restore`);
    return response.data.data;
  },

  getDeleted: async () => {
    const response = await api.get("/configuraciones/deleted");
    return response.data.data;
  },
};
```

### Hook Personalizado para Reportes (React)

```javascript
// hooks/useReportes.js
import { useState, useEffect } from "react";
import { reporteService } from "../services/reporteService";

export const useReportes = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadReportes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reporteService.getAll();
      setReportes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generarReporteConductores = async (periodo, usuarioId) => {
    setLoading(true);
    try {
      const reporte = await reporteService.generarConductores(
        periodo,
        usuarioId
      );
      setReportes((prev) => [reporte, ...prev]);
      return reporte;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generarReporteVehiculos = async (estado, usuarioId) => {
    setLoading(true);
    try {
      const reporte = await reporteService.generarVehiculos(estado, usuarioId);
      setReportes((prev) => [reporte, ...prev]);
      return reporte;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generarReporteMovimientos = async (
    fechaInicio,
    fechaFin,
    usuarioId
  ) => {
    setLoading(true);
    try {
      const reporte = await reporteService.generarMovimientos(
        fechaInicio,
        fechaFin,
        usuarioId
      );
      setReportes((prev) => [reporte, ...prev]);
      return reporte;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportes();
  }, []);

  return {
    reportes,
    loading,
    error,
    loadReportes,
    generarReporteConductores,
    generarReporteVehiculos,
    generarReporteMovimientos,
  };
};
```

---

## 🎯 Resumen de Endpoints por Módulo

### 🔐 Autenticación

- `POST /auth/login` - Login de usuario

### 👥 Roles

- `GET /roles` - Listar roles
- `GET /roles/{id}` - Obtener rol por ID
- `POST /roles` - Crear rol
- `PUT /roles/{id}` - Actualizar rol
- `DELETE /roles/{id}` - Eliminar rol
- `PUT /roles/{id}/restore` - Restaurar rol

### 👤 Usuarios

- `GET /usuarios` - Listar usuarios
- `GET /usuarios/{id}` - Obtener usuario por ID
- `POST /usuarios` - Crear usuario
- `PUT /usuarios/{id}` - Actualizar usuario
- `DELETE /usuarios/{id}` - Eliminar usuario
- `PUT /usuarios/{id}/restore` - Restaurar usuario

### 🚗 Conductores

- `GET /conductores` - Listar conductores
- `GET /conductores/{id}` - Obtener conductor por ID
- `GET /conductores/estado/{estado}` - Buscar por estado
- `POST /conductores` - Crear conductor
- `PUT /conductores/{id}` - Actualizar conductor
- `DELETE /conductores/{id}` - Eliminar conductor
- `PUT /conductores/restaurar/{id}` - Restaurar conductor

### 🚚 Vehículos

- `GET /vehiculos` - Listar vehículos
- `GET /vehiculos/paginated` - Listar con paginación
- `GET /vehiculos/{id}` - Obtener vehículo por ID
- `GET /vehiculos/estado/{estado}` - Buscar por estado
- `GET /vehiculos/deleted` - Listar eliminados
- `POST /vehiculos` - Crear vehículo
- `PUT /vehiculos/{id}` - Actualizar vehículo
- `DELETE /vehiculos/{id}` - Eliminar vehículo
- `PUT /vehiculos/{id}/restore` - Restaurar vehículo

### 📍 Movimientos

- `GET /movimientos` - Listar movimientos
- `GET /movimientos/{id}` - Obtener movimiento por ID
- `GET /movimientos/estado/{estado}` - Buscar por estado
- `GET /movimientos/vehiculo/{vehiculoId}` - Buscar por vehículo
- `GET /movimientos/conductor/{conductorId}` - Buscar por conductor
- `POST /movimientos` - Crear movimiento
- `PUT /movimientos/{id}` - Actualizar movimiento
- `DELETE /movimientos/{id}` - Eliminar movimiento

### 📊 Reportes ⭐ NUEVO

- `GET /reportes` - Listar reportes
- `GET /reportes/{id}` - Obtener reporte por ID
- `GET /reportes/tipo/{tipo}` - Filtrar por tipo
- `GET /reportes/usuario/{usuarioId}` - Filtrar por usuario
- `GET /reportes/deleted` - Listar eliminados
- `POST /reportes` - Crear reporte manual
- `POST /reportes/generar/conductores` - Generar reporte de conductores
- `POST /reportes/generar/vehiculos` - Generar reporte de vehículos
- `POST /reportes/generar/movimientos` - Generar reporte de movimientos
- `PUT /reportes/{id}` - Actualizar reporte
- `DELETE /reportes/{id}` - Eliminar reporte
- `PUT /reportes/{id}/restore` - Restaurar reporte

### ⚙️ Configuraciones ⭐ NUEVO

- `GET /configuraciones` - Listar configuraciones
- `GET /configuraciones/{id}` - Obtener por ID
- `GET /configuraciones/clave/{clave}` - Obtener por clave
- `GET /configuraciones/valor/{clave}` - Obtener solo valor
- `GET /configuraciones/buscar/{pattern}` - Buscar por patrón
- `GET /configuraciones/deleted` - Listar eliminadas
- `POST /configuraciones` - Crear configuración
- `PUT /configuraciones/{id}` - Actualizar configuración
- `PUT /configuraciones/valor/{clave}` - Actualizar solo valor
- `DELETE /configuraciones/{id}` - Eliminar configuración
- `PUT /configuraciones/{id}/restore` - Restaurar configuración

### 📝 Logs de Auditoría ⭐ NUEVO

- `GET /logs-auditoria` - Listar todos los logs
- `GET /logs-auditoria/{id}` - Obtener log por ID
- `GET /logs-auditoria/tabla/{tabla}` - Filtrar por tabla
- `GET /logs-auditoria/operacion/{operacion}` - Filtrar por operación
- `GET /logs-auditoria/usuario/{usuarioId}` - Filtrar por usuario
- `GET /logs-auditoria/registro/{registroId}/tabla/{tabla}` - Historial de registro
- `GET /logs-auditoria/fecha` - Filtrar por rango de fechas
- `GET /logs-auditoria/recientes` - Obtener logs recientes
- `GET /logs-auditoria/estadisticas/tabla/{tabla}` - Estadísticas por tabla
- `GET /logs-auditoria/estadisticas/operacion/{operacion}` - Estadísticas por operación

---

## 🚀 ¡Tu API está completa y lista para usar!

Esta guía incluye **TODOS** los endpoints disponibles en tu backend. Ahora puedes:

1. **Consumir todos los módulos** desde tu frontend
2. **Generar reportes automáticamente** con datos reales
3. **Gestionar configuraciones** del sistema
4. **Auditar cambios** con logs detallados
5. **Restaurar registros eliminados** fácilmente
6. **Paginar resultados** para mejor rendimiento

¡Feliz desarrollo! 🎉
