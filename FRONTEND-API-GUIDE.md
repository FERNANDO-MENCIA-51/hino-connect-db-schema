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
const API_BASE_URL = 'http://localhost:8081/api/v1';
```

### Configuración de Axios (Recomendado)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
      localStorage.removeItem('token');
      window.location.href = '/login';
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
    const response = await api.post('/auth/login', {
      email,
      password
    });
    
    const { token, nombre, rol } = response.data.data;
    
    // Guardar token
    localStorage.setItem('token', token);
    localStorage.setItem('userName', nombre);
    localStorage.setItem('userRole', rol);
    
    return response.data;
  } catch (error) {
    console.error('Error en login:', error.response?.data?.message);
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
  const response = await api.post('/roles', {
    nombre: 'SUPERVISOR',
    descripcion: 'Supervisor de operaciones'
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

#### Listar Roles Eliminados
**GET** `/roles/deleted`

---

## 👤 Usuarios

### Modelo de Datos
```typescript
interface Usuario {
  id: number;
  email: string;
  passwordHash: string;  // No mostrar en frontend
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
  const response = await api.post('/usuarios', {
    email: 'nuevo@hinoconnect.com',
    passwordHash: 'password123',  // Se encriptará automáticamente
    nombre: 'Juan',
    apellido: 'Pérez',
    telefono: '987654321',
    rolId: 2,
    activo: true
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

#### Listar Usuarios Eliminados
**GET** `/usuarios/deleted`

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
  estado: 'Activo' | 'Inactivo' | 'En Viaje';
  fechaIngreso: string;  // Formato: YYYY-MM-DD
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

**Valores válidos:** `Activo`, `Inactivo`, `En Viaje`

**Ejemplo:**
```javascript
const getConductoresActivos = async () => {
  const response = await api.get('/conductores/estado/Activo');
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
| estado | string | ❌ | Default: "Activo" |
| fechaIngreso | string | ❌ | Formato: YYYY-MM-DD |
| activo | boolean | ❌ | Default: true |

**Ejemplo:**
```javascript
const crearConductor = async (conductorData) => {
  const response = await api.post('/conductores', {
    codigo: 'C010',
    nombre: 'Miguel',
    apellido: 'Torres',
    dni: '45678901',
    telefono: '987444555',
    licencia: 'A-III-b',
    vehiculoAsignado: null,
    estado: 'Activo',
    fechaIngreso: '2024-10-10',
    activo: true
  });
  return response.data;
};
```

#### Actualizar Conductor
**PUT** `/conductores/{id}`

#### Eliminar Conductor (Soft Delete)
**DELETE** `/conductores/{id}`

#### Restaurar Conductor
**PUT** `/conductores/{id}/restore`

#### Listar Conductores Eliminados
**GET** `/conductores/deleted`

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
  capacidadCarga: number;  // en kg
  combustible: string;
  estadoActual: 'En operación' | 'En mantenimiento' | 'Disponible' | 'Inactivo';
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
  content: T[];               // Datos de la página actual
  pageNumber: number;         // Número de página (0-based)
  pageSize: number;           // Tamaño de página
  totalElements: number;      // Total de elementos
  totalPages: number;         // Total de páginas
  first: boolean;             // Es la primera página
  last: boolean;              // Es la última página
}
```

**Ejemplo:**
```javascript
const getVehiculosPaginados = async (page = 0, size = 10) => {
  const response = await api.get(`/vehiculos/paginated?page=${page}&size=${size}`);
  return response.data.data;
};
```

#### Obtener Vehículo por ID
**GET** `/vehiculos/{id}`

#### Buscar por Estado
**GET** `/vehiculos/estado/{estado}`

**Valores válidos:** `En operación`, `En mantenimiento`, `Disponible`, `Inactivo`

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
| estadoActual | string | ❌ | Default: "En operación" |
| imagenUrl | string | ❌ | URL válida |
| activo | boolean | ❌ | Default: true |

**Ejemplo:**
```javascript
const crearVehiculo = async (vehiculoData) => {
  const response = await api.post('/vehiculos', {
    codigo: 'V0020',
    placa: 'XYZ-999',
    marca: 'HINO',
    modelo: 'GH-500',
    tipo: 'Semitrailer',
    anioFabricacion: 2024,
    numeroChasis: 'HINO2024GH500020',
    capacidadCarga: 25000.00,
    combustible: 'Diesel',
    estadoActual: 'Disponible',
    imagenUrl: 'https://example.com/vehiculo.jpg',
    activo: true
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
  fechaHoraSalida: string;  // ISO 8601: "2024-10-10T08:00:00"
  fechaHoraLlegadaEstimada: string;
  fechaHoraLlegadaReal: string | null;
  tipoMovimiento: string;
  cargaPasajeros: string;
  estado: 'Programado' | 'En curso' | 'Completado' | 'Cancelado' | 'Inactivo';
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

**Valores válidos:** `Programado`, `En curso`, `Completado`, `Cancelado`, `Inactivo`

#### Buscar por Vehículo
**GET** `/movimientos/vehiculo/{vehiculoId}`

#### Buscar por Conductor
**GET** `/movimientos/conductor/{conductorId}`

**Ejemplos:**
```javascript
// Movimientos en curso
const getMovimientosEnCurso = async () => {
  const response = await api.get('/movimientos/estado/En curso');
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
| estado | string | ❌ | Default: "Programado" |
| observaciones | string | ❌ | Notas adicionales |

**Ejemplo:**
```javascript
const crearMovimiento = async (movimientoData) => {
  const response = await api.post('/movimientos', {
    codigo: 'MOV-050',
    vehiculoId: 2,
    conductorId: 3,
    origen: 'Lima',
    destino: 'Cusco',
    fechaHoraSalida: '2024-10-15T06:00:00',
    fechaHoraLlegadaEstimada: '2024-10-15T22:00:00',
    fechaHoraLlegadaReal: null,
    tipoMovimiento: 'Transporte de carga',
    cargaPasajeros: 'Carga refrigerada 18 toneladas',
    estado: 'Programado',
    observaciones: 'Requiere cadena de frío'
  });
  return response.data;
};
```

#### Actualizar Movimiento
**PUT** `/movimientos/{id}`

#### Eliminar Movimiento (Soft Delete)
**DELETE** `/movimientos/{id}`

#### Restaurar Movimiento ⭐ NUEVO
**PUT** `/movimientos/{id}/restore`

#### Listar Movimientos Eliminados ⭐ NUEVO
**GET** `/movimientos/deleted`

---

## 📊 Reportes ⭐ NUEVA TABLA

### Modelo de Datos
```typescript
interface Reporte {
  id: number;
  tipoReporte: string;
  generadoPor: number;        // ID del usuario
  fechaGeneracion: string;    // ISO 8601
  parametros: string;         // JSON como string
  resultado: string;          // JSON como string
  createdAt: string;
  deletedAt: string | null;
}
```

### Endpoints Disponibles

#### Listar Reportes
**GET** `/reportes`

#### Obtener Reporte por ID
**GET** `/reportes/{id}`

#### Crear Reporte
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
  const response = await api.post('/reportes', {
    tipoReporte: 'vehiculos',
    generadoPor: 1,
    parametros: JSON.stringify({
      estado: 'En operación',
      fecha: '2024-10-01'
    }),
    resultado: JSON.stringify({
      total: 25,
      activos: 20,
      inactivos: 5
    })
  });
  return response.data;
};
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
  const response = await api.get('/reportes/tipo/vehiculos');
  return response.data.data;
};

// Reportes generados por un usuario
const getReportesPorUsuario = async (usuarioId) => {
  const response = await api.get(`/reportes/usuario/${usuarioId}`);
  return response.data.data;
};
```

---

## ⚙️ Configuraciones ⭐ NUEVA TABLA

### Modelo de Datos
```typescript
interface Configuracion {
  id: number;
  clave: string;              // Clave única
  valor: string;              // Valor de la configuración
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
const maxVelocidad = await getConfigValue('max_velocidad_carretera');
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
  const response = await api.post('/configuraciones', {
    clave: 'max_velocidad_carretera',
    valor: '90',
    descripcion: 'Velocidad máxima permitida en carretera (km/h)'
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
    valor: nuevoValor
  });
  return response.data;
};

// Cambiar velocidad máxima
await updateConfigValue('max_velocidad_carretera', '100');
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

const configsVelocidad = await searchConfigs('velocidad');
```

---

## 📝 Logs de Auditoría ⭐ NUEVA TABLA

### Modelo de Datos
```typescript
interface LogAuditoria {
  id: string;                 // UUID
  tabla: string;              // Nombre de la tabla
  operacion: string;          // INSERT, UPDATE, DELETE
  registroId: number;         // ID del registro afectado
  usuarioId: number;          // ID del usuario que hizo el cambio
  descripcion: string;        // Descripción del cambio
  fecha: string;              // ISO 8601
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
const logsVehiculos = await getLogsByTabla('vehiculos');
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
  const response = await api.get(`/logs-auditoria/registro/${vehiculoId}/tabla/vehiculos`);
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
    fechaFin: fechaFin        // "2024-10-31T23:59:59"
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
  const response = await api.get('/logs-auditoria/estadisticas/tabla/vehiculos');
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
  const response = await api.get('/vehiculos/deleted');
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
  const response = await api.get('/conductores/deleted');
  return response.data.data;
};

const restaurarConductor = async (id) => {
  const response = await api.put(`/conductores/${id}/restore`);
  return response.data.data;
};
```

#### Usuarios
```javascript
const getUsuariosEliminados = async () => {
  const response = await api.get('/usuarios/deleted');
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
  const response = await api.get('/roles/deleted');
  return response.data.data;
};

const restaurarRol = async (id) => {
  const response = await api.put(`/roles/${id}/restore`);
  return response.data.data;
};
```

#### Movimientos
```javascript
const getMovimientosEliminados = async () => {
  const response = await api.get('/movimientos/deleted');
  return response.data.data;
};

const restaurarMovimiento = async (id) => {
  const response = await api.put(`/movimientos/${id}/restore`);
  return response.data.data;
};
```

#### Reportes
```javascript
const getReportesEliminados = async () => {
  const response = await api.get('/reportes/deleted');
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
  const response = await api.get('/configuraciones/deleted');
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
  content: T[];               // Datos de la página actual
  pageNumber: number;         // Número de página (0-based)
  pageSize: number;           // Tamaño de página
  totalElements: number;      // Total de elementos
  totalPages: number;         // Total de páginas
  first: boolean;             // Es la primera página
  last: boolean;              // Es la última página
}
```

**Ejemplo Completo:**
```javascript
const getVehiculosPaginados = async (page = 0, size = 10) => {
  const response = await api.get(`/vehiculos/paginated?page=${page}&size=${size}`);
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
    console.error('Error al cargar vehículos:', error);
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
    
    <span>Página {currentPage + 1} de {totalPages}</span>
    
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
import api from './api';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, nombre, rol } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userName', nombre);
      localStorage.setItem('userRole', rol);
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Error en login';
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  getToken: () => {
    return localStorage.getItem('token');
  }
};
```

### Servicio Completo de Vehículos (React)

```javascript
// services/vehiculoService.js
import api from './api';

export const vehiculoService = {
  // CRUD básico
  getAll: async () => {
    const response = await api.get('/vehiculos');
    return response.data.data;
  },
  
  getAllPaginated: async (page = 0, size = 10) => {
    const response = await api.get(`/vehiculos/paginated?page=${page}&size=${size}`);
    return response.data.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/vehiculos/${id}`);
    return response.data.data;
  },
  
  create: async (vehiculoData) => {
    const response = await api.post('/vehiculos', vehiculoData);
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
    const response = await api.get('/vehiculos/deleted');
    return response.data.data;
  }
};
```

### Servicio de Configuraciones (React)

```javascript
// services/configuracionService.js
import api from './api';

export const configuracionService = {
  getAll: async () => {
    const response = await api.get('/configuraciones');
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
    const response = await api.post('/configuraciones', configData);
    return response.data.data;
  },
  
  updateValue: async (clave, nuevoValor) => {
    const response = await api.put(`/configuraciones/valor/${clave}`, {
      valor: nuevoValor
    });
    return response.data.data;
  },
  
  search: async (pattern) => {
    const response = await api.get(`/configuraciones/buscar/${pattern}`);
    return response.data.data;
  }
};
```

### Servicio de Logs de Auditoría (React)

```javascript
// services/logAuditoriaService.js
import api from './api';

export const logAuditoriaService = {
  getAll: async () => {
    const response = await api.get('/logs-auditoria');
    return response.data.data;
  },
  
  getRecientes: async (limit = 50) => {
    const response = await api.get(`/logs-auditoria/recientes?limit=${limit}`);
    return response.data.data;
  },
  
  getByTabla: async (tabla) => {
    const response = await api.get(`/logs-auditoria/tabla/${tabla}`);
    return response.data.data;
  },
  
  getByUsuario: async (usuarioId) => {
    const response = await api.get(`/logs-auditoria/usuario/${usuarioId}`);
    return response.data.data;
  },
  
  getHistorialRegistro: async (registroId, tabla) => {
    const response = await api.get(`/logs-auditoria/registro/${registroId}/tabla/${tabla}`);
    return response.data.data;
  },
  
  getByFecha: async (fechaInicio, fechaFin) => {
    const params = new URLSearchParams({
      fechaInicio,
      fechaFin
    });
    const response = await api.get(`/logs-auditoria/fecha?${params}`);
    return response.data.data;
  },
  
  getStats: async (tabla) => {
    const response = await api.get(`/logs-auditoria/estadisticas/tabla/${tabla}`);
    return response.data.data;
  }
};
```

### Componente de Lista con Restaurar (React)

```jsx
// components/VehiculosList.jsx
import React, { useState, useEffect } from 'react';
import { vehiculoService } from '../services/vehiculoService';

const VehiculosList = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculosEliminados, setVehiculosEliminados] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVehiculos();
    loadVehiculosEliminados();
  }, []);

  const loadVehiculos = async () => {
    try {
      const data = await vehiculoService.getAll();
      setVehiculos(data);
    } catch (error) {
      console.error('Error al cargar vehículos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadVehiculosEliminados = async () => {
    try {
      const data = await vehiculoService.getDeleted();
      setVehiculosEliminados(data);
    } catch (error) {
      console.error('Error al cargar vehículos eliminados:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este vehículo?')) {
      try {
        await vehiculoService.delete(id);
        loadVehiculos();
        loadVehiculosEliminados();
      } catch (error) {
        alert('Error al eliminar vehículo');
      }
    }
  };

  const handleRestore = async (id) => {
    if (window.confirm('¿Está seguro de restaurar este vehículo?')) {
      try {
        await vehiculoService.restore(id);
        loadVehiculos();
        loadVehiculosEliminados();
        alert('Vehículo restaurado exitosamente');
      } catch (error) {
        alert('Error al restaurar vehículo');
      }
    }
  };

  if (loading) return <div>Cargando...</div>;

  const currentList = showDeleted ? vehiculosEliminados : vehiculos;

  return (
    <div className="vehiculos-list">
      <div className="header">
        <h2>Vehículos</h2>
        <button 
          onClick={() => setShowDeleted(!showDeleted)}
          className={showDeleted ? 'btn-secondary' : 'btn-primary'}
        >
          {showDeleted ? 'Ver Activos' : 'Ver Eliminados'}
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Placa</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentList.map((vehiculo) => (
            <tr key={vehiculo.id}>
              <td>{vehiculo.codigo}</td>
              <td>{vehiculo.placa}</td>
              <td>{vehiculo.marca}</td>
              <td>{vehiculo.modelo}</td>
              <td>{vehiculo.estadoActual}</td>
              <td>
                {showDeleted ? (
                  <button 
                    onClick={() => handleRestore(vehiculo.id)}
                    className="btn-success"
                  >
                    Restaurar
                  </button>
                ) : (
                  <button 
                    onClick={() => handleDelete(vehiculo.id)}
                    className="btn-danger"
                  >
                    Eliminar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehiculosList;
```

---

## ⚠️ Manejo de Errores

### Estructura de Error

```json
{
  "success": false,
  "message": "Mensaje de error descriptivo",
  "data": null
}
```

### Códigos de Estado HTTP

| Código | Significado | Acción Recomendada |
|--------|-------------|-------------------|
| 200 | OK | Operación exitosa |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Validar datos enviados |
| 401 | Unauthorized | Token inválido o expirado, redirigir a login |
| 403 | Forbidden | Sin permisos, mostrar mensaje |
| 404 | Not Found | Recurso no encontrado |
| 500 | Internal Server Error | Error del servidor, reintentar |

### Ejemplo de Manejo de Errores

```javascript
const handleApiError = (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        return 'Datos inválidos. Verifica la información ingresada.';
      case 401:
        authService.logout();
        return 'Sesión expirada. Por favor, inicia sesión nuevamente.';
      case 403:
        return 'No tienes permisos para realizar esta acción.';
      case 404:
        return 'Recurso no encontrado.';
      case 500:
        return 'Error del servidor. Intenta nuevamente más tarde.';
      default:
        return error.response.data?.message || 'Error desconocido';
    }
  } else if (error.request) {
    return 'No se pudo conectar con el servidor. Verifica tu conexión.';
  } else {
    return 'Error al procesar la solicitud.';
  }
};
```

---

## 🔗 URLs Importantes

- **API Base**: http://localhost:8081/api/v1
- **Swagger UI**: http://localhost:8081/swagger-ui.html
- **OpenAPI Docs**: http://localhost:8081/api-docs
- **Health Check**: http://localhost:8081/actuator/health
- **App Info**: http://localhost:8081/actuator/info

---

## 📋 Resumen de Endpoints por Tabla

### 1. Roles (5 endpoints)
```
GET    /roles
GET    /roles/{id}
POST   /roles
PUT    /roles/{id}
DELETE /roles/{id}
PUT    /roles/{id}/restore
GET    /roles/deleted
```

### 2. Usuarios (7 endpoints)
```
GET    /usuarios
GET    /usuarios/{id}
POST   /usuarios
PUT    /usuarios/{id}
DELETE /usuarios/{id}
PUT    /usuarios/{id}/restore
GET    /usuarios/deleted
```

### 3. Conductores (9 endpoints)
```
GET    /conductores
GET    /conductores/{id}
GET    /conductores/estado/{estado}
POST   /conductores
PUT    /conductores/{id}
DELETE /conductores/{id}
PUT    /conductores/{id}/restore
GET    /conductores/deleted
```

### 4. Vehículos (11 endpoints)
```
GET    /vehiculos
GET    /vehiculos/paginated
GET    /vehiculos/{id}
GET    /vehiculos/estado/{estado}
POST   /vehiculos
PUT    /vehiculos/{id}
DELETE /vehiculos/{id}
PUT    /vehiculos/{id}/restore
GET    /vehiculos/deleted
```

### 5. Movimientos (12 endpoints)
```
GET    /movimientos
GET    /movimientos/{id}
GET    /movimientos/estado/{estado}
GET    /movimientos/vehiculo/{vehiculoId}
GET    /movimientos/conductor/{conductorId}
POST   /movimientos
PUT    /movimientos/{id}
DELETE /movimientos/{id}
PUT    /movimientos/{id}/restore
GET    /movimientos/deleted
```

### 6. Reportes (9 endpoints)
```
GET    /reportes
GET    /reportes/{id}
GET    /reportes/tipo/{tipoReporte}
GET    /reportes/usuario/{usuarioId}
POST   /reportes
PUT    /reportes/{id}
DELETE /reportes/{id}
PUT    /reportes/{id}/restore
GET    /reportes/deleted
```

### 7. Configuraciones (12 endpoints)
```
GET    /configuraciones
GET    /configuraciones/{id}
GET    /configuraciones/clave/{clave}
GET    /configuraciones/valor/{clave}
GET    /configuraciones/buscar/{pattern}
POST   /configuraciones
PUT    /configuraciones/{id}
PUT    /configuraciones/valor/{clave}
DELETE /configuraciones/{id}
PUT    /configuraciones/{id}/restore
GET    /configuraciones/deleted
```

### 8. Logs de Auditoría (10 endpoints)
```
GET    /logs-auditoria
GET    /logs-auditoria/{id}
GET    /logs-auditoria/tabla/{tabla}
GET    /logs-auditoria/operacion/{operacion}
GET    /logs-auditoria/usuario/{usuarioId}
GET    /logs-auditoria/registro/{registroId}/tabla/{tabla}
GET    /logs-auditoria/fecha
GET    /logs-auditoria/recientes
GET    /logs-auditoria/estadisticas/tabla/{tabla}
GET    /logs-auditoria/estadisticas/operacion/{operacion}
```

### 9. Autenticación (1 endpoint)
```
POST   /auth/login
```

---

## 🎯 **TOTAL: 77 ENDPOINTS DISPONIBLES**

**¡Tu frontend puede consumir 77 endpoints diferentes para una funcionalidad completa!** 🚀

---

**¡Listo para integrar con tu frontend! 🎉**

Todos los endpoints están documentados con ejemplos de código, campos requeridos, y casos de uso. Tu API está completamente preparada para cualquier frontend moderno.