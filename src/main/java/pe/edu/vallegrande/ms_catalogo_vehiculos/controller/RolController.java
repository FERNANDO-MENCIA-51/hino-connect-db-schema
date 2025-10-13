package pe.edu.vallegrande.ms_catalogo_vehiculos.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.vallegrande.ms_catalogo_vehiculos.dto.ApiResponse;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Rol;
import pe.edu.vallegrande.ms_catalogo_vehiculos.service.RolService;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roles")
@RequiredArgsConstructor
@Tag(name = "Roles", description = "Gestión de roles del sistema")
public class RolController {
    
    private final RolService service;
    
    @GetMapping
    @Operation(summary = "Listar todos los roles")
    public Mono<ResponseEntity<ApiResponse<List<Rol>>>> findAll() {
        return service.findAll()
                .collectList()
                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obtener rol por ID")
    public Mono<ResponseEntity<ApiResponse<Rol>>> findById(@PathVariable Integer id) {
        return service.findById(id)
                .map(rol -> ResponseEntity.ok(ApiResponse.success(rol)))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @Operation(summary = "Crear nuevo rol")
    public Mono<ResponseEntity<ApiResponse<Rol>>> create(@RequestBody Rol rol) {
        return service.create(rol)
                .map(created -> ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created)));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar rol")
    public Mono<ResponseEntity<ApiResponse<Rol>>> update(@PathVariable Integer id, @RequestBody Rol rol) {
        return service.update(id, rol)
                .map(updated -> ResponseEntity.ok(ApiResponse.success(updated)))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar rol (soft delete)")
    public Mono<ResponseEntity<ApiResponse<Void>>> delete(@PathVariable Integer id) {
        return service.delete(id)
                .then(Mono.just(ResponseEntity.ok(ApiResponse.success(null))));
    }

    @PutMapping("/{id}/restore")
    @Operation(summary = "Restaurar rol")
    public Mono<ResponseEntity<ApiResponse<Void>>> restore(@PathVariable Integer id) {
        return service.restore(id)
                .then(Mono.just(ResponseEntity.ok(ApiResponse.success(null))));
    }
}
