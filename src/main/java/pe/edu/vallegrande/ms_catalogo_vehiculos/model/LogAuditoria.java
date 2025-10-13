package pe.edu.vallegrande.ms_catalogo_vehiculos.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("logs_auditoria")
public class LogAuditoria {
    @Id
    private UUID id;
    private String tabla;
    private String operacion;
    private Integer registroId;
    private Integer usuarioId;
    private String descripcion;
    private LocalDateTime fecha;
}