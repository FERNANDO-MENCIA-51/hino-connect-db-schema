import { vehiculoService } from "./vehiculoService";
import { conductoresService } from "./conductoresService";
import { usuarioService } from "./usuarioService";
import { movimientoService } from "./movimientoService";

export const dashboardService = {
    // Obtener estadísticas generales del dashboard usando los servicios existentes
    getStats: async () => {
        try {
            console.log("🔄 Obteniendo estadísticas del dashboard...");

            // Obtener datos de cada servicio existente
            const [vehiculosResponse, conductoresResponse, usuariosResponse, movimientosResponse] = await Promise.allSettled([
                vehiculoService?.listarVehiculos?.() || Promise.resolve({ data: [] }),
                conductoresService?.listarConductores?.() || Promise.resolve({ data: [] }),
                usuarioService?.listarUsuarios?.() || Promise.resolve({ data: [] }),
                movimientoService?.listarMovimientos?.() || Promise.resolve({ data: [] })
            ]);

            // Procesar vehículos
            const vehiculos = vehiculosResponse.status === 'fulfilled' ? vehiculosResponse.value.data : [];
            const vehiculosStats = {
                total: vehiculos.length,
                activos: vehiculos.filter(v => v.estadoActual === 'En operación').length,
                enMantenimiento: vehiculos.filter(v => v.estadoActual === 'En mantenimiento').length,
                disponibles: vehiculos.filter(v => v.estadoActual === 'Disponible').length,
                inactivos: vehiculos.filter(v => v.estadoActual === 'Inactivo').length
            };

            // Procesar conductores
            const conductores = conductoresResponse.status === 'fulfilled' ? conductoresResponse.value.data : [];
            const conductoresStats = {
                total: conductores.length,
                activos: conductores.filter(c => c.estado === 'Activo').length,
                inactivos: conductores.filter(c => c.estado === 'Inactivo').length,
                enViaje: conductores.filter(c => c.estado === 'En Viaje').length
            };

            // Procesar usuarios
            const usuarios = usuariosResponse.status === 'fulfilled' ? usuariosResponse.value.data : [];
            const usuariosStats = {
                total: usuarios.length,
                activos: usuarios.filter(u => !u.deletedAt).length,
                inactivos: usuarios.filter(u => u.deletedAt).length
            };

            // Procesar movimientos
            const movimientos = movimientosResponse.status === 'fulfilled' ? movimientosResponse.value.data : [];
            const movimientosStats = {
                total: movimientos.length,
                completados: movimientos.filter(m => m.estado === 'Completado').length,
                enCurso: movimientos.filter(m => m.estado === 'En curso').length,
                programados: movimientos.filter(m => m.estado === 'Programado').length,
                cancelados: movimientos.filter(m => m.estado === 'Cancelado').length
            };

            const stats = {
                vehiculos: vehiculosStats,
                conductores: conductoresStats,
                usuarios: usuariosStats,
                movimientos: movimientosStats
            };

            console.log("✅ Estadísticas obtenidas:", stats);
            console.log("📊 Detalles por servicio:");
            console.log("- Vehículos:", vehiculos.length, vehiculos);
            console.log("- Conductores:", conductores.length, conductores);
            console.log("- Usuarios:", usuarios.length, usuarios);
            console.log("- Movimientos:", movimientos.length, movimientos);
            return { data: stats };

        } catch (error) {
            console.error("❌ Error al obtener estadísticas:", error);
            // Si hay error, devolver datos en cero
            const emptyStats = {
                vehiculos: { total: 0, activos: 0, enMantenimiento: 0, disponibles: 0, inactivos: 0 },
                conductores: { total: 0, activos: 0, inactivos: 0, enViaje: 0 },
                usuarios: { total: 0, activos: 0, inactivos: 0 },
                movimientos: { total: 0, completados: 0, enCurso: 0, programados: 0, cancelados: 0 }
            };
            return { data: emptyStats };
        }
    },

    // Obtener datos para gráficos de movimientos basado en datos reales
    getMovimientosChart: async () => {
        try {
            // Obtener movimientos reales
            const movimientosResponse = await movimientoService?.listarMovimientos?.() || { data: [] };
            const movimientos = movimientosResponse.data || [];

            // Generar datos por mes basados en movimientos reales
            const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sept", "Oct", "Nov", "Dic"];
            const currentYear = new Date().getFullYear();
            const lastYear = currentYear - 1;

            const movimientosData = meses.slice(0, 9).map(mes => {
                const mesIndex = meses.indexOf(mes);

                // Contar movimientos del año actual
                const movimientosCurrentYear = movimientos.filter(m => {
                    const fecha = new Date(m.fechaHoraSalidaProgramada || m.createdAt);
                    return fecha.getFullYear() === currentYear && fecha.getMonth() === mesIndex;
                }).length;

                // Contar movimientos del año pasado
                const movimientosLastYear = movimientos.filter(m => {
                    const fecha = new Date(m.fechaHoraSalidaProgramada || m.createdAt);
                    return fecha.getFullYear() === lastYear && fecha.getMonth() === mesIndex;
                }).length;

                return {
                    mes,
                    valor1: movimientosCurrentYear * 10, // Multiplicar para mejor visualización
                    valor2: movimientosLastYear * 10
                };
            });

            return { data: movimientosData };
        } catch (error) {
            console.error("❌ Error al obtener datos de movimientos:", error);
            // Datos vacíos si hay error
            const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sept"];
            const emptyMovimientosData = meses.map(mes => ({ mes, valor1: 0, valor2: 0 }));
            return { data: emptyMovimientosData };
        }
    },

    // Obtener datos para gráfico semanal basado en movimientos reales
    getMovimientoSemanal: async () => {
        try {
            // Obtener movimientos reales
            const movimientosResponse = await movimientoService?.listarMovimientos?.() || { data: [] };
            const movimientos = movimientosResponse.data || [];

            const diasSemana = ["Dom", "Lun", "Mar", "Mier", "Juev", "Vier", "Sab"];
            const hoy = new Date();
            const hace7Dias = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);

            const movimientoGraficoData = diasSemana.map((dia, index) => {
                // Contar movimientos de los últimos 7 días por día de la semana
                const movimientosDia = movimientos.filter(m => {
                    const fecha = new Date(m.fechaHoraSalidaProgramada || m.createdAt);
                    return fecha >= hace7Dias && fecha.getDay() === index;
                }).length;

                return {
                    mes: dia,
                    valor: movimientosDia
                };
            });

            return { data: movimientoGraficoData };
        } catch (error) {
            console.error("❌ Error al obtener movimiento semanal:", error);
            const diasSemana = ["Dom", "Lun", "Mar", "Mier", "Juev", "Vier", "Sab"];
            const emptyMovimientoGraficoData = diasSemana.map(dia => ({ mes: dia, valor: 0 }));
            return { data: emptyMovimientoGraficoData };
        }
    },

    // Obtener porcentajes de usuarios basado en datos reales
    getUsuariosStats: async () => {
        try {
            // Obtener usuarios reales
            const usuariosResponse = await usuarioService?.listarUsuarios?.() || { data: [] };
            const usuarios = usuariosResponse.data || [];

            const activos = usuarios.filter(u => !u.deletedAt).length;
            const inactivos = usuarios.filter(u => u.deletedAt).length;

            const usuariosData = [
                { name: "Inactivos", value: inactivos, color: "#a78bfa" },
                { name: "Activos", value: activos, color: "#6366f1" },
            ];

            return { data: usuariosData };
        } catch (error) {
            console.error("❌ Error al obtener estadísticas de usuarios:", error);
            const emptyUsuariosData = [
                { name: "Inactivos", value: 0, color: "#a78bfa" },
                { name: "Activos", value: 0, color: "#6366f1" },
            ];
            return { data: emptyUsuariosData };
        }
    },

    // Calcular porcentajes para los gráficos circulares
    calculatePercentages: (stats) => {
        // Evitar división por cero
        const vehiculosPercentage = stats.vehiculos.total > 0
            ? Math.round((stats.vehiculos.activos / stats.vehiculos.total) * 100)
            : 0;

        const usuariosPercentage = stats.usuarios.total > 0
            ? Math.round((stats.usuarios.activos / stats.usuarios.total) * 100)
            : 0;

        const movimientosPercentage = stats.movimientos.total > 0
            ? Math.round((stats.movimientos.completados / stats.movimientos.total) * 100)
            : 0;

        return {
            vehiculos: vehiculosPercentage,
            usuarios: usuariosPercentage,
            movimientos: movimientosPercentage
        };
    }
};

export default dashboardService;