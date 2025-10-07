# 🚛 HINO CONNECT - Base de Datos

## 📋 Descripción General

Sistema de gestión de flota de vehículos HINO que permite administrar conductores, vehículos, movimientos y generar reportes. La base de datos está diseñada en PostgreSQL con extensiones UUID y pgcrypto para mayor seguridad.

## 🏗️ Arquitectura de la Base de Datos

### 🔧 Extensiones Utilizadas

- **uuid-ossp**: Para generar identificadores únicos UUID
- **pgcrypto**: Para funciones de encriptación y seguridad

## 📊 Tablas Principales

### 1. 👥 **roles**

**Propósito**: Define los diferentes roles de usuario en el sistema (Admin, Operador, Supervisor, etc.)

**Campos principales**:

- `id`: Identificador único del rol
- `nombre`: Nombre del rol (único)
- `descripcion`: Descripción detallada del rol
- `created_at`, `updated_at`, `deleted_at`: Timestamps de auditoría

**Funcionalidad**: Permite implementar un sistema de permisos basado en roles para controlar el acceso a diferentes funcionalidades del sistema.

### 2. 👤 **usuarios**

**Propósito**: Gestiona los usuarios del sistema con autenticación y asignación de roles

**Campos principales**:

- `id`: Identificador único del usuario
- `email`: Email único para login
- `password_hash`: Contraseña encriptada
- `nombre`, `apellido`: Datos personales
- `telefono`: Contacto
- `rol_id`: Referencia al rol asignado
- `activo`: Estado del usuario
- `ultimo_login`: Registro de último acceso

**Funcionalidad**: Sistema completo de autenticación con roles, permite login seguro y control de acceso basado en permisos.

### 3. 🚗 **conductores**

**Propósito**: Registro y gestión de conductores de la flota

**Campos principales**:

- `id`: Identificador único
- `codigo`: Código interno del conductor (C1, C2, etc.)
- `nombre`, `apellido`, `dni`: Datos personales
- `telefono`: Contacto
- `licencia`: Número de licencia de conducir
- `vehiculo_asignado`: Vehículo actualmente asignado
- `estado`: Estado actual (Activo, Inactivo, En Viaje)
- `fecha_ingreso`: Fecha de incorporación

**Funcionalidad**: Administra la información de conductores, permite asignar vehículos y controlar su disponibilidad para viajes.

### 4. 🚚 **vehiculos**

**Propósito**: Gestión completa de la flota de vehículos HINO

**Campos principales**:

- `id`: Identificador único
- `codigo`: Código interno del vehículo (V0001, V0002, etc.)
- `placa`: Placa única del vehículo
- `marca`, `modelo`: Información del vehículo
- `tipo`: Clasificación (Camión, Semitrailer, etc.)
- `anio_fabricacion`: Año de fabricación
- `numero_chasis`: Identificación del chasis
- `capacidad_carga`: Capacidad en kilogramos
- `combustible`: Tipo de combustible
- `estado_actual`: Estado operativo (En operación, En mantenimiento, Disponible, Inactivo)
- `imagen_url`: URL de imagen del vehículo

**Funcionalidad**: Control completo de la flota, permite gestionar mantenimientos, disponibilidad y características técnicas de cada vehículo.

### 5. 📍 **movimientos**

**Propósito**: Registro y seguimiento de todos los viajes y movimientos de vehículos

**Campos principales**:

- `id`: Identificador único
- `codigo`: Código del movimiento (MOV-001, MOV-002, etc.)
- `vehiculo_id`: Referencia al vehículo utilizado
- `conductor_id`: Referencia al conductor asignado
- `origen`, `destino`: Puntos de partida y llegada
- `fecha_hora_salida`: Momento de inicio del viaje
- `fecha_hora_llegada_estimada`: Tiempo estimado de llegada
- `fecha_hora_llegada_real`: Tiempo real de llegada
- `tipo_movimiento`: Clasificación del viaje (Transporte de carga, Viaje vacío, etc.)
- `carga_pasajeros`: Descripción de la carga o pasajeros
- `estado`: Estado del movimiento (Programado, En curso, Completado, Cancelado, Inactivo)
- `observaciones`: Notas adicionales

**Funcionalidad**: Core del sistema de tracking, permite programar viajes, hacer seguimiento en tiempo real y mantener historial completo de movimientos.

### 6. 📊 **reportes**

**Propósito**: Sistema de generación y almacenamiento de reportes

**Campos principales**:

- `id`: Identificador único
- `tipo_reporte`: Clasificación del reporte
- `generado_por`: Usuario que generó el reporte
- `fecha_generacion`: Timestamp de creación
- `parametros`: Filtros y parámetros utilizados (formato JSON)
- `resultado`: Datos del reporte generado (formato JSON)

**Funcionalidad**: Permite generar reportes personalizados sobre conductores, vehículos, movimientos y almacenar tanto los parámetros como los resultados para consultas futuras.

### 7. ⚙️ **configuracion**

**Propósito**: Almacena configuraciones globales del sistema

**Campos principales**:

- `id`: Identificador único
- `clave`: Nombre de la configuración (único)
- `valor`: Valor de la configuración
- `descripcion`: Descripción de qué controla esta configuración

**Funcionalidad**: Sistema flexible de configuración que permite ajustar parámetros del sistema sin modificar código, como límites de velocidad, tiempos de descanso, etc.

### 8. 📝 **logs_auditoria**

**Propósito**: Registro de auditoría para tracking de cambios

**Campos principales**:

- `id`: UUID único
- `tabla`: Tabla donde ocurrió el cambio
- `operacion`: Tipo de operación (INSERT, UPDATE, DELETE)
- `registro_id`: ID del registro afectado
- `usuario_id`: Usuario que realizó el cambio
- `descripcion`: Descripción del cambio
- `fecha`: Timestamp del evento

**Funcionalidad**: Proporciona trazabilidad completa de cambios en el sistema, esencial para auditorías y resolución de problemas.

## ⚡ Características Técnicas

### 🚀 Índices Optimizados

El sistema incluye índices estratégicos para mejorar el rendimiento:

- Búsquedas por email y DNI
- Filtros por estado de conductores y vehículos
- Consultas por fechas de movimientos
- Búsquedas por placas de vehículos

### 🔄 Triggers Automáticos

- **update_updated_at**: Actualiza automáticamente el campo `updated_at` en cada modificación
- **log_auditoria**: Registra automáticamente todos los cambios en las tablas principales

### 👁️ Vistas Predefinidas

- **vista_conductores_completa**: Conductores con estadísticas de viajes
- **vista_vehiculos_uso**: Vehículos con estadísticas de uso
- **vista_movimientos_completa**: Movimientos con información completa de vehículo y conductor

## 🔗 Relaciones Entre Tablas

### 🎯 Relaciones Principales:

1. **usuarios** ← **roles**: Un usuario tiene un rol
2. **movimientos** ← **vehiculos**: Un movimiento utiliza un vehículo
3. **movimientos** ← **conductores**: Un movimiento es realizado por un conductor
4. **reportes** ← **usuarios**: Un reporte es generado por un usuario
5. **logs_auditoria** ← **usuarios**: Los logs pueden referenciar al usuario que hizo el cambio

### 🛡️ Integridad Referencial:

- **CASCADE**: Al eliminar un vehículo, se eliminan sus movimientos
- **SET NULL**: Al eliminar un conductor, sus movimientos quedan sin conductor asignado
- **RESTRICT**: No se pueden eliminar roles o usuarios si están siendo referenciados

## 🔒 Seguridad y Auditoría

### 🗑️ Soft Delete

Todas las tablas principales implementan "soft delete" mediante el campo `deleted_at`, permitiendo recuperar registros eliminados accidentalmente.

### 📋 Auditoría Completa

Cada cambio en las tablas principales queda registrado automáticamente en `logs_auditoria` con información del usuario, fecha y tipo de operación.

### ✅ Validaciones

- Estados controlados mediante CHECK constraints
- Campos únicos para evitar duplicados (email, DNI, placas, códigos)
- Referencias foráneas para mantener integridad

## 💼 Casos de Uso Principales

1. 🚚 **Gestión de Flota**: Administrar vehículos, mantenimientos y disponibilidad
2. 👨‍💼 **Asignación de Conductores**: Asignar conductores a vehículos y viajes
3. 📅 **Programación de Viajes**: Crear y gestionar movimientos de vehículos
4. 📡 **Seguimiento en Tiempo Real**: Monitorear estado de viajes activos
5. 📈 **Reportes y Analytics**: Generar informes de rendimiento y uso
6. 🔍 **Auditoría y Compliance**: Mantener trazabilidad completa de operaciones

Este diseño proporciona una base sólida para un sistema completo de gestión de flota con capacidades de tracking, reportes y auditoría.
