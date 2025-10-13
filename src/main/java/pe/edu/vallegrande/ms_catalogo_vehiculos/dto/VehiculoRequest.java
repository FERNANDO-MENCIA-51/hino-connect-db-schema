package pe.edu.vallegrande.ms_catalogo_vehiculos.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class VehiculoRequest {
    
    @NotBlank(message = "El código es requerido")
    @Size(max = 20, message = "El código no puede exceder 20 caracteres")
    private String codigo;
    
    @NotBlank(message = "La placa es requerida")
    @Pattern(regexp = "^[A-Z]{3}-\\d{3}$", message = "La placa debe tener el formato ABC-123")
    private String placa;
    
    @NotBlank(message = "La marca es requerida")
    @Size(max = 50, message = "La marca no puede exceder 50 caracteres")
    private String marca;
    
    @NotBlank(message = "El modelo es requerido")
    @Size(max = 50, message = "El modelo no puede exceder 50 caracteres")
    private String modelo;
    
    @Size(max = 50, message = "El tipo no puede exceder 50 caracteres")
    private String tipo;
    
    @Min(value = 1900, message = "El año de fabricación debe ser mayor a 1900")
    @Max(value = 2100, message = "El año de fabricación debe ser menor a 2100")
    private Integer anioFabricacion;
    
    @Size(max = 50, message = "El número de chasis no puede exceder 50 caracteres")
    private String numeroChasis;
    
    @DecimalMin(value = "0.0", message = "La capacidad de carga debe ser mayor a 0")
    private BigDecimal capacidadCarga;
    
    @Size(max = 20, message = "El tipo de combustible no puede exceder 20 caracteres")
    private String combustible;
    
    @Pattern(regexp = "^(En operación|En mantenimiento|Disponible|Inactivo)$", 
             message = "Estado inválido. Valores permitidos: En operación, En mantenimiento, Disponible, Inactivo")
    private String estadoActual;
    
    @Size(max = 500, message = "La URL de imagen no puede exceder 500 caracteres")
    private String imagenUrl;
    
    private Boolean activo = true;
}
