package pe.edu.vallegrande.ms_catalogo_vehiculos.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Conductor;
import pe.edu.vallegrande.ms_catalogo_vehiculos.repository.ConductorRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ConductorServiceTest {

    @Mock
    private ConductorRepository repository;

    @InjectMocks
    private ConductorService service;

    private Conductor conductor;

    @BeforeEach
    void setUp() {
        conductor = new Conductor();
        conductor.setId(1);
        conductor.setCodigo("C001");
        conductor.setNombre("Carlos");
        conductor.setApellido("Rodríguez");
        conductor.setDni("12345678");
        conductor.setTelefono("987654321");
        conductor.setLicencia("A-III-a");
        conductor.setVehiculoAsignado("HINO-GH-001");
        conductor.setEstado("Activo");
        conductor.setFechaIngreso(LocalDate.of(2023, 1, 15));
        conductor.setActivo(true);
    }

    @Test
    void testFindAll() {
        // Given
        when(repository.findAllActive()).thenReturn(Flux.just(conductor));

        // When & Then
        StepVerifier.create(service.findAll())
                .expectNext(conductor)
                .verifyComplete();
    }

    @Test
    void testFindById() {
        // Given
        when(repository.findByIdActive(1)).thenReturn(Mono.just(conductor));

        // When & Then
        StepVerifier.create(service.findById(1))
                .expectNext(conductor)
                .verifyComplete();
    }

    @Test
    void testCreate() {
        // Given
        when(repository.save(any(Conductor.class))).thenReturn(Mono.just(conductor));

        // When & Then
        StepVerifier.create(service.create(conductor))
                .expectNext(conductor)
                .verifyComplete();
    }

    @Test
    void testUpdate() {
        // Given
        Conductor existingConductor = new Conductor();
        existingConductor.setId(1);
        existingConductor.setCreatedAt(java.time.LocalDateTime.now());
        
        when(repository.findByIdActive(1)).thenReturn(Mono.just(existingConductor));
        when(repository.save(any(Conductor.class))).thenReturn(Mono.just(conductor));

        // When & Then
        StepVerifier.create(service.update(1, conductor))
                .expectNext(conductor)
                .verifyComplete();
    }

    @Test
    void testDelete() {
        // Given
        when(repository.findByIdActive(1)).thenReturn(Mono.just(conductor));
        when(repository.save(any(Conductor.class))).thenReturn(Mono.just(conductor));

        // When & Then
        StepVerifier.create(service.delete(1))
                .verifyComplete();
    }

    @Test
    void testFindByEstado() {
        // Given
        when(repository.findByEstado("Activo")).thenReturn(Flux.just(conductor));

        // When & Then
        StepVerifier.create(service.findByEstado("Activo"))
                .expectNext(conductor)
                .verifyComplete();
    }
}