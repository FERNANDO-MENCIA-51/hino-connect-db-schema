package pe.edu.vallegrande.ms_catalogo_vehiculos.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pe.edu.vallegrande.ms_catalogo_vehiculos.dto.PageResponse;
import pe.edu.vallegrande.ms_catalogo_vehiculos.dto.VehiculoRequest;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Vehiculo;
import pe.edu.vallegrande.ms_catalogo_vehiculos.repository.VehiculoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class VehiculoService {

    private final VehiculoRepository repository;

    public Flux<Vehiculo> findAll() {
        log.debug("Buscando todos los vehículos activos");
        return repository.findAllActive();
    }

    public Mono<PageResponse<Vehiculo>> findAllPaginated(int page, int size) {
        log.debug("Buscando vehículos paginados - página: {}, tamaño: {}", page, size);
        return repository.findAllActive()
                .collectList()
                .flatMap(allVehiculos -> {
                    long total = allVehiculos.size();
                    int start = page * size;
                    int end = Math.min(start + size, allVehiculos.size());

                    if (start >= allVehiculos.size()) {
                        return Mono.just(PageResponse.of(java.util.Collections.emptyList(), page, size, total));
                    }

                    List<Vehiculo> pageContent = allVehiculos.subList(start, end);
                    return Mono.just(PageResponse.of(pageContent, page, size, total));
                });
    }

    public Mono<Vehiculo> findById(Integer id) {
        return repository.findByIdActive(id);
    }

    public Mono<Vehiculo> create(VehiculoRequest vehiculoRequest) {
        log.info("Creando vehículo con placa: {}", vehiculoRequest.getPlaca());
        Vehiculo vehiculo = convertToEntity(vehiculoRequest);
        vehiculo.setCreatedAt(LocalDateTime.now());
        vehiculo.setUpdatedAt(LocalDateTime.now());
        return repository.save(vehiculo)
                .doOnSuccess(v -> log.info("Vehículo creado exitosamente con ID: {}", v.getId()))
                .doOnError(e -> log.error("Error al crear vehículo", e));
    }

    public Mono<Vehiculo> update(Integer id, VehiculoRequest vehiculoRequest) {
        return repository.findByIdActive(id)
                .flatMap(existing -> {
                    Vehiculo vehiculo = convertToEntity(vehiculoRequest);
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

    public Mono<Vehiculo> restore(Integer id) {
        log.info("Restaurando vehículo ID: {}", id);
        return repository.findById(id)
                .filter(vehiculo -> vehiculo.getDeletedAt() != null)
                .flatMap(vehiculo -> {
                    vehiculo.setDeletedAt(null);
                    vehiculo.setUpdatedAt(LocalDateTime.now());
                    return repository.save(vehiculo);
                })
                .doOnSuccess(v -> log.info("Vehículo restaurado exitosamente: {}", id))
                .doOnError(e -> log.error("Error al restaurar vehículo", e));
    }
    
    public Flux<Vehiculo> findAllDeleted() {
        log.debug("Buscando todos los vehículos eliminados");
        return repository.findAll()
                .filter(vehiculo -> vehiculo.getDeletedAt() != null);
    }
    
    /**
     * Convierte VehiculoRequest a Vehiculo
     */
    private Vehiculo convertToEntity(VehiculoRequest request) {
        Vehiculo vehiculo = new Vehiculo();
        vehiculo.setCodigo(request.getCodigo());
        vehiculo.setPlaca(request.getPlaca());
        vehiculo.setMarca(request.getMarca());
        vehiculo.setModelo(request.getModelo());
        vehiculo.setTipo(request.getTipo());
        vehiculo.setAnioFabricacion(request.getAnioFabricacion());
        vehiculo.setNumeroChasis(request.getNumeroChasis());
        vehiculo.setCapacidadCarga(request.getCapacidadCarga());
        vehiculo.setCombustible(request.getCombustible());
        vehiculo.setEstadoActual(request.getEstadoActual());
        vehiculo.setImagenUrl(request.getImagenUrl());
        vehiculo.setActivo(request.getActivo());
        return vehiculo;
    }
}