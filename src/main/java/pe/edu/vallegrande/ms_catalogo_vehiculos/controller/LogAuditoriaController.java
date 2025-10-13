package pe.edu.vallegrande.ms_catalogo_vehiculos.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.vallegrande.ms_catalogo_vehiculos.dto.ApiResponse;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.LogAuditoria;
import pe.edu.vallegrande.ms_catalogo_vehiculos.service.LogAuditoriaService;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/logs-auditoria")
@RequiredArgsConstructor
@Tag(name = "Logs de Auditoría", description = "Consulta de logs de auditoría del sistema")
public class LogAuditoriaController {
    
    private final LogAuditoriaService service;
    
    @GetMapping
    @Operation(summary = "Listar todos los logs de auditoría")
    public Mono<ResponseEntity<ApiResponse<List<LogAuditoria>>>> findAll() {
        return service.findAll()
                .collectList()
                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obtener log de auditoría por ID")
    public Mono<ResponseEntity<ApiResponse<LogAuditoria>>> findById(@PathVariable UUID id) {
        return service.findById(id)
                .map(log -> ResponseEntity.ok(ApiResponse.success(log)))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/tabla/{tabla}")
    @Operation(summary = "Buscar logs por tabla")
    public Mono<ResponseEntity<ApiResponse<List<LogAuditoria>>>> findByTabla(@PathVariable String tabla) {
        return service.findByTabla(tabla)
                .collectList()
                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
    }
    
    @GetMapping("/operacion/{operacion}")
    @Operation(summary = "Buscar logs por operación")
    public Mono<ResponseEntity<ApiResponse<List<LogAuditoria>>>> findByOperacion(@PathVariable String operacion) {
        return service.findByOperacion(operacion)
                .collectList()
                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
    }
    
    @GetMapping("/usuario/{usuarioId}")
    @Operation(summary = "Buscar logs por usuario")
    public Mono<ResponseEntity<ApiResponse<List<LogAuditoria>>>> findByUsuarioId(@PathVariable Integer usuarioId) {
        return service.findByUsuarioId(usuarioId)
                .collectList()
                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
    }
    
    @GetMapping("/registro/{registroId}/tabla/{tabla}")
    @Operation(summary = "Buscar logs por registro específico en una tabla")
    public Mono<ResponseEntity<ApiResponse<List<LogAuditoria>>>> findByRegistroIdAndTabla(
            @PathVariable Integer registroId, 
            @PathVariable String tabla) {
        return service.findByRegistroIdAndTabla(registroId, tabla)
                .collectList()
                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
    }
    
    @GetMapping("/fecha")
    @Operation(summary = "Buscar logs por rango de fechas")
    public Mono<ResponseEntity<ApiResponse<List<LogAuditoria>>>> findByFechaBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {
        return service.findByFechaBetween(fechaInicio, fechaFin)
                .collectList()
                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
    }
    
    @GetMapping("/recientes")
    @Operation(summary = "Obtener los logs más recientes")
    public Mono<ResponseEntity<ApiResponse<List<LogAuditoria>>>> findRecientes(
            @RequestParam(defaultValue = "50") int limit) {
        return service.findRecientes(limit)
                .collectList()
                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
    }
    
    @GetMapping("/estadisticas/tabla/{tabla}")
    @Operation(summary = "Obtener estadísticas por tabla")
    public Mono<ResponseEntity<ApiResponse<Long>>> countByTabla(@PathVariable String tabla) {
        return service.countByTabla(tabla)
                .map(count -> ResponseEntity.ok(ApiResponse.success(count)));
    }
    
    @GetMapping("/estadisticas/operacion/{operacion}")
    @Operation(summary = "Obtener estadísticas por operación")
    public Mono<ResponseEntity<ApiResponse<Long>>> countByOperacion(@PathVariable String operacion) {
        return service.countByOperacion(operacion)
                .map(count -> ResponseEntity.ok(ApiResponse.success(count)));
    }
}