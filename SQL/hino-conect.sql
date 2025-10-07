-- ============================================
-- SCHEMA BASE DE DATOS HINO CONNECT
-- PostgreSQL (Neon)
-- ============================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLA: roles
-- ============================================
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- ============================================
-- TABLA: usuarios
-- ============================================
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    rol_id INTEGER REFERENCES roles(id),
    activo BOOLEAN DEFAULT true,
    ultimo_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- ============================================
-- TABLA: conductores
-- ============================================
CREATE TABLE conductores (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL, -- Ej: C1, C2, C3
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    dni VARCHAR(20) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    licencia VARCHAR(50) NOT NULL,
    vehiculo_asignado VARCHAR(50), -- Ej: HINO GH-4-2023
    estado VARCHAR(20) DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo', 'En Viaje')),
    fecha_ingreso DATE,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- ============================================
-- TABLA: vehiculos
-- ============================================
CREATE TABLE vehiculos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL, -- Ej: V0001, V0002
    placa VARCHAR(20) UNIQUE NOT NULL,
    marca VARCHAR(50) NOT NULL, -- Hino
    modelo VARCHAR(50) NOT NULL,
    tipo VARCHAR(50), -- Camión, Semitrailer, etc.
    anio_fabricacion INTEGER,
    numero_chasis VARCHAR(50),
    capacidad_carga DECIMAL(10,2), -- en kg
    combustible VARCHAR(20), -- Gasolina, Diesel, etc.
    estado_actual VARCHAR(50) DEFAULT 'En operación' CHECK (estado_actual IN ('En operación', 'En mantenimiento', 'Disponible', 'Inactivo')),
    imagen_url TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- ============================================
-- TABLA: movimientos
-- ============================================
CREATE TABLE movimientos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL, -- Ej: MOV-001, MOV-002
    vehiculo_id INTEGER REFERENCES vehiculos(id) ON DELETE CASCADE,
    conductor_id INTEGER REFERENCES conductores(id) ON DELETE SET NULL,
    origen VARCHAR(255) NOT NULL,
    destino VARCHAR(255) NOT NULL,
    fecha_hora_salida TIMESTAMP NOT NULL,
    fecha_hora_llegada_estimada TIMESTAMP,
    fecha_hora_llegada_real TIMESTAMP,
    tipo_movimiento VARCHAR(50), -- Transporte de carga, Viaje vacío, etc.
    carga_pasajeros TEXT,
    estado VARCHAR(50) DEFAULT 'Programado' CHECK (estado IN ('Programado', 'En curso', 'Completado', 'Cancelado', 'Inactivo')),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- ============================================
-- TABLA: reportes
-- ============================================
CREATE TABLE reportes (
    id SERIAL PRIMARY KEY,
    tipo_reporte VARCHAR(100) NOT NULL,
    generado_por INTEGER REFERENCES usuarios(id),
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    parametros JSONB, -- Para almacenar filtros y parámetros del reporte
    resultado JSONB, -- Para almacenar datos del reporte
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: configuracion
-- ============================================
CREATE TABLE configuracion (
    id SERIAL PRIMARY KEY,
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- ============================================
-- TABLA: logs_auditoria
-- ============================================
CREATE TABLE logs_auditoria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tabla VARCHAR(100) NOT NULL,
    operacion VARCHAR(50) NOT NULL,
    registro_id INTEGER,
    usuario_id INTEGER,
    descripcion TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ÍNDICES para mejorar rendimiento
-- ============================================
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol_id);
CREATE INDEX idx_conductores_dni ON conductores(dni);
CREATE INDEX idx_conductores_estado ON conductores(estado);
CREATE INDEX idx_vehiculos_placa ON vehiculos(placa);
CREATE INDEX idx_vehiculos_estado ON vehiculos(estado_actual);
CREATE INDEX idx_movimientos_vehiculo ON movimientos(vehiculo_id);
CREATE INDEX idx_movimientos_conductor ON movimientos(conductor_id);
CREATE INDEX idx_movimientos_estado ON movimientos(estado);
CREATE INDEX idx_movimientos_fecha_salida ON movimientos(fecha_hora_salida);

-- ============================================
-- TRIGGERS para auditoría y actualización de updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION log_auditoria()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO logs_auditoria (tabla, operacion, registro_id, usuario_id, descripcion)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.id, NULL, 'Cambio detectado en ' || TG_TABLE_NAME);
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Aplicar triggers
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conductores_updated_at BEFORE UPDATE ON conductores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehiculos_updated_at BEFORE UPDATE ON vehiculos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_movimientos_updated_at BEFORE UPDATE ON movimientos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers de auditoría
CREATE TRIGGER audit_usuarios AFTER INSERT OR UPDATE OR DELETE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION log_auditoria();

CREATE TRIGGER audit_conductores AFTER INSERT OR UPDATE OR DELETE ON conductores
    FOR EACH ROW EXECUTE FUNCTION log_auditoria();

CREATE TRIGGER audit_vehiculos AFTER INSERT OR UPDATE OR DELETE ON vehiculos
    FOR EACH ROW EXECUTE FUNCTION log_auditoria();

CREATE TRIGGER audit_movimientos AFTER INSERT OR UPDATE OR DELETE ON movimientos
    FOR EACH ROW EXECUTE FUNCTION log_auditoria();

-- ============================================
-- VISTAS ÚTILES
-- ============================================

CREATE VIEW vista_conductores_completa AS
SELECT 
    c.*,
    COUNT(m.id) AS total_viajes,
    MAX(m.fecha_hora_salida) AS ultimo_viaje
FROM conductores c
LEFT JOIN movimientos m ON c.id = m.conductor_id
GROUP BY c.id;

CREATE VIEW vista_vehiculos_uso AS
SELECT 
    v.*,
    COUNT(m.id) AS total_movimientos,
    MAX(m.fecha_hora_salida) AS ultimo_movimiento
FROM vehiculos v
LEFT JOIN movimientos m ON v.id = m.vehiculo_id
GROUP BY v.id;

CREATE VIEW vista_movimientos_completa AS
SELECT 
    m.*,
    v.placa AS vehiculo_placa,
    v.marca AS vehiculo_marca,
    v.modelo AS vehiculo_modelo,
    c.nombre || ' ' || c.apellido AS conductor_nombre,
    c.dni AS conductor_dni
FROM movimientos m
LEFT JOIN vehiculos v ON m.vehiculo_id = v.id
LEFT JOIN conductores c ON m.conductor_id = c.id;

-- ============================================
-- COMENTARIOS
-- ============================================
COMMENT ON TABLE usuarios IS 'Usuarios del sistema con autenticación y roles';
COMMENT ON TABLE conductores IS 'Conductores registrados en la empresa';
COMMENT ON TABLE vehiculos IS 'Flota de vehículos Hino';
COMMENT ON TABLE movimientos IS 'Registro de viajes y movimientos de vehículos';
COMMENT ON TABLE reportes IS 'Reportes generados por el sistema';
COMMENT ON TABLE configuracion IS 'Configuración general del sistema';
COMMENT ON TABLE logs_auditoria IS 'Registra cambios y acciones en las tablas principales';
