package pe.edu.vallegrande.ms_catalogo_vehiculos.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Configuracion;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface ConfiguracionRepository extends R2dbcRepository<Configuracion, Integer> {
    
    @Query("SELECT * FROM configuracion WHERE deleted_at IS NULL")
    Flux<Configuracion> findAllActive();
    
    @Query("SELECT * FROM configuracion WHERE id = :id AND deleted_at IS NULL")
    Mono<Configuracion> findByIdActive(Integer id);
    
    @Query("SELECT * FROM configuracion WHERE deleted_at IS NOT NULL")
    Flux<Configuracion> findAllDeleted();
    
    @Query("SELECT * FROM configuracion WHERE id = :id AND deleted_at IS NOT NULL")
    Mono<Configuracion> findByIdDeleted(Integer id);
    
    @Query("SELECT * FROM configuracion WHERE clave = :clave AND deleted_at IS NULL")
    Mono<Configuracion> findByClave(String clave);
    
    @Query("SELECT * FROM configuracion WHERE clave LIKE :pattern AND deleted_at IS NULL")
    Flux<Configuracion> findByClaveContaining(String pattern);
}