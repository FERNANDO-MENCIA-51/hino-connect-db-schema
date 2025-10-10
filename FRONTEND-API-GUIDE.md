# 🎨 HINO CONNECT - Guía de Integración Frontend

Documentación completa para consumir la API desde el frontend.

## 📋 Tabla de Contenidos

1. [Configuración Inicial](#-configuración-inicial)
2. [Autenticación](#-autenticación)
3. [Endpoints y Campos](#-endpoints-y-campos)
4. [Ejemplos de Código](#-ejemplos-de-código)
5. [Manejo de Errores](#-manejo-de-errores)

---

## ⚙️ Configuración Inicial

### Base URL

```javascript
const API_BASE_URL = "http://localhost:8080/api/v1";
```

### Configuración de Axios (Recomendado)

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
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

| Campo    | Tipo   | Requerido | Validación           |
| -------- | ------ | --------- | -------------------- |
| email    | string | ✅        | Formato email válido |
| password | string | ✅        | Mínimo 6 caracteres  |

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
    "rol": "ADMIN"
  }
}
```

---

## 📊 Endpoints y Campos

### 1️⃣ ROLES

#### Listar Roles

**GET** `/roles`

**Response:**

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
    nombre: "OPERADOR",
    descripcion: "Operador de flota",
  });
  return response.data;
};
```

---

### 2️⃣ USUARIOS

#### Listar Usuarios

**GET** `/usuarios`

**Response:**

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

#### Crear Usuario

**POST** `/usuarios`

**Campos:**
| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|------------|
| email | string | ✅ | Email único, formato válido |
| passwordHash | string | ✅ | Mínimo 6 caracteres (se encripta automáticamente) |
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

**Nota:** Si no se envía `passwordHash` o está vacío, se mantiene el password actual.

---

### 3️⃣ CONDUCTORES

#### Listar Conductores

**GET** `/conductores`

**Response:**

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
  estado: "Activo" | "Inactivo" | "En Viaje";
  fechaIngreso: string; // Formato: YYYY-MM-DD
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
```

#### Buscar por Estado

**GET** `/conductores/estado/{estado}`

**Valores válidos:** `Activo`, `Inactivo`, `En Viaje`

**Ejemplo:**

```javascript
const getConductoresActivos = async () => {
  const response = await api.get("/conductores/estado/Activo");
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
  const response = await api.post("/conductores", {
    codigo: "C010",
    nombre: "Miguel",
    apellido: "Torres",
    dni: "45678901",
    telefono: "987444555",
    licencia: "A-III-b",
    vehiculoAsignado: null,
    estado: "Activo",
    fechaIngreso: "2024-10-10",
    activo: true,
  });
  return response.data;
};
```

---

### 4️⃣ VEHÍCULOS

#### Listar Vehículos

**GET** `/vehiculos`

**Response:**

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
  estadoActual: "En operación" | "En mantenimiento" | "Disponible" | "Inactivo";
  imagenUrl: string | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
```

#### Buscar por Estado

**GET** `/vehiculos/estado/{estado}`

**Valores válidos:** `En operación`, `En mantenimiento`, `Disponible`, `Inactivo`

**Ejemplo:**

```javascript
const getVehiculosDisponibles = async () => {
  const response = await api.get("/vehiculos/estado/Disponible");
  return response.data.data;
};
```

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
    estadoActual: "Disponible",
    imagenUrl: "https://example.com/vehiculo.jpg",
    activo: true,
  });
  return response.data;
};
```

---

### 5️⃣ MOVIMIENTOS

#### Listar Movimientos

**GET** `/movimientos`

**Response:**

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
  estado: "Programado" | "En curso" | "Completado" | "Cancelado" | "Inactivo";
  observaciones: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
```

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
  const response = await api.get("/movimientos/estado/En curso");
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
    estado: "Programado",
    observaciones: "Requiere cadena de frío",
  });
  return response.data;
};
```

#### Actualizar Movimiento (Completar viaje)

**PUT** `/movimientos/{id}`

**Ejemplo:**

```javascript
const completarMovimiento = async (id, fechaLlegadaReal) => {
  // Primero obtener el movimiento actual
  const movimiento = await api.get(`/movimientos/${id}`);

  // Actualizar con los nuevos datos
  const response = await api.put(`/movimientos/${id}`, {
    ...movimiento.data.data,
    fechaHoraLlegadaReal: fechaLlegadaReal,
    estado: "Completado",
    observaciones: "Viaje completado exitosamente",
  });

  return response.data;
};
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

### Servicio de Vehículos (React)

```javascript
// services/vehiculoService.js
import api from "./api";

export const vehiculoService = {
  getAll: async () => {
    const response = await api.get("/vehiculos");
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`/vehiculos/${id}`);
    return response.data.data;
  },

  getByEstado: async (estado) => {
    const response = await api.get(`/vehiculos/estado/${estado}`);
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
};
```

### Componente de Login (React)

```jsx
// components/Login.jsx
import React, { useState } from "react";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>HINO Connect - Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </button>
      </form>
    </div>
  );
};

export default Login;
```

### Componente de Lista de Vehículos (React)

```jsx
// components/VehiculosList.jsx
import React, { useState, useEffect } from "react";
import { vehiculoService } from "../services/vehiculoService";

const VehiculosList = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadVehiculos();
  }, []);

  const loadVehiculos = async () => {
    try {
      const data = await vehiculoService.getAll();
      setVehiculos(data);
    } catch (err) {
      setError("Error al cargar vehículos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de eliminar este vehículo?")) {
      try {
        await vehiculoService.delete(id);
        loadVehiculos(); // Recargar lista
      } catch (err) {
        alert("Error al eliminar vehículo");
      }
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="vehiculos-list">
      <h2>Vehículos</h2>
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
          {vehiculos.map((vehiculo) => (
            <tr key={vehiculo.id}>
              <td>{vehiculo.codigo}</td>
              <td>{vehiculo.placa}</td>
              <td>{vehiculo.marca}</td>
              <td>{vehiculo.modelo}</td>
              <td>{vehiculo.estadoActual}</td>
              <td>
                <button onClick={() => handleDelete(vehiculo.id)}>
                  Eliminar
                </button>
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

| Código | Significado           | Acción Recomendada                           |
| ------ | --------------------- | -------------------------------------------- |
| 200    | OK                    | Operación exitosa                            |
| 201    | Created               | Recurso creado exitosamente                  |
| 400    | Bad Request           | Validar datos enviados                       |
| 401    | Unauthorized          | Token inválido o expirado, redirigir a login |
| 403    | Forbidden             | Sin permisos, mostrar mensaje                |
| 404    | Not Found             | Recurso no encontrado                        |
| 500    | Internal Server Error | Error del servidor, reintentar               |

### Ejemplo de Manejo de Errores

```javascript
const handleApiError = (error) => {
  if (error.response) {
    // El servidor respondió con un código de error
    switch (error.response.status) {
      case 400:
        return "Datos inválidos. Verifica la información ingresada.";
      case 401:
        authService.logout();
        return "Sesión expirada. Por favor, inicia sesión nuevamente.";
      case 403:
        return "No tienes permisos para realizar esta acción.";
      case 404:
        return "Recurso no encontrado.";
      case 500:
        return "Error del servidor. Intenta nuevamente más tarde.";
      default:
        return error.response.data?.message || "Error desconocido";
    }
  } else if (error.request) {
    // La petición se hizo pero no hubo respuesta
    return "No se pudo conectar con el servidor. Verifica tu conexión.";
  } else {
    // Error al configurar la petición
    return "Error al procesar la solicitud.";
  }
};

// Uso
try {
  await vehiculoService.create(vehiculoData);
} catch (error) {
  const errorMessage = handleApiError(error);
  alert(errorMessage);
}
```

---

## 📝 Validaciones Recomendadas en Frontend

### Email

```javascript
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
```

### DNI (Perú - 8 dígitos)

```javascript
const validateDNI = (dni) => {
  const regex = /^\d{8}$/;
  return regex.test(dni);
};
```

### Placa (Formato peruano)

```javascript
const validatePlaca = (placa) => {
  const regex = /^[A-Z]{3}-\d{3}$/;
  return regex.test(placa);
};
```

### Fecha (No puede ser pasada)

```javascript
const validateFechaFutura = (fecha) => {
  const fechaSeleccionada = new Date(fecha);
  const hoy = new Date();
  return fechaSeleccionada >= hoy;
};
```

---

## 🎯 Tips y Mejores Prácticas

1. **Siempre validar datos antes de enviar**

   - Campos requeridos completos
   - Formatos correctos
   - Longitudes máximas

2. **Manejar estados de carga**

   - Mostrar spinners durante peticiones
   - Deshabilitar botones mientras se procesa

3. **Feedback al usuario**

   - Mensajes de éxito claros
   - Mensajes de error descriptivos
   - Confirmaciones para acciones destructivas

4. **Optimizar peticiones**

   - Cachear datos cuando sea posible
   - Usar debounce en búsquedas
   - Implementar paginación si hay muchos datos

5. **Seguridad**
   - Nunca exponer el token en logs
   - Limpiar localStorage al cerrar sesión
   - Validar permisos en el frontend también

---

## 🔗 URLs Importantes

- **API Base**: http://localhost:8080/api/v1
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI Docs**: http://localhost:8080/api-docs

---

**¡Listo para integrar! 🚀**

Si tienes dudas, consulta la documentación completa en Swagger UI o contacta al equipo de backend.
