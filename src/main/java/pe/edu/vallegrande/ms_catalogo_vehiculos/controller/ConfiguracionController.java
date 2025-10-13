package pe.edu.vallegrande.ms_catalogo_vehiculos.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.vallegrande.ms_catalogo_vehiculos.dto.ApiResponse;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Configuracion;
import pe.edu.vallegrande.ms_catalogo_vehiculos.service.ConfiguracionService;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/configuraciones")
@RequiredArgsConstructor
@Tag(name = "Configuraciones", description = "Gestión de configuraciones del sistema")
public class ConfiguracionController {
    
    private final ConfiguracionService service;
    
    @GetMapping
    @Operation(summary = "Listar todas las configuraciones")
    public Mono<ResponseEntity<ApiResponse<List<Configuracion>>>> findAll() {
        return service.findAll()
                .collectList()
                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obtener configuración por ID")
    public Mono<ResponseEntity<ApiResponse<Configuracion>>> findById(@PathVariable Integer id) {
        return service.findById(id)
                .map(config -> ResponseEntity.ok(ApiResponse.success(config)))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/clave/{clave}")
    @Operation(summary = "Obtener configuración por clave")
    public Mono<ResponseEntity<ApiResponse<Configuracion>>> findByClave(@PathVariable String clave) {
        return service.findByClave(clave)
                .map(config -> ResponseEntity.ok(ApiResponse.success(config)))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/valor/{clave}")
    @Operation(summary = "Obtener solo el valor de una configuración")
    public Mono<ResponseEntity<ApiResponse<String>>> getValorByClave(@PathVariable String clave) {
        return service.getValorByClave(clave)
                .map(valor -> ResponseEntity.ok(ApiResponse.success(valor)))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @Operation(summary = "Crear nueva configuración")
    public Mono<ResponseEntity<ApiResponse<Configuracion>>> create(@RequestBody Configuracion configuracion) {
        return service.create(configuracion)
                .map(created -> ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created)));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar configuración")
    public Mono<ResponseEntity<ApiResponse<Configuracion>>> update(@PathVariable Integer id, @RequestBody Configuracion configuracion) {
        return service.update(id, configuracion)
                .map(updated -> ResponseEntity.ok(ApiResponse.success(updated)))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/valor/{clave}")
    @Operation(summary = "Actualizar solo el valor de una configuración")
    public Mono<ResponseEntity<ApiResponse<Configuracion>>> updateValor(
            @PathVariable String clave, 
            @RequestBody Map<String, String> request) {
        String nuevoValor = request.get("valor");
        return service.updateValor(clave, nuevoValor)
                .map(updated -> ResponseEntity.ok(ApiResponse.success(updated)))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar configuración (soft delete)")
    public Mono<ResponseEntity<ApiResponse<Void>>> delete(@PathVariable Integer id) {
        return service.delete(id)
                .then(Mono.just(ResponseEntity.ok(ApiResponse.success(null))));
    }
    
    @PutMapping("/{id}/restore")
    @Operation(summary = "Restaurar configuración eliminada")
    public Mono<ResponseEntity<ApiResponse<Configuracion>>> restore(@PathVariable Integer id) {
        return service.restore(id)
                .map(restored -> ResponseEntity.ok(ApiResponse.success(restored)))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/buscar/{pattern}")
    @Operation(summary = "Buscar configuraciones por patrón en clave")
    public Mono<ResponseEntity<ApiResponse<List<Configuracion>>>> findByClaveContaining(@PathVariable String pattern) {
        return service.findByClaveContaining(pattern)
                .collectList()
                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
    }
    
    @GetMapping("/deleted")
    @Operation(summary = "Listar configuraciones eliminadas")
    public Mono<ResponseEntity<ApiResponse<List<Configuracion>>>> findAllDeleted() {
        return service.findAllDeleted()
                .collectList()
                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
    }
}