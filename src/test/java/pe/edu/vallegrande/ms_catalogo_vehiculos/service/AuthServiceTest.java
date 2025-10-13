package pe.edu.vallegrande.ms_catalogo_vehiculos.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pe.edu.vallegrande.ms_catalogo_vehiculos.dto.LoginRequest;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Rol;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Usuario;
import pe.edu.vallegrande.ms_catalogo_vehiculos.repository.RolRepository;
import pe.edu.vallegrande.ms_catalogo_vehiculos.security.JwtUtil;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioService usuarioService;

    @Mock
    private RolRepository rolRepository;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private Usuario usuario;
    private Rol rol;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1);
        usuario.setEmail("admin@hinoconnect.com");
        usuario.setPasswordHash("$2a$10$hashedpassword");
        usuario.setNombre("Admin");
        usuario.setApellido("Sistema");
        usuario.setRolId(1);
        usuario.setActivo(true);

        rol = new Rol();
        rol.setId(1);
        rol.setNombre("Administrador");

        loginRequest = new LoginRequest();
        loginRequest.setEmail("admin@hinoconnect.com");
        loginRequest.setPassword("admin123");
    }

    @Test
    void testLoginSuccess() {
        // Given
        when(usuarioService.findByEmail("admin@hinoconnect.com")).thenReturn(Mono.just(usuario));
        when(usuarioService.validatePassword(anyString(), anyString())).thenReturn(Mono.just(true));
        when(rolRepository.findById(1)).thenReturn(Mono.just(rol));
        when(jwtUtil.generateToken(anyString(), anyString(), anyString())).thenReturn("fake-jwt-token");

        // When & Then
        StepVerifier.create(authService.login(loginRequest))
                .expectNextMatches(response -> 
                    response.getToken().equals("fake-jwt-token") &&
                    response.getEmail().equals("admin@hinoconnect.com") &&
                    response.getRol().equals("Administrador")
                )
                .verifyComplete();
    }

    @Test
    void testLoginUserNotFound() {
        // Given
        when(usuarioService.findByEmail("admin@hinoconnect.com")).thenReturn(Mono.empty());

        // When & Then
        StepVerifier.create(authService.login(loginRequest))
                .expectErrorMessage("Usuario no encontrado")
                .verify();
    }

    @Test
    void testLoginInvalidPassword() {
        // Given
        when(usuarioService.findByEmail("admin@hinoconnect.com")).thenReturn(Mono.just(usuario));
        when(usuarioService.validatePassword(anyString(), anyString())).thenReturn(Mono.just(false));

        // When & Then
        StepVerifier.create(authService.login(loginRequest))
                .expectErrorMessage("Credenciales inválidas")
                .verify();
    }
}
