package pe.edu.vallegrande.ms_catalogo_vehiculos.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Movimiento;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface MovimientoRepository extends R2dbcRepository<Movimiento, Integer> {
    
    @Query("SELECT * FROM movimientos WHERE deleted_at IS NULL")
    Flux<Movimiento> findAllActive();
    
    @Query("SELECT * FROM movimientos WHERE id = :id AND deleted_at IS NULL")
    Mono<Movimiento> findByIdActive(Integer id);
    
    @Query("SELECT * FROM movimientos WHERE vehiculo_id = :vehiculoId AND deleted_at IS NULL")
    Flux<Movimiento> findByVehiculoId(Integer vehiculoId);
    
    @Query("SELECT * FROM movimientos WHERE conductor_id = :conductorId AND deleted_at IS NULL")
    Flux<Movimiento> findByConductorId(Integer conductorId);
    
    @Query("SELECT * FROM movimientos WHERE estado = :estado AND deleted_at IS NULL")
    Flux<Movimiento> findByEstado(String estado);
}
