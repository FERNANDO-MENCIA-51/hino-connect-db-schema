package pe.edu.vallegrande.ms_catalogo_vehiculos.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.vallegrande.ms_catalogo_vehiculos.dto.ApiResponse;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Reporte;
import pe.edu.vallegrande.ms_catalogo_vehiculos.service.ReporteService;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reportes")
@RequiredArgsConstructor
@Tag(name = "Reportes", description = "Gestión de reportes del sistema")
public class ReporteController {
    
    private final ReporteService service;
    
    @GetMapping
    @Operation(summary = "Listar todos los reportes")
    public Mono<ResponseEntity<ApiResponse<List<Reporte>>>> findAll() {
        return service.findAll()
                .collectList()
                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obtener reporte por ID")
    public Mono<ResponseEntity<ApiResponse<Reporte>>> findById(@PathVariable Integer id) {
        return service.findById(id)
                .map(reporte -> ResponseEntity.ok(ApiResponse.success(reporte)))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @Operation(summary = "Crear nuevo reporte")
    public Mono<ResponseEntity<ApiResponse<Reporte>>> create(@RequestBody Reporte reporte) {
        return service.create(reporte)
                .map(created -> ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created)));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar reporte")
    public Mono<ResponseEntity<ApiResponse<Reporte>>> update(@PathVariable Integer id, @RequestBody Reporte reporte) {
        return service.update(id, reporte)
                .map(updated -> ResponseEntity.ok(ApiResponse.success(updated)))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar reporte (soft delete)")
    public Mono<ResponseEntity<ApiResponse<Void>>> delete(@PathVariable Integer id) {
        return service.delete(id)
                .then(Mono.just(ResponseEntity.ok(ApiResponse.success(null))));
    }
    
    @PutMapping("/{id}/restore")
    @Operation(summary = "Restaurar reporte eliminado")
    public Mono<ResponseEntity<ApiResponse<Reporte>>> restore(@PathVariable Integer id) {
        return service.restore(id)
                .map(restored -> ResponseEntity.ok(ApiResponse.success(restored)))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/tipo/{tipoReporte}")
    @Operation(summary = "Buscar reportes por tipo")
    public Mono<ResponseEntity<ApiResponse<List<Reporte>>>> findByTipoReporte(@PathVariable String tipoReporte) {
        return service.findByTipoReporte(tipoReporte)
                .collectList()
                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
    }
    
    @GetMapping("/usuario/{usuarioId}")
    @Operation(summary = "Buscar reportes por usuario generador")
    public Mono<ResponseEntity<ApiResponse<List<Reporte>>>> findByGeneradoPor(@PathVariable Integer usuarioId) {
        return service.findByGeneradoPor(usuarioId)
                .collectList()
                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
    }
    
    @GetMapping("/deleted")
    @Operation(summary = "Listar reportes eliminados")
    public Mono<ResponseEntity<ApiResponse<List<Reporte>>>> findAllDeleted() {
        return service.findAllDeleted()
                .collectList()
                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
    }
}