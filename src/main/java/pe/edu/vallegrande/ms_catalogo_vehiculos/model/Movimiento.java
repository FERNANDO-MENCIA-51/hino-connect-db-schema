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
@Table("movimientos")
public class Movimiento {
    @Id
    private Integer id;
    private String codigo;
    private Integer vehiculoId;
    private Integer conductorId;
    private String origen;
    private String destino;
    private LocalDateTime fechaHoraSalida;
    private LocalDateTime fechaHoraLlegadaEstimada;
    private LocalDateTime fechaHoraLlegadaReal;
    private String tipoMovimiento;
    private String cargaPasajeros;
    private String estado;
    private String observaciones;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
