package pe.edu.vallegrande.ms_catalogo_vehiculos.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Vehiculo;
import pe.edu.vallegrande.ms_catalogo_vehiculos.repository.VehiculoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class VehiculoService {
    
    private final VehiculoRepository repository;
    
    public Flux<Vehiculo> findAll() {
        return repository.findAllActive();
    }
    
    public Mono<Vehiculo> findById(Integer id) {
        return repository.findByIdActive(id);
    }
    
    public Mono<Vehiculo> create(Vehiculo vehiculo) {
        vehiculo.setCreatedAt(LocalDateTime.now());
        vehiculo.setUpdatedAt(LocalDateTime.now());
        return repository.save(vehiculo);
    }
    
    public Mono<Vehiculo> update(Integer id, Vehiculo vehiculo) {
        return repository.findByIdActive(id)
                .flatMap(existing -> {
                    vehiculo.setId(id);
                    vehiculo.setCreatedAt(existing.getCreatedAt());
                    vehiculo.setUpdatedAt(LocalDateTime.now());
                    return repository.save(vehiculo);
                });
    }
    
    public Mono<Void> delete(Integer id) {
        return repository.findByIdActive(id)
                .flatMap(vehiculo -> {
                    vehiculo.setDeletedAt(LocalDateTime.now());
                    return repository.save(vehiculo);
                })
                .then();
    }
    
    public Flux<Vehiculo> findByEstado(String estado) {
        return repository.findByEstado(estado);
    }
    
    public Flux<Vehiculo> findAllInactive() {
        return repository.findAllInactive();
    }
    
    public Mono<Vehiculo> findByIdInactive(Integer id) {
        return repository.findByIdInactive(id);
    }
    
    public Mono<Vehiculo> restore(Integer id) {
        return repository.findByIdInactive(id)
                .flatMap(vehiculo -> {
                    vehiculo.setDeletedAt(null);
                    vehiculo.setUpdatedAt(LocalDateTime.now());
                    return repository.save(vehiculo);
                });
    }
}
