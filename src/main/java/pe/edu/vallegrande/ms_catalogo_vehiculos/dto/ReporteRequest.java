package pe.edu.vallegrande.ms_catalogo_vehiculos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReporteRequest {

    @NotBlank(message = "El tipo de reporte es obligatorio")
    private String tipoReporte;

    @NotNull(message = "El ID del usuario generador es obligatorio")
    private Integer generadoPor;

    private String parametros; // JSON como String

    private String resultado; // JSON como String
}