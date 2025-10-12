package pe.edu.vallegrande.ms_catalogo_vehiculos.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.vallegrande.ms_catalogo_vehiculos.dto.ApiResponse;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Conductor;
import pe.edu.vallegrande.ms_catalogo_vehiculos.service.ConductorService;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api/v1/conductores")
@RequiredArgsConstructor
@Tag(name = "Conductores", description = "Gestión de conductores")
public class ConductorController {
    
    private final ConductorService service;
    
    @GetMapping
    @Operation(summary = "Listar todos los conductores")
    public Mono<ResponseEntity<ApiResponse<List<Conductor>>>> findAll() {
        return service.findAll()
                .collectList()
                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obtener conductor por ID")
    public Mono<ResponseEntity<ApiResponse<Conductor>>> findById(@PathVariable Integer id) {
        return service.findById(id)
                .map(conductor -> ResponseEntity.ok(ApiResponse.success(conductor)))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @Operation(summary = "Crear nuevo conductor")
    public Mono<ResponseEntity<ApiResponse<Conductor>>> create(@RequestBody Conductor conductor) {
        return service.create(conductor)
                .map(created -> ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created)));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar conductor")
    public Mono<ResponseEntity<ApiResponse<Conductor>>> update(@PathVariable Integer id, @RequestBody Conductor conductor) {
        return service.update(id, conductor)
                .map(updated -> ResponseEntity.ok(ApiResponse.success(updated)))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar conductor (soft delete)")
    public Mono<ResponseEntity<ApiResponse<Void>>> delete(@PathVariable Integer id) {
        return service.delete(id)
                .then(Mono.just(ResponseEntity.ok(ApiResponse.success(null))));
    }
    
    @GetMapping("/estado/{estado}")
    @Operation(summary = "Buscar conductores por estado")
    public Mono<ResponseEntity<ApiResponse<List<Conductor>>>> findByEstado(@PathVariable String estado) {
        return service.findByEstado(estado)
                .collectList()
                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
    }

    @PutMapping("/restaurar/{id}")
    @Operation(summary = "Restaurar conductor")
    public Mono<ResponseEntity<ApiResponse<Conductor>>> restaurar(@PathVariable Integer id) {
        return service.findById(id)
                .flatMap(conductor -> {
                    conductor.setActivo(true);
                    conductor.setEstado("Activo");
                    return service.update(id, conductor);
                })
                .map(updated -> ResponseEntity.ok(ApiResponse.success(updated)))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}