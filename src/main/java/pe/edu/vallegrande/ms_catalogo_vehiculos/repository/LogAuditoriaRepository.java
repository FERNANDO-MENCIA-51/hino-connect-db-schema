package pe.edu.vallegrande.ms_catalogo_vehiculos.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.LogAuditoria;
import reactor.core.publisher.Flux;
import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public interface LogAuditoriaRepository extends R2dbcRepository<LogAuditoria, UUID> {
    
    @Query("SELECT * FROM logs_auditoria ORDER BY fecha DESC")
    Flux<LogAuditoria> findAllOrderByFechaDesc();
    
    @Query("SELECT * FROM logs_auditoria WHERE tabla = :tabla ORDER BY fecha DESC")
    Flux<LogAuditoria> findByTablaOrderByFechaDesc(String tabla);
    
    @Query("SELECT * FROM logs_auditoria WHERE operacion = :operacion ORDER BY fecha DESC")
    Flux<LogAuditoria> findByOperacionOrderByFechaDesc(String operacion);
    
    @Query("SELECT * FROM logs_auditoria WHERE usuario_id = :usuarioId ORDER BY fecha DESC")
    Flux<LogAuditoria> findByUsuarioIdOrderByFechaDesc(Integer usuarioId);
    
    @Query("SELECT * FROM logs_auditoria WHERE registro_id = :registroId AND tabla = :tabla ORDER BY fecha DESC")
    Flux<LogAuditoria> findByRegistroIdAndTablaOrderByFechaDesc(Integer registroId, String tabla);
    
    @Query("SELECT * FROM logs_auditoria WHERE fecha BETWEEN :fechaInicio AND :fechaFin ORDER BY fecha DESC")
    Flux<LogAuditoria> findByFechaBetweenOrderByFechaDesc(LocalDateTime fechaInicio, LocalDateTime fechaFin);
    
    @Query("SELECT * FROM logs_auditoria ORDER BY fecha DESC LIMIT :limit")
    Flux<LogAuditoria> findTopByOrderByFechaDesc(int limit);
}