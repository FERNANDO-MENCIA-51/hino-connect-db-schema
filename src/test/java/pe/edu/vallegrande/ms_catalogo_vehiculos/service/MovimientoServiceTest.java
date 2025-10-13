package pe.edu.vallegrande.ms_catalogo_vehiculos.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Movimiento;
import pe.edu.vallegrande.ms_catalogo_vehiculos.repository.MovimientoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MovimientoServiceTest {

    @Mock
    private MovimientoRepository repository;

    @InjectMocks
    private MovimientoService service;

    private Movimiento movimiento;

    @BeforeEach
    void setUp() {
        movimiento = new Movimiento();
        movimiento.setId(1);
        movimiento.setCodigo("MOV-001");
        movimiento.setVehiculoId(1);
        movimiento.setConductorId(1);
        movimiento.setOrigen("Lima");
        movimiento.setDestino("Arequipa");
        movimiento.setFechaHoraSalida(LocalDateTime.of(2024, 10, 10, 8, 0));
        movimiento.setFechaHoraLlegadaEstimada(LocalDateTime.of(2024, 10, 10, 20, 0));
        movimiento.setTipoMovimiento("Transporte de carga");
        movimiento.setCargaPasajeros("Carga general 10 toneladas");
        movimiento.setEstado("En curso");
        movimiento.setObservaciones("Viaje sin novedades");
    }

    @Test
    void testFindAll() {
        // Given
        when(repository.findAllActive()).thenReturn(Flux.just(movimiento));

        // When & Then
        StepVerifier.create(service.findAll())
                .expectNext(movimiento)
                .verifyComplete();
    }

    @Test
    void testFindById() {
        // Given
        when(repository.findByIdActive(1)).thenReturn(Mono.just(movimiento));

        // When & Then
        StepVerifier.create(service.findById(1))
                .expectNext(movimiento)
                .verifyComplete();
    }

    @Test
    void testCreate() {
        // Given
        when(repository.save(any(Movimiento.class))).thenReturn(Mono.just(movimiento));

        // When & Then
        StepVerifier.create(service.create(movimiento))
                .expectNext(movimiento)
                .verifyComplete();
    }

    @Test
    void testUpdate() {
        // Given
        Movimiento existingMovimiento = new Movimiento();
        existingMovimiento.setId(1);
        existingMovimiento.setCreatedAt(LocalDateTime.now());
        
        when(repository.findByIdActive(1)).thenReturn(Mono.just(existingMovimiento));
        when(repository.save(any(Movimiento.class))).thenReturn(Mono.just(movimiento));

        // When & Then
        StepVerifier.create(service.update(1, movimiento))
                .expectNext(movimiento)
                .verifyComplete();
    }

    @Test
    void testDelete() {
        // Given
        when(repository.findByIdActive(1)).thenReturn(Mono.just(movimiento));
        when(repository.save(any(Movimiento.class))).thenReturn(Mono.just(movimiento));

        // When & Then
        StepVerifier.create(service.delete(1))
                .verifyComplete();
    }

    @Test
    void testFindByEstado() {
        // Given
        when(repository.findByEstado("En curso")).thenReturn(Flux.just(movimiento));

        // When & Then
        StepVerifier.create(service.findByEstado("En curso"))
                .expectNext(movimiento)
                .verifyComplete();
    }

    @Test
    void testFindByVehiculoId() {
        // Given
        when(repository.findByVehiculoId(1)).thenReturn(Flux.just(movimiento));

        // When & Then
        StepVerifier.create(service.findByVehiculoId(1))
                .expectNext(movimiento)
                .verifyComplete();
    }

    @Test
    void testFindByConductorId() {
        // Given
        when(repository.findByConductorId(1)).thenReturn(Flux.just(movimiento));

        // When & Then
        StepVerifier.create(service.findByConductorId(1))
                .expectNext(movimiento)
                .verifyComplete();
    }
}