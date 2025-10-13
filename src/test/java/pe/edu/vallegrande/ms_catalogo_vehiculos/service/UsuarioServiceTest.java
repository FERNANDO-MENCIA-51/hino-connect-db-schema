package pe.edu.vallegrande.ms_catalogo_vehiculos.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Usuario;
import pe.edu.vallegrande.ms_catalogo_vehiculos.repository.UsuarioRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository repository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService service;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1);
        usuario.setEmail("admin@hinoconnect.com");
        usuario.setPasswordHash("$2a$10$hashedpassword");
        usuario.setNombre("Admin");
        usuario.setApellido("Sistema");
        usuario.setTelefono("999888777");
        usuario.setRolId(1);
        usuario.setActivo(true);
    }

    @Test
    void testFindAll() {
        // Given
        when(repository.findAllActive()).thenReturn(Flux.just(usuario));

        // When & Then
        StepVerifier.create(service.findAll())
                .expectNext(usuario)
                .verifyComplete();
    }

    @Test
    void testFindById() {
        // Given
        when(repository.findByIdActive(1)).thenReturn(Mono.just(usuario));

        // When & Then
        StepVerifier.create(service.findById(1))
                .expectNext(usuario)
                .verifyComplete();
    }

    @Test
    void testFindByEmail() {
        // Given
        when(repository.findByEmail("admin@hinoconnect.com")).thenReturn(Mono.just(usuario));

        // When & Then
        StepVerifier.create(service.findByEmail("admin@hinoconnect.com"))
                .expectNext(usuario)
                .verifyComplete();
    }

    @Test
    void testCreate() {
        // Given
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$hashedpassword");
        when(repository.save(any(Usuario.class))).thenReturn(Mono.just(usuario));

        // When & Then
        StepVerifier.create(service.create(usuario))
                .expectNext(usuario)
                .verifyComplete();
    }

    @Test
    void testUpdate() {
        // Given
        Usuario existingUsuario = new Usuario();
        existingUsuario.setId(1);
        existingUsuario.setCreatedAt(java.time.LocalDateTime.now());
        existingUsuario.setPasswordHash("$2a$10$oldhashedpassword");
        
        when(repository.findByIdActive(1)).thenReturn(Mono.just(existingUsuario));
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$newhashedpassword");
        when(repository.save(any(Usuario.class))).thenReturn(Mono.just(usuario));

        // When & Then
        StepVerifier.create(service.update(1, usuario))
                .expectNext(usuario)
                .verifyComplete();
    }

    @Test
    void testDelete() {
        // Given
        when(repository.findByIdActive(1)).thenReturn(Mono.just(usuario));
        when(repository.save(any(Usuario.class))).thenReturn(Mono.just(usuario));

        // When & Then
        StepVerifier.create(service.delete(1))
                .verifyComplete();
    }

    @Test
    void testValidatePasswordSuccess() {
        // Given
        when(passwordEncoder.matches("password123", "$2a$10$hashedpassword")).thenReturn(true);

        // When & Then
        StepVerifier.create(service.validatePassword("password123", "$2a$10$hashedpassword"))
                .expectNext(true)
                .verifyComplete();
    }

    @Test
    void testValidatePasswordFailure() {
        // Given
        when(passwordEncoder.matches("wrongpassword", "$2a$10$hashedpassword")).thenReturn(false);

        // When & Then
        StepVerifier.create(service.validatePassword("wrongpassword", "$2a$10$hashedpassword"))
                .expectNext(false)
                .verifyComplete();
    }
}