package pe.edu.vallegrande.ms_catalogo_vehiculos.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import io.r2dbc.postgresql.codec.Json;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("reportes")
public class Reporte {
    @Id
    private Integer id;

    @Column("tipo_reporte")
    private String tipoReporte;

    @Column("generado_por")
    private Integer generadoPor;

    @Column("fecha_generacion")
    private LocalDateTime fechaGeneracion;

    private Json parametros; // JSONB type

    private Json resultado; // JSONB type

    @Column("created_at")
    private LocalDateTime createdAt;

    @Column("deleted_at")
    private LocalDateTime deletedAt; // Para soft delete
}
