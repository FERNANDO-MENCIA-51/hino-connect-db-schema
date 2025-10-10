package pe.edu.vallegrande.ms_catalogo_vehiculos.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Conductor;
import pe.edu.vallegrande.ms_catalogo_vehiculos.repository.ConductorRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ConductorService {
    
    private final ConductorRepository repository;
    
    public Flux<Conductor> findAll() {
        return repository.findAllActive();
    }
    
    public Mono<Conductor> findById(Integer id) {
        return repository.findByIdActive(id);
    }
    
    public Mono<Conductor> create(Conductor conductor) {
        conductor.setCreatedAt(LocalDateTime.now());
        conductor.setUpdatedAt(LocalDateTime.now());
        return repository.save(conductor);
    }
    
    public Mono<Conductor> update(Integer id, Conductor conductor) {
        return repository.findByIdActive(id)
                .flatMap(existing -> {
                    conductor.setId(id);
                    conductor.setCreatedAt(existing.getCreatedAt());
                    conductor.setUpdatedAt(LocalDateTime.now());
                    return repository.save(conductor);
                });
    }
    
    public Mono<Void> delete(Integer id) {
        return repository.findByIdActive(id)
                .flatMap(conductor -> {
                    conductor.setDeletedAt(LocalDateTime.now());
                    return repository.save(conductor);
                })
                .then();
    }
    
    public Flux<Conductor> findByEstado(String estado) {
        return repository.findByEstado(estado);
    }
}
