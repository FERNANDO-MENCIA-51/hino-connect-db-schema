package pe.edu.vallegrande.ms_catalogo_vehiculos.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Rol;
import pe.edu.vallegrande.ms_catalogo_vehiculos.repository.RolRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RolServiceTest {

    @Mock
    private RolRepository repository;

    @InjectMocks
    private RolService service;

    private Rol rol;

    @BeforeEach
    void setUp() {
        rol = new Rol();
        rol.setId(1);
        rol.setNombre("Administrador");
        rol.setDescripcion("Acceso completo al sistema");
    }

    @Test
    void testFindAll() {
        // Given
        when(repository.findAllActive()).thenReturn(Flux.just(rol));

        // When & Then
        StepVerifier.create(service.findAll())
                .expectNext(rol)
                .verifyComplete();
    }

    @Test
    void testFindById() {
        // Given
        when(repository.findByIdActive(1)).thenReturn(Mono.just(rol));

        // When & Then
        StepVerifier.create(service.findById(1))
                .expectNext(rol)
                .verifyComplete();
    }

    @Test
    void testCreate() {
        // Given
        when(repository.save(any(Rol.class))).thenReturn(Mono.just(rol));

        // When & Then
        StepVerifier.create(service.create(rol))
                .expectNext(rol)
                .verifyComplete();
    }

    @Test
    void testUpdate() {
        // Given
        Rol existingRol = new Rol();
        existingRol.setId(1);
        existingRol.setCreatedAt(java.time.LocalDateTime.now());
        
        when(repository.findByIdActive(1)).thenReturn(Mono.just(existingRol));
        when(repository.save(any(Rol.class))).thenReturn(Mono.just(rol));

        // When & Then
        StepVerifier.create(service.update(1, rol))
                .expectNext(rol)
                .verifyComplete();
    }

    @Test
    void testDelete() {
        // Given
        when(repository.findByIdActive(1)).thenReturn(Mono.just(rol));
        when(repository.save(any(Rol.class))).thenReturn(Mono.just(rol));

        // When & Then
        StepVerifier.create(service.delete(1))
                .verifyComplete();
    }
}