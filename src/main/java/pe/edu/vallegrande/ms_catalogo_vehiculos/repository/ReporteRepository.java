package pe.edu.vallegrande.ms_catalogo_vehiculos.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Reporte;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface ReporteRepository extends R2dbcRepository<Reporte, Integer> {
    
    @Query("SELECT * FROM reportes WHERE deleted_at IS NULL")
    Flux<Reporte> findAllActive();
    
    @Query("SELECT * FROM reportes WHERE id = :id AND deleted_at IS NULL")
    Mono<Reporte> findByIdActive(Integer id);
    
    @Query("SELECT * FROM reportes WHERE deleted_at IS NOT NULL")
    Flux<Reporte> findAllDeleted();
    
    @Query("SELECT * FROM reportes WHERE id = :id AND deleted_at IS NOT NULL")
    Mono<Reporte> findByIdDeleted(Integer id);
    
    @Query("SELECT * FROM reportes WHERE tipo_reporte = :tipoReporte AND deleted_at IS NULL")
    Flux<Reporte> findByTipoReporte(String tipoReporte);
    
    @Query("SELECT * FROM reportes WHERE generado_por = :usuarioId AND deleted_at IS NULL")
    Flux<Reporte> findByGeneradoPor(Integer usuarioId);
}