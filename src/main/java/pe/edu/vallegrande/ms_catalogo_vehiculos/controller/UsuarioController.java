package pe.edu.vallegrande.ms_catalogo_vehiculos.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.vallegrande.ms_catalogo_vehiculos.dto.ApiResponse;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Usuario;
import pe.edu.vallegrande.ms_catalogo_vehiculos.service.UsuarioService;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api/v1/usuarios")
@RequiredArgsConstructor
@Tag(name = "Usuarios", description = "Gestión de usuarios del sistema")
public class UsuarioController {
    
    private final UsuarioService service;
    
    @GetMapping
    @Operation(summary = "Listar todos los usuarios")
    public Mono<ResponseEntity<ApiResponse<List<Usuario>>>> findAll() {
        return service.findAll()
                .collectList()
                .map(list -> ResponseEntity.ok(ApiResponse.success(list)));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario por ID")
    public Mono<ResponseEntity<ApiResponse<Usuario>>> findById(@PathVariable Integer id) {
        return service.findById(id)
                .map(usuario -> ResponseEntity.ok(ApiResponse.success(usuario)))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @Operation(summary = "Crear nuevo usuario")
    public Mono<ResponseEntity<ApiResponse<Usuario>>> create(@RequestBody Usuario usuario) {
        return service.create(usuario)
                .map(created -> ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created)));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario")
    public Mono<ResponseEntity<ApiResponse<Usuario>>> update(@PathVariable Integer id, @RequestBody Usuario usuario) {
        return service.update(id, usuario)
                .map(updated -> ResponseEntity.ok(ApiResponse.success(updated)))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar usuario (soft delete)")
    public Mono<ResponseEntity<ApiResponse<Void>>> delete(@PathVariable Integer id) {
        return service.delete(id)
                .then(Mono.just(ResponseEntity.ok(ApiResponse.success(null))));
    }
}
