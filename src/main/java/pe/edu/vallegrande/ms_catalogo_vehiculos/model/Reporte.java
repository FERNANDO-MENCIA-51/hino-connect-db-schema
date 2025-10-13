package pe.edu.vallegrande.ms_catalogo_vehiculos.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("reportes")
public class Reporte {
    @Id
    private Integer id;
    private String tipoReporte;
    private Integer generadoPor;
    private LocalDateTime fechaGeneracion;
    private String parametros; // JSON as String
    private String resultado;  // JSON as String
    private LocalDateTime createdAt;
    private LocalDateTime deletedAt; // Para soft delete
}