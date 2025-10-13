package pe.edu.vallegrande.ms_catalogo_vehiculos.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.LogAuditoria;
import pe.edu.vallegrande.ms_catalogo_vehiculos.repository.LogAuditoriaRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class LogAuditoriaService {

    private final LogAuditoriaRepository repository;

    public Flux<LogAuditoria> findAll() {
        log.debug("Buscando todos los logs de auditoría");
        return repository.findAllOrderByFechaDesc();
    }

    public Mono<LogAuditoria> findById(UUID id) {
        log.debug("Buscando log de auditoría por ID: {}", id);
        return repository.findById(id);
    }

    public Flux<LogAuditoria> findByTabla(String tabla) {
        log.debug("Buscando logs de auditoría por tabla: {}", tabla);
        return repository.findByTablaOrderByFechaDesc(tabla);
    }

    public Flux<LogAuditoria> findByOperacion(String operacion) {
        log.debug("Buscando logs de auditoría por operación: {}", operacion);
        return repository.findByOperacionOrderByFechaDesc(operacion);
    }

    public Flux<LogAuditoria> findByUsuarioId(Integer usuarioId) {
        log.debug("Buscando logs de auditoría por usuario: {}", usuarioId);
        return repository.findByUsuarioIdOrderByFechaDesc(usuarioId);
    }

    public Flux<LogAuditoria> findByRegistroIdAndTabla(Integer registroId, String tabla) {
        log.debug("Buscando logs de auditoría por registro {} en tabla {}", registroId, tabla);
        return repository.findByRegistroIdAndTablaOrderByFechaDesc(registroId, tabla);
    }

    public Flux<LogAuditoria> findByFechaBetween(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        log.debug("Buscando logs de auditoría entre {} y {}", fechaInicio, fechaFin);
        return repository.findByFechaBetweenOrderByFechaDesc(fechaInicio, fechaFin);
    }

    public Flux<LogAuditoria> findRecientes(int limit) {
        log.debug("Buscando los {} logs más recientes", limit);
        return repository.findTopByOrderByFechaDesc(limit);
    }

    // Método para crear log manualmente (opcional)
    public Mono<LogAuditoria> createLog(String tabla, String operacion, Integer registroId,
            Integer usuarioId, String descripcion) {
        log.debug("Creando log de auditoría: {} {} en tabla {}", operacion, registroId, tabla);

        LogAuditoria logAuditoria = new LogAuditoria();
        logAuditoria.setId(UUID.randomUUID());
        logAuditoria.setTabla(tabla);
        logAuditoria.setOperacion(operacion);
        logAuditoria.setRegistroId(registroId);
        logAuditoria.setUsuarioId(usuarioId);
        logAuditoria.setDescripcion(descripcion);
        logAuditoria.setFecha(LocalDateTime.now());

        return repository.save(logAuditoria)
                .doOnSuccess(savedLog -> log.info("Log de auditoría creado: {}", savedLog.getId()));
    }

    // Método utilitario para obtener estadísticas
    public Mono<Long> countByTabla(String tabla) {
        log.debug("Contando logs por tabla: {}", tabla);
        return repository.findByTablaOrderByFechaDesc(tabla).count();
    }

    public Mono<Long> countByOperacion(String operacion) {
        log.debug("Contando logs por operación: {}", operacion);
        return repository.findByOperacionOrderByFechaDesc(operacion).count();
    }
}