package pe.edu.vallegrande.ms_catalogo_vehiculos.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("vehiculos")
public class Vehiculo {
    @Id
    private Integer id;
    private String codigo;
    private String placa;
    private String marca;
    private String modelo;
    private String tipo;
    private Integer anioFabricacion;
    private String numeroChasis;
    private BigDecimal capacidadCarga;
    private String combustible;
    private String estadoActual;
    private String imagenUrl;
    private Boolean activo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
