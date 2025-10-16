package pe.edu.vallegrande.ms_catalogo_vehiculos.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import pe.edu.vallegrande.ms_catalogo_vehiculos.dto.ApiResponse;
import pe.edu.vallegrande.ms_catalogo_vehiculos.dto.ReporteRequest;
import pe.edu.vallegrande.ms_catalogo_vehiculos.dto.ReporteResponse;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Reporte;
import pe.edu.vallegrande.ms_catalogo_vehiculos.service.ReporteService;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/reportes")
@RequiredArgsConstructor
@Tag(name = "Reportes", description = "Gestión de reportes del sistema")
public class ReporteController {

        private final ReporteService service;

        @GetMapping
        @Operation(summary = "Listar todos los reportes")
        public Mono<ResponseEntity<ApiResponse<List<ReporteResponse>>>> findAll() {
                return service.findAllAsResponse()
                                .collectList()
                                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
        }

        @GetMapping("/{id}")
        @Operation(summary = "Obtener reporte por ID")
        public Mono<ResponseEntity<ApiResponse<ReporteResponse>>> findById(@PathVariable Integer id) {
                return service.findByIdAsResponse(id)
                                .map(reporte -> ResponseEntity.ok(ApiResponse.success(reporte)))
                                .defaultIfEmpty(ResponseEntity.notFound().build());
        }

        @PostMapping
        @Operation(summary = "Crear nuevo reporte")
        public Mono<ResponseEntity<ApiResponse<ReporteResponse>>> create(@RequestBody ReporteRequest request) {
                return service.createFromRequest(request)
                                .map(created -> ResponseEntity.status(HttpStatus.CREATED)
                                                .body(ApiResponse.success(created)));
        }

        @PostMapping("/generar/conductores")
        @Operation(summary = "Generar reporte de conductores")
        public Mono<ResponseEntity<ApiResponse<ReporteResponse>>> generarReporteConductores(
                        @RequestParam String periodo, @RequestParam Integer usuarioId) {
                return service.generarReporteConductores(periodo, usuarioId)
                                .map(reporte -> ResponseEntity.ok(ApiResponse.success(reporte)))
                                .onErrorResume(e -> {
                                        return Mono.just(ResponseEntity.badRequest()
                                                        .body(ApiResponse.error("Error al generar reporte: "
                                                                        + e.getMessage())));
                                });
        }

        @PostMapping("/generar/vehiculos")
        @Operation(summary = "Generar reporte de vehículos")
        public Mono<ResponseEntity<ApiResponse<ReporteResponse>>> generarReporteVehiculos(
                        @RequestParam String estado, @RequestParam Integer usuarioId) {
                return service.generarReporteVehiculos(estado, usuarioId)
                                .map(reporte -> ResponseEntity.ok(ApiResponse.success(reporte)))
                                .onErrorResume(e -> {
                                        return Mono.just(ResponseEntity.badRequest()
                                                        .body(ApiResponse.error("Error al generar reporte: "
                                                                        + e.getMessage())));
                                });
        }

        @PostMapping("/generar/movimientos")
        @Operation(summary = "Generar reporte de movimientos")
        public Mono<ResponseEntity<ApiResponse<ReporteResponse>>> generarReporteMovimientos(
                        @RequestParam String fechaInicio, @RequestParam String fechaFin,
                        @RequestParam Integer usuarioId) {
                return service.generarReporteMovimientos(fechaInicio, fechaFin, usuarioId)
                                .map(reporte -> ResponseEntity.ok(ApiResponse.success(reporte)))
                                .onErrorResume(e -> {
                                        return Mono.just(ResponseEntity.badRequest()
                                                        .body(ApiResponse.error("Error al generar reporte: "
                                                                        + e.getMessage())));
                                });
        }

        @PutMapping("/{id}")
        @Operation(summary = "Actualizar reporte")
        public Mono<ResponseEntity<ApiResponse<Reporte>>> update(@PathVariable Integer id,
                        @RequestBody Reporte reporte) {
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
        public Mono<ResponseEntity<ApiResponse<ReporteResponse>>> restore(@PathVariable Integer id) {
                return service.restoreAsResponse(id)
                                .map(restored -> ResponseEntity.ok(ApiResponse.success(restored)))
                                .defaultIfEmpty(ResponseEntity.notFound().build());
        }

        @GetMapping("/tipo/{tipoReporte}")
        @Operation(summary = "Buscar reportes por tipo")
        public Mono<ResponseEntity<ApiResponse<List<ReporteResponse>>>> findByTipoReporte(
                        @PathVariable String tipoReporte) {
                return service.findByTipoReporte(tipoReporte)
                                .map(this::convertToResponse)
                                .collectList()
                                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
        }

        @GetMapping("/usuario/{usuarioId}")
        @Operation(summary = "Buscar reportes por usuario generador")
        public Mono<ResponseEntity<ApiResponse<List<ReporteResponse>>>> findByGeneradoPor(
                        @PathVariable Integer usuarioId) {
                return service.findByGeneradoPor(usuarioId)
                                .map(this::convertToResponse)
                                .collectList()
                                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
        }

        @GetMapping("/deleted")
        @Operation(summary = "Listar reportes eliminados")
        public Mono<ResponseEntity<ApiResponse<List<ReporteResponse>>>> findAllDeleted() {
                return service.findAllDeleted()
                                .map(this::convertToResponse)
                                .collectList()
                                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
        }

        private ReporteResponse convertToResponse(Reporte reporte) {
                ReporteResponse response = new ReporteResponse();
                response.setId(reporte.getId());
                response.setTipoReporte(reporte.getTipoReporte());
                response.setGeneradoPor(reporte.getGeneradoPor());
                response.setFechaGeneracion(reporte.getFechaGeneracion());
                response.setParametros(reporte.getParametros() != null ? reporte.getParametros().asString() : null);
                response.setResultado(reporte.getResultado() != null ? reporte.getResultado().asString() : null);
                response.setCreatedAt(reporte.getCreatedAt());
                return response;
        }

        @GetMapping("/test")
        @Operation(summary = "Endpoint de prueba")
        public Mono<ResponseEntity<ApiResponse<String>>> test() {
                return Mono.just(ResponseEntity.ok(ApiResponse.success("Reportes API funcionando correctamente")));
        }
}