package pe.edu.vallegrande.ms_catalogo_vehiculos.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReporteResponse {
    private Integer id;
    private String tipoReporte;
    private Integer generadoPor;
    private String nombreUsuario; // Nombre del usuario que generó el reporte
    private LocalDateTime fechaGeneracion;
    private String parametros;
    private String resultado;
    private LocalDateTime createdAt;
}