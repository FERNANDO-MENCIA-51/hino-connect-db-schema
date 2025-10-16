package pe.edu.vallegrande.ms_catalogo_vehiculos.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.vallegrande.ms_catalogo_vehiculos.dto.ApiResponse;
import pe.edu.vallegrande.ms_catalogo_vehiculos.dto.VehiculoRequest;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Vehiculo;
import pe.edu.vallegrande.ms_catalogo_vehiculos.service.VehiculoService;
import jakarta.validation.Valid;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vehiculos")
@RequiredArgsConstructor
@Tag(name = "Vehículos", description = "Gestión de vehículos de la flota")
public class VehiculoController {

    private final VehiculoService service;

    @GetMapping
    @Operation(summary = "Listar todos los vehículos (sin paginación)")
    public Mono<ResponseEntity<ApiResponse<List<Vehiculo>>>> findAll() {
        return service.findAll()
                .collectList()
                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
    }

    @GetMapping("/paginated")
    @Operation(summary = "Listar vehículos con paginación")
    public Mono<ResponseEntity<ApiResponse<pe.edu.vallegrande.ms_catalogo_vehiculos.dto.PageResponse<Vehiculo>>>> findAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return service.findAllPaginated(page, size)
                .map(pageResponse -> ResponseEntity.ok(ApiResponse.success(pageResponse)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener vehículo por ID")
    public Mono<ResponseEntity<ApiResponse<Vehiculo>>> findById(@PathVariable Integer id) {
        return service.findById(id)
                .map(vehiculo -> ResponseEntity.ok(ApiResponse.success(vehiculo)))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Crear nuevo vehículo")
    public Mono<ResponseEntity<ApiResponse<Vehiculo>>> create(@Valid @RequestBody VehiculoRequest vehiculoRequest) {
        return service.create(vehiculoRequest)
                .map(created -> ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar vehículo")
    public Mono<ResponseEntity<ApiResponse<Vehiculo>>> update(@PathVariable Integer id,
            @Valid @RequestBody VehiculoRequest vehiculoRequest) {
        return service.update(id, vehiculoRequest)
                .map(updated -> ResponseEntity.ok(ApiResponse.success(updated)))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar vehículo (soft delete)")
    public Mono<ResponseEntity<ApiResponse<Void>>> delete(@PathVariable Integer id) {
        return service.delete(id)
                .then(Mono.just(ResponseEntity.ok(ApiResponse.success(null))));
    }

    @GetMapping("/estado/{estado}")
    @Operation(summary = "Buscar vehículos por estado")
    public Mono<ResponseEntity<ApiResponse<List<Vehiculo>>>> findByEstado(@PathVariable String estado) {
        return service.findByEstado(estado)
                .collectList()
                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
    }

    @PutMapping("/{id}/restore")
    @Operation(summary = "Restaurar vehículo eliminado")
    public Mono<ResponseEntity<ApiResponse<Vehiculo>>> restore(@PathVariable Integer id) {
        return service.restore(id)
                .map(restored -> ResponseEntity.ok(ApiResponse.success(restored)))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping("/deleted")
    @Operation(summary = "Listar vehículos eliminados")
    public Mono<ResponseEntity<ApiResponse<List<Vehiculo>>>> findAllDeleted() {
        return service.findAllDeleted()
                .collectList()
                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
    }
}
