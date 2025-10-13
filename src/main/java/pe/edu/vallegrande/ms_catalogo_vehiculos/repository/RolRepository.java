package pe.edu.vallegrande.ms_catalogo_vehiculos.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Rol;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface RolRepository extends R2dbcRepository<Rol, Integer> {
    
    @Query("SELECT * FROM roles WHERE deleted_at IS NULL")
    Flux<Rol> findAllActive();
    
    @Query("SELECT * FROM roles WHERE id = :id AND deleted_at IS NULL")
    Mono<Rol> findByIdActive(Integer id);
    
    @Query("SELECT * FROM roles WHERE nombre = :nombre AND deleted_at IS NULL")
    Mono<Rol> findByNombre(String nombre);

    @Query("SELECT * FROM roles WHERE id = :id AND deleted_at IS NOT NULL")
    Mono<Rol> findByIdInactive(Integer id);
}
