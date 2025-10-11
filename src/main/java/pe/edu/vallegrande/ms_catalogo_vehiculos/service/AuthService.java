package pe.edu.vallegrande.ms_catalogo_vehiculos.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pe.edu.vallegrande.ms_catalogo_vehiculos.dto.LoginRequest;
import pe.edu.vallegrande.ms_catalogo_vehiculos.dto.LoginResponse;
import pe.edu.vallegrande.ms_catalogo_vehiculos.repository.RolRepository;
import pe.edu.vallegrande.ms_catalogo_vehiculos.security.JwtUtil;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioService usuarioService;
    private final RolRepository rolRepository;
    private final JwtUtil jwtUtil;

    public Mono<LoginResponse> login(LoginRequest request) {
        log.info("Intentando login para email: {}", request.getEmail());
        return usuarioService.findByEmail(request.getEmail())
                .doOnNext(usuario -> log.info("Usuario encontrado: {}, activo: {}, rolId: {}",
                        usuario.getEmail(), usuario.getActivo(), usuario.getRolId()))
                .switchIfEmpty(Mono.defer(() -> {
                    log.error("Usuario no encontrado: {}", request.getEmail());
                    return Mono.error(new RuntimeException("Usuario no encontrado"));
                }))
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
                                                    rol.getNombre());
                                            return new LoginResponse(
                                                    token,
                                                    usuario.getEmail(),
                                                    usuario.getNombre() + " " + usuario.getApellido(),
                                                    rol.getNombre());
                                        });
                            });
                });
    }
}
