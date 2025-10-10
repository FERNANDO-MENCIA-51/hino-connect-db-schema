package pe.edu.vallegrande.ms_catalogo_vehiculos.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.vallegrande.ms_catalogo_vehiculos.dto.ApiResponse;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Movimiento;
import pe.edu.vallegrande.ms_catalogo_vehiculos.service.MovimientoService;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api/v1/movimientos")
@RequiredArgsConstructor
@Tag(name = "Movimientos", description = "Gestión de movimientos y viajes")
public class MovimientoController {
    
    private final MovimientoService service;
    
    @GetMapping
    @Operation(summary = "Listar todos los movimientos")
    public Mono<ResponseEntity<ApiResponse<List<Movimiento>>>> findAll() {
        return service.findAll()
                .collectList()
                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obtener movimiento por ID")
    public Mono<ResponseEntity<ApiResponse<Movimiento>>> findById(@PathVariable Integer id) {
        return service.findById(id)
                .map(movimiento -> ResponseEntity.ok(ApiResponse.success(movimiento)))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @Operation(summary = "Crear nuevo movimiento")
    public Mono<ResponseEntity<ApiResponse<Movimiento>>> create(@RequestBody Movimiento movimiento) {
        return service.create(movimiento)
                .map(created -> ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created)));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar movimiento")
    public Mono<ResponseEntity<ApiResponse<Movimiento>>> update(@PathVariable Integer id, @RequestBody Movimiento movimiento) {
        return service.update(id, movimiento)
                .map(updated -> ResponseEntity.ok(ApiResponse.success(updated)))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar movimiento (soft delete)")
    public Mono<ResponseEntity<ApiResponse<Void>>> delete(@PathVariable Integer id) {
        return service.delete(id)
                .then(Mono.just(ResponseEntity.ok(ApiResponse.success(null))));
    }
    
    @GetMapping("/estado/{estado}")
    @Operation(summary = "Buscar movimientos por estado")
    public Mono<ResponseEntity<ApiResponse<List<Movimiento>>>> findByEstado(@PathVariable String estado) {
        return service.findByEstado(estado)
                .collectList()
                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
    }
    
    @GetMapping("/vehiculo/{vehiculoId}")
    @Operation(summary = "Buscar movimientos por vehículo")
    public Mono<ResponseEntity<ApiResponse<List<Movimiento>>>> findByVehiculoId(@PathVariable Integer vehiculoId) {
        return service.findByVehiculoId(vehiculoId)
                .collectList()
                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
    }
    
    @GetMapping("/conductor/{conductorId}")
    @Operation(summary = "Buscar movimientos por conductor")
    public Mono<ResponseEntity<ApiResponse<List<Movimiento>>>> findByConductorId(@PathVariable Integer conductorId) {
        return service.findByConductorId(conductorId)
                .collectList()
                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
    }
}
