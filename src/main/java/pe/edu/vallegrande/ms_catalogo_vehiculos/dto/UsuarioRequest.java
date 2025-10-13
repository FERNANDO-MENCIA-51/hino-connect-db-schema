package pe.edu.vallegrande.ms_catalogo_vehiculos.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UsuarioRequest {
    
    @NotBlank(message = "El email es requerido")
    @Email(message = "Email inválido")
    @Size(max = 255, message = "El email no puede exceder 255 caracteres")
    private String email;
    
    @NotBlank(message = "La contraseña es requerida")
    @Size(min = 8, max = 100, message = "La contraseña debe tener entre 8 y 100 caracteres")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", 
             message = "La contraseña debe contener al menos una mayúscula, una minúscula y un número")
    private String password;
    
    @NotBlank(message = "El nombre es requerido")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String nombre;
    
    @NotBlank(message = "El apellido es requerido")
    @Size(max = 100, message = "El apellido no puede exceder 100 caracteres")
    private String apellido;
    
    @Pattern(regexp = "^\\+?[0-9]{9,15}$", message = "Teléfono inválido")
    private String telefono;
    
    @NotNull(message = "El rol es requerido")
    @Min(value = 1, message = "El ID del rol debe ser mayor a 0")
    private Integer rolId;
    
    private Boolean activo = true;
}
