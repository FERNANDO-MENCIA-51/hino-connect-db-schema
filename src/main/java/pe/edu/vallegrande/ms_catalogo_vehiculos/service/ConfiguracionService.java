package pe.edu.vallegrande.ms_catalogo_vehiculos.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Configuracion;
import pe.edu.vallegrande.ms_catalogo_vehiculos.repository.ConfiguracionRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConfiguracionService {
    
    private final ConfiguracionRepository repository;
    
    public Flux<Configuracion> findAll() {
        log.debug("Buscando todas las configuraciones activas");
        return repository.findAllActive();
    }
    
    public Mono<Configuracion> findById(Integer id) {
        log.debug("Buscando configuración por ID: {}", id);
        return repository.findByIdActive(id);
    }
    
    public Mono<Configuracion> findByClave(String clave) {
        log.debug("Buscando configuración por clave: {}", clave);
        return repository.findByClave(clave);
    }
    
    public Mono<Configuracion> create(Configuracion configuracion) {
        log.info("Creando configuración con clave: {}", configuracion.getClave());
        configuracion.setCreatedAt(LocalDateTime.now());
        configuracion.setUpdatedAt(LocalDateTime.now());
        return repository.save(configuracion)
                .doOnSuccess(c -> log.info("Configuración creada exitosamente con ID: {}", c.getId()))
                .doOnError(e -> log.error("Error al crear configuración", e));
    }
    
    public Mono<Configuracion> update(Integer id, Configuracion configuracion) {
        log.debug("Actualizando configuración ID: {}", id);
        return repository.findByIdActive(id)
                .flatMap(existing -> {
                    configuracion.setId(id);
                    configuracion.setCreatedAt(existing.getCreatedAt());
                    configuracion.setUpdatedAt(LocalDateTime.now());
                    return repository.save(configuracion);
                })
                .doOnSuccess(c -> log.info("Configuración actualizada exitosamente: {}", id))
                .doOnError(e -> log.error("Error al actualizar configuración", e));
    }
    
    public Mono<Void> delete(Integer id) {
        log.info("Eliminando configuración ID: {}", id);
        return repository.findByIdActive(id)
                .flatMap(configuracion -> {
                    configuracion.setDeletedAt(LocalDateTime.now());
                    return repository.save(configuracion);
                })
                .doOnSuccess(c -> log.info("Configuración eliminada exitosamente: {}", id))
                .then();
    }
    
    public Mono<Configuracion> restore(Integer id) {
        log.info("Restaurando configuración ID: {}", id);
        return repository.findByIdDeleted(id)
                .flatMap(configuracion -> {
                    configuracion.setDeletedAt(null);
                    configuracion.setUpdatedAt(LocalDateTime.now());
                    return repository.save(configuracion);
                })
                .doOnSuccess(c -> log.info("Configuración restaurada exitosamente: {}", id))
                .doOnError(e -> log.error("Error al restaurar configuración", e));
    }
    
    public Flux<Configuracion> findByClaveContaining(String pattern) {
        log.debug("Buscando configuraciones que contengan: {}", pattern);
        return repository.findByClaveContaining("%" + pattern + "%");
    }
    
    public Flux<Configuracion> findAllDeleted() {
        log.debug("Buscando todas las configuraciones eliminadas");
        return repository.findAllDeleted();
    }
    
    // Método utilitario para obtener valor de configuración
    public Mono<String> getValorByClave(String clave) {
        log.debug("Obteniendo valor de configuración para clave: {}", clave);
        return repository.findByClave(clave)
                .map(Configuracion::getValor)
                .doOnNext(valor -> log.debug("Valor encontrado para {}: {}", clave, valor));
    }
    
    // Método utilitario para actualizar solo el valor
    public Mono<Configuracion> updateValor(String clave, String nuevoValor) {
        log.info("Actualizando valor de configuración {}: {}", clave, nuevoValor);
        return repository.findByClave(clave)
                .flatMap(configuracion -> {
                    configuracion.setValor(nuevoValor);
                    configuracion.setUpdatedAt(LocalDateTime.now());
                    return repository.save(configuracion);
                })
                .doOnSuccess(c -> log.info("Valor actualizado exitosamente para clave: {}", clave));
    }
}