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
@Table("usuarios")
public class Usuario {
    @Id
    private Integer id;
    private String email;
    private String passwordHash;
    private String nombre;
    private String apellido;
    private String telefono;
    private Integer rolId;
    private Boolean activo;
    private LocalDateTime ultimoLogin;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
}
