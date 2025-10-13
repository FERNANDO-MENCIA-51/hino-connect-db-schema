package pe.edu.vallegrande.ms_catalogo_vehiculos.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Reporte;
import pe.edu.vallegrande.ms_catalogo_vehiculos.repository.ReporteRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReporteService {
    
    private final ReporteRepository repository;
    
    public Flux<Reporte> findAll() {
        log.debug("Buscando todos los reportes activos");
        return repository.findAllActive();
    }
    
    public Mono<Reporte> findById(Integer id) {
        log.debug("Buscando reporte por ID: {}", id);
        return repository.findByIdActive(id);
    }
    
    public Mono<Reporte> create(Reporte reporte) {
        log.info("Creando reporte de tipo: {}", reporte.getTipoReporte());
        reporte.setCreatedAt(LocalDateTime.now());
        reporte.setFechaGeneracion(LocalDateTime.now());
        return repository.save(reporte)
                .doOnSuccess(r -> log.info("Reporte creado exitosamente con ID: {}", r.getId()))
                .doOnError(e -> log.error("Error al crear reporte", e));
    }
    
    public Mono<Reporte> update(Integer id, Reporte reporte) {
        log.debug("Actualizando reporte ID: {}", id);
        return repository.findByIdActive(id)
                .flatMap(existing -> {
                    reporte.setId(id);
                    reporte.setCreatedAt(existing.getCreatedAt());
                    return repository.save(reporte);
                })
                .doOnSuccess(r -> log.info("Reporte actualizado exitosamente: {}", id))
                .doOnError(e -> log.error("Error al actualizar reporte", e));
    }
    
    public Mono<Void> delete(Integer id) {
        log.info("Eliminando reporte ID: {}", id);
        return repository.findByIdActive(id)
                .flatMap(reporte -> {
                    reporte.setDeletedAt(LocalDateTime.now());
                    return repository.save(reporte);
                })
                .doOnSuccess(r -> log.info("Reporte eliminado exitosamente: {}", id))
                .then();
    }
    
    public Mono<Reporte> restore(Integer id) {
        log.info("Restaurando reporte ID: {}", id);
        return repository.findByIdDeleted(id)
                .flatMap(reporte -> {
                    reporte.setDeletedAt(null);
                    return repository.save(reporte);
                })
                .doOnSuccess(r -> log.info("Reporte restaurado exitosamente: {}", id))
                .doOnError(e -> log.error("Error al restaurar reporte", e));
    }
    
    public Flux<Reporte> findByTipoReporte(String tipoReporte) {
        log.debug("Buscando reportes por tipo: {}", tipoReporte);
        return repository.findByTipoReporte(tipoReporte);
    }
    
    public Flux<Reporte> findByGeneradoPor(Integer usuarioId) {
        log.debug("Buscando reportes generados por usuario: {}", usuarioId);
        return repository.findByGeneradoPor(usuarioId);
    }
    
    public Flux<Reporte> findAllDeleted() {
        log.debug("Buscando todos los reportes eliminados");
        return repository.findAllDeleted();
    }
}