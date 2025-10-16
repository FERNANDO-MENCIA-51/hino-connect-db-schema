package pe.edu.vallegrande.ms_catalogo_vehiculos.dto;

import java.time.LocalDateTime;

import io.r2dbc.postgresql.codec.Json;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReporteConUsuarioDTO {
    private Integer id;
    private String tipoReporte;
    private Integer generadoPor;
    private LocalDateTime fechaGeneracion;
    private Json parametros;
    private Json resultado;
    private LocalDateTime createdAt;
    private String nombreUsuario; // Del JOIN con usuarios
}
