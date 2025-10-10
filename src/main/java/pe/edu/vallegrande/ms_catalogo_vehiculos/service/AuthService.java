package pe.edu.vallegrande.ms_catalogo_vehiculos.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.vallegrande.ms_catalogo_vehiculos.dto.LoginRequest;
import pe.edu.vallegrande.ms_catalogo_vehiculos.dto.LoginResponse;
import pe.edu.vallegrande.ms_catalogo_vehiculos.repository.RolRepository;
import pe.edu.vallegrande.ms_catalogo_vehiculos.security.JwtUtil;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UsuarioService usuarioService;
    private final RolRepository rolRepository;
    private final JwtUtil jwtUtil;
    
    public Mono<LoginResponse> login(LoginRequest request) {
        return usuarioService.findByEmail(request.getEmail())
                .switchIfEmpty(Mono.error(new RuntimeException("Usuario no encontrado")))
                .flatMap(usuario -> {
                    // Validar que el usuario esté activo
                    if (usuario.getActivo() == null || !usuario.getActivo()) {
                        return Mono.error(new RuntimeException("Usuario inactivo"));
                    }
                    
                    // Validar password
                    return usuarioService.validatePassword(request.getPassword(), usuario.getPasswordHash())
                        .flatMap(isValid -> {
                            if (!isValid) {
                                return Mono.error(new RuntimeException("Credenciales inválidas"));
                            }
                            
                            // Validar que tenga rol asignado
                            if (usuario.getRolId() == null) {
                                return Mono.error(new RuntimeException("Usuario sin rol asignado"));
                            }
                            
                            // Obtener rol y generar token
                            return rolRepository.findById(usuario.getRolId())
                                .switchIfEmpty(Mono.error(new RuntimeException("Rol no encontrado")))
                                .map(rol -> {
                                    String token = jwtUtil.generateToken(
                                        usuario.getEmail(),
                                        usuario.getNombre() + " " + usuario.getApellido(),
                                        rol.getNombre()
                                    );
                                    return new LoginResponse(
                                        token,
                                        usuario.getEmail(),
                                        usuario.getNombre() + " " + usuario.getApellido(),
                                        rol.getNombre()
                                    );
                                });
                        });
                });
    }
}
