package pe.edu.vallegrande.ms_catalogo_vehiculos.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Movimiento;
import pe.edu.vallegrande.ms_catalogo_vehiculos.repository.MovimientoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MovimientoService {
    
    private final MovimientoRepository repository;
    
    public Flux<Movimiento> findAll() {
        return repository.findAllActive();
    }
    
    public Mono<Movimiento> findById(Integer id) {
        return repository.findByIdActive(id);
    }
    
    public Mono<Movimiento> create(Movimiento movimiento) {
        movimiento.setCreatedAt(LocalDateTime.now());
        movimiento.setUpdatedAt(LocalDateTime.now());
        return repository.save(movimiento);
    }
    
    public Mono<Movimiento> update(Integer id, Movimiento movimiento) {
        return repository.findByIdActive(id)
                .flatMap(existing -> {
                    movimiento.setId(id);
                    movimiento.setCreatedAt(existing.getCreatedAt());
                    movimiento.setUpdatedAt(LocalDateTime.now());
                    return repository.save(movimiento);
                });
    }
    
    public Mono<Void> delete(Integer id) {
        return repository.findByIdActive(id)
                .flatMap(movimiento -> {
                    movimiento.setDeletedAt(LocalDateTime.now());
                    return repository.save(movimiento);
                })
                .then();
    }
    
    public Flux<Movimiento> findByEstado(String estado) {
        return repository.findByEstado(estado);
    }
    
    public Flux<Movimiento> findByVehiculoId(Integer vehiculoId) {
        return repository.findByVehiculoId(vehiculoId);
    }
    
    public Flux<Movimiento> findByConductorId(Integer conductorId) {
        return repository.findByConductorId(conductorId);
    }
}
