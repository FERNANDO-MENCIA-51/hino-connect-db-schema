package pe.edu.vallegrande.ms_catalogo_vehiculos.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Vehiculo;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface VehiculoRepository extends R2dbcRepository<Vehiculo, Integer> {
    
    @Query("SELECT * FROM vehiculos WHERE deleted_at IS NULL")
    Flux<Vehiculo> findAllActive();
    
    @Query("SELECT * FROM vehiculos WHERE id = :id AND deleted_at IS NULL")
    Mono<Vehiculo> findByIdActive(Integer id);
    
    @Query("SELECT * FROM vehiculos WHERE placa = :placa AND deleted_at IS NULL")
    Mono<Vehiculo> findByPlaca(String placa);
    
    @Query("SELECT * FROM vehiculos WHERE estado_actual = :estado AND deleted_at IS NULL")
    Flux<Vehiculo> findByEstado(String estado);
    
    @Query("SELECT * FROM vehiculos WHERE deleted_at IS NOT NULL")
    Flux<Vehiculo> findAllInactive();
    
    @Query("SELECT * FROM vehiculos WHERE id = :id AND deleted_at IS NOT NULL")
    Mono<Vehiculo> findByIdInactive(Integer id);
}
