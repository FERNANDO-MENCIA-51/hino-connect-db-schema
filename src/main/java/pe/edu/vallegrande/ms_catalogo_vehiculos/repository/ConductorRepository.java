package pe.edu.vallegrande.ms_catalogo_vehiculos.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Conductor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface ConductorRepository extends R2dbcRepository<Conductor, Integer> {
    
    @Query("SELECT * FROM conductores WHERE deleted_at IS NULL")
    Flux<Conductor> findAllActive();
    
    @Query("SELECT * FROM conductores WHERE id = :id AND deleted_at IS NULL")
    Mono<Conductor> findByIdActive(Integer id);
    
    @Query("SELECT * FROM conductores WHERE dni = :dni AND deleted_at IS NULL")
    Mono<Conductor> findByDni(String dni);
    
    @Query("SELECT * FROM conductores WHERE estado = :estado AND deleted_at IS NULL")
    Flux<Conductor> findByEstado(String estado);
}
