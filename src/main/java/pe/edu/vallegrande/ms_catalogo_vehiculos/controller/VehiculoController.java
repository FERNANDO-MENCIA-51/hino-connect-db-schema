package pe.edu.vallegrande.ms_catalogo_vehiculos.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.vallegrande.ms_catalogo_vehiculos.dto.ApiResponse;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Vehiculo;
import pe.edu.vallegrande.ms_catalogo_vehiculos.service.VehiculoService;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vehiculos")
@RequiredArgsConstructor
@Tag(name = "Vehículos", description = "Gestión de vehículos de la flota")
public class VehiculoController {
    
    private final VehiculoService service;
    
    @GetMapping
    @Operation(summary = "Listar todos los vehículos")
    public Mono<ResponseEntity<ApiResponse<List<Vehiculo>>>> findAll() {
        return service.findAll()
                .collectList()
                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
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
    public Mono<ResponseEntity<ApiResponse<Vehiculo>>> create(@RequestBody Vehiculo vehiculo) {
        return service.create(vehiculo)
                .map(created -> ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created)));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar vehículo")
    public Mono<ResponseEntity<ApiResponse<Vehiculo>>> update(@PathVariable Integer id, @RequestBody Vehiculo vehiculo) {
        return service.update(id, vehiculo)
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
}
