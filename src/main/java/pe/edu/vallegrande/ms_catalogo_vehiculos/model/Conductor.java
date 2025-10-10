package pe.edu.vallegrande.ms_catalogo_vehiculos.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("conductores")
public class Conductor {
    @Id
    private Integer id;
    private String codigo;
    private String nombre;
    private String apellido;
    private String dni;
    private String telefono;
    private String licencia;
    private String vehiculoAsignado;
    private String estado;
    private LocalDate fechaIngreso;
    private Boolean activo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
