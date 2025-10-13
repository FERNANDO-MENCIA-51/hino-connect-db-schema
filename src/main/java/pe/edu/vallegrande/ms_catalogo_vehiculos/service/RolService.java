package pe.edu.vallegrande.ms_catalogo_vehiculos.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Rol;
import pe.edu.vallegrande.ms_catalogo_vehiculos.repository.RolRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RolService {
    
    private final RolRepository repository;
    
    public Flux<Rol> findAll() {
        return repository.findAllActive();
    }
    
    public Mono<Rol> findById(Integer id) {
        return repository.findByIdActive(id);
    }
    
    public Mono<Rol> create(Rol rol) {
        rol.setCreatedAt(LocalDateTime.now());
        rol.setUpdatedAt(LocalDateTime.now());
        return repository.save(rol);
    }
    
    public Mono<Rol> update(Integer id, Rol rol) {
        return repository.findByIdActive(id)
                .flatMap(existing -> {
                    rol.setId(id);
                    rol.setCreatedAt(existing.getCreatedAt());
                    rol.setUpdatedAt(LocalDateTime.now());
                    return repository.save(rol);
                });
    }
    
    public Mono<Void> delete(Integer id) {
        return repository.findByIdActive(id)
                .flatMap(rol -> {
                    rol.setDeletedAt(LocalDateTime.now());
                    return repository.save(rol);
                })
                .then();
    }

    public Mono<Void> restore(Integer id) {
        return repository.findByIdInactive(id)
                .flatMap(rol -> {
                    rol.setDeletedAt(null);
                    return repository.save(rol);
                })
                .then();
    }
}
