package pe.edu.vallegrande.ms_catalogo_vehiculos.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.r2dbc.postgresql.codec.Json;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import pe.edu.vallegrande.ms_catalogo_vehiculos.dto.ReporteRequest;
import pe.edu.vallegrande.ms_catalogo_vehiculos.dto.ReporteResponse;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Reporte;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Usuario;
import pe.edu.vallegrande.ms_catalogo_vehiculos.repository.ConductorRepository;
import pe.edu.vallegrande.ms_catalogo_vehiculos.repository.MovimientoRepository;
import pe.edu.vallegrande.ms_catalogo_vehiculos.repository.ReporteRepository;
import pe.edu.vallegrande.ms_catalogo_vehiculos.repository.UsuarioRepository;
import pe.edu.vallegrande.ms_catalogo_vehiculos.repository.VehiculoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReporteService {

    private final ReporteRepository repository;
    private final ConductorRepository conductorRepository;
    private final VehiculoRepository vehiculoRepository;
    private final MovimientoRepository movimientoRepository;
    private final UsuarioRepository usuarioRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public Flux<Reporte> findAll() {
        log.debug("Buscando todos los reportes activos");
        return repository.findAllActive();
    }

    public Flux<ReporteResponse> findAllAsResponse() {
        log.debug("Buscando todos los reportes activos como Response");
        return repository.findAllActive()
                .flatMap(reporte -> usuarioRepository.findById(reporte.getGeneradoPor())
                        .map(usuario -> toResponseWithUsuario(reporte, usuario))
                        .defaultIfEmpty(toResponse(reporte)));
    }

    public Mono<Reporte> findById(Integer id) {
        log.debug("Buscando reporte por ID: {}", id);
        return repository.findByIdActive(id);
    }

    public Mono<ReporteResponse> findByIdAsResponse(Integer id) {
        log.debug("Buscando reporte por ID como Response: {}", id);
        return repository.findByIdActive(id)
                .flatMap(reporte -> usuarioRepository.findById(reporte.getGeneradoPor())
                        .map(usuario -> toResponseWithUsuario(reporte, usuario))
                        .defaultIfEmpty(toResponse(reporte)));
    }

    public Mono<Reporte> create(Reporte reporte) {
        log.info("Creando reporte de tipo: {}", reporte.getTipoReporte());
        reporte.setCreatedAt(LocalDateTime.now());
        reporte.setFechaGeneracion(LocalDateTime.now());
        return repository.save(reporte)
                .doOnSuccess(r -> log.info("Reporte creado exitosamente con ID: {}", r.getId()))
                .doOnError(e -> log.error("Error al crear reporte", e));
    }

    public Mono<Reporte> update(Integer id, Reporte reporte) {
        log.debug("Actualizando reporte ID: {}", id);
        return repository.findByIdActive(id)
                .flatMap(existing -> {
                    reporte.setId(id);
                    reporte.setCreatedAt(existing.getCreatedAt());
                    return repository.save(reporte);
                })
                .doOnSuccess(r -> log.info("Reporte actualizado exitosamente: {}", id))
                .doOnError(e -> log.error("Error al actualizar reporte", e));
    }

    public Mono<Void> delete(Integer id) {
        log.info("Eliminando reporte ID: {}", id);
        return repository.findByIdActive(id)
                .flatMap(reporte -> {
                    reporte.setDeletedAt(LocalDateTime.now());
                    return repository.save(reporte);
                })
                .doOnSuccess(r -> log.info("Reporte eliminado exitosamente: {}", id))
                .then();
    }

    public Mono<Reporte> restore(Integer id) {
        log.info("Restaurando reporte ID: {}", id);
        return repository.findByIdDeleted(id)
                .flatMap(reporte -> {
                    reporte.setDeletedAt(null);
                    return repository.save(reporte);
                })
                .doOnSuccess(r -> log.info("Reporte restaurado exitosamente: {}", id))
                .doOnError(e -> log.error("Error al restaurar reporte", e));
    }

    public Mono<ReporteResponse> restoreAsResponse(Integer id) {
        log.info("Restaurando reporte ID como Response: {}", id);
        return repository.findByIdDeleted(id)
                .flatMap(reporte -> {
                    reporte.setDeletedAt(null);
                    return repository.save(reporte);
                })
                .flatMap(savedReporte -> usuarioRepository.findById(savedReporte.getGeneradoPor())
                        .map(usuario -> toResponseWithUsuario(savedReporte, usuario))
                        .defaultIfEmpty(toResponse(savedReporte)))
                .doOnSuccess(r -> log.info("Reporte restaurado exitosamente: {}", id))
                .doOnError(e -> log.error("Error al restaurar reporte", e));
    }

    public Flux<Reporte> findByTipoReporte(String tipoReporte) {
        log.debug("Buscando reportes por tipo: {}", tipoReporte);
        return repository.findByTipoReporte(tipoReporte);
    }

    public Flux<Reporte> findByGeneradoPor(Integer usuarioId) {
        log.debug("Buscando reportes generados por usuario: {}", usuarioId);
        return repository.findByGeneradoPor(usuarioId);
    }

    public Flux<Reporte> findAllDeleted() {
        log.debug("Buscando todos los reportes eliminados");
        return repository.findAllDeleted();
    }

    public Mono<ReporteResponse> createFromRequest(ReporteRequest request) {
        log.info("Creando reporte desde request: {}", request.getTipoReporte());
        Reporte reporte = new Reporte();
        reporte.setTipoReporte(request.getTipoReporte());
        reporte.setGeneradoPor(request.getGeneradoPor());
        reporte.setParametros(Json.of(request.getParametros()));
        reporte.setResultado(Json.of(request.getResultado()));
        reporte.setCreatedAt(LocalDateTime.now());
        reporte.setFechaGeneracion(LocalDateTime.now());

        return repository.save(reporte)
                .map(this::toResponse)
                .doOnSuccess(r -> log.info("Reporte creado exitosamente con ID: {}", r.getId()));
    }

    public Mono<ReporteResponse> generarReporteConductores(String periodo, Integer usuarioId) {
        log.info("Generando reporte de conductores para periodo: {}", periodo);

        return conductorRepository.findAllActive()
                .collectList()
                .flatMap(conductores -> {
                    try {
                        // Crear parámetros
                        Map<String, Object> parametros = new HashMap<>();
                        parametros.put("periodo", periodo);

                        // Crear resultado
                        Map<String, Object> resultado = new HashMap<>();
                        long activos = conductores.stream().filter(c -> "activo".equals(c.getEstado())).count();
                        long inactivos = conductores.stream().filter(c -> "inactivo".equals(c.getEstado())).count();

                        resultado.put("activos", activos);
                        resultado.put("inactivos", inactivos);
                        resultado.put("total_conductores", conductores.size());

                        // Crear reporte
                        Reporte reporte = new Reporte();
                        reporte.setTipoReporte("conductores");
                        reporte.setGeneradoPor(usuarioId);
                        reporte.setParametros(Json.of(objectMapper.writeValueAsString(parametros)));
                        reporte.setResultado(Json.of(objectMapper.writeValueAsString(resultado)));
                        reporte.setCreatedAt(LocalDateTime.now());
                        reporte.setFechaGeneracion(LocalDateTime.now());

                        return repository.save(reporte)
                                .flatMap(savedReporte -> usuarioRepository.findById(usuarioId)
                                        .map(usuario -> toResponseWithUsuario(savedReporte, usuario))
                                        .defaultIfEmpty(toResponse(savedReporte)));

                    } catch (JsonProcessingException e) {
                        log.error("Error generando reporte de conductores", e);
                        return Mono.error(e);
                    }
                });
    }

    public Mono<ReporteResponse> generarReporteVehiculos(String estado, Integer usuarioId) {
        log.info("Generando reporte de vehículos para estado: {}", estado);

        return vehiculoRepository.findAllActive()
                .collectList()
                .flatMap(vehiculos -> {
                    try {
                        // Crear parámetros
                        Map<String, Object> parametros = new HashMap<>();
                        parametros.put("estado", estado);

                        // Crear resultado
                        Map<String, Object> resultado = new HashMap<>();
                        long disponibles = vehiculos.stream().filter(v -> "disponible".equals(v.getEstadoActual()))
                                .count();
                        long enOperacion = vehiculos.stream().filter(v -> "en_operacion".equals(v.getEstadoActual()))
                                .count();
                        long enMantenimiento = vehiculos.stream()
                                .filter(v -> "en_mantenimiento".equals(v.getEstadoActual()))
                                .count();

                        resultado.put("disponibles", disponibles);
                        resultado.put("en_operacion", enOperacion);
                        resultado.put("en_mantenimiento", enMantenimiento);
                        resultado.put("total_vehiculos", vehiculos.size());

                        // Crear reporte
                        Reporte reporte = new Reporte();
                        reporte.setTipoReporte("vehiculos");
                        reporte.setGeneradoPor(usuarioId);
                        reporte.setParametros(Json.of(objectMapper.writeValueAsString(parametros)));
                        reporte.setResultado(Json.of(objectMapper.writeValueAsString(resultado)));
                        reporte.setCreatedAt(LocalDateTime.now());
                        reporte.setFechaGeneracion(LocalDateTime.now());

                        return repository.save(reporte)
                                .flatMap(savedReporte -> usuarioRepository.findById(usuarioId)
                                        .map(usuario -> toResponseWithUsuario(savedReporte, usuario))
                                        .defaultIfEmpty(toResponse(savedReporte)));

                    } catch (JsonProcessingException e) {
                        log.error("Error generando reporte de vehículos", e);
                        return Mono.error(e);
                    }
                });
    }

    public Mono<ReporteResponse> generarReporteMovimientos(String fechaInicio, String fechaFin, Integer usuarioId) {
        log.info("Generando reporte de movimientos desde {} hasta {}", fechaInicio, fechaFin);

        return movimientoRepository.findAllActive()
                .collectList()
                .flatMap(movimientos -> {
                    try {
                        // Crear parámetros
                        Map<String, Object> parametros = new HashMap<>();
                        parametros.put("fecha_inicio", fechaInicio);
                        parametros.put("fecha_fin", fechaFin);

                        // Crear resultado
                        Map<String, Object> resultado = new HashMap<>();
                        long enCurso = movimientos.stream().filter(m -> "en_curso".equals(m.getEstado())).count();
                        long completados = movimientos.stream().filter(m -> "completado".equals(m.getEstado())).count();
                        long programados = movimientos.stream().filter(m -> "programado".equals(m.getEstado())).count();

                        resultado.put("en_curso", enCurso);
                        resultado.put("completados", completados);
                        resultado.put("programados", programados);
                        resultado.put("total_movimientos", movimientos.size());

                        // Crear reporte
                        Reporte reporte = new Reporte();
                        reporte.setTipoReporte("movimientos");
                        reporte.setGeneradoPor(usuarioId);
                        reporte.setParametros(Json.of(objectMapper.writeValueAsString(parametros)));
                        reporte.setResultado(Json.of(objectMapper.writeValueAsString(resultado)));
                        reporte.setCreatedAt(LocalDateTime.now());
                        reporte.setFechaGeneracion(LocalDateTime.now());

                        return repository.save(reporte)
                                .flatMap(savedReporte -> usuarioRepository.findById(usuarioId)
                                        .map(usuario -> toResponseWithUsuario(savedReporte, usuario))
                                        .defaultIfEmpty(toResponse(savedReporte)));

                    } catch (JsonProcessingException e) {
                        log.error("Error generando reporte de movimientos", e);
                        return Mono.error(e);
                    }
                });
    }

    private ReporteResponse toResponse(Reporte reporte) {
        return toResponseWithUsuario(reporte, null);
    }

    private ReporteResponse toResponseWithUsuario(Reporte reporte, Usuario usuario) {
        ReporteResponse response = new ReporteResponse();
        response.setId(reporte.getId());
        response.setTipoReporte(reporte.getTipoReporte());
        response.setGeneradoPor(reporte.getGeneradoPor());
        response.setFechaGeneracion(reporte.getFechaGeneracion());
        response.setParametros(reporte.getParametros() != null ? reporte.getParametros().asString() : null);
        response.setResultado(reporte.getResultado() != null ? reporte.getResultado().asString() : null);
        response.setCreatedAt(reporte.getCreatedAt());

        // Agregar nombre del usuario si está disponible
        if (usuario != null) {
            response.setNombreUsuario(usuario.getNombre() + " " + usuario.getApellido());
        }

        return response;
    }
}