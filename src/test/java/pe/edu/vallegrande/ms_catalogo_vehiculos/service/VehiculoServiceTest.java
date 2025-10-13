package pe.edu.vallegrande.ms_catalogo_vehiculos.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Vehiculo;
import pe.edu.vallegrande.ms_catalogo_vehiculos.repository.VehiculoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VehiculoServiceTest {

    @Mock
    private VehiculoRepository repository;

    @InjectMocks
    private VehiculoService service;

    private Vehiculo vehiculo;

    @BeforeEach
    void setUp() {
        vehiculo = new Vehiculo();
        vehiculo.setId(1);
        vehiculo.setCodigo("V0001");
        vehiculo.setPlaca("ABC-123");
        vehiculo.setMarca("HINO");
        vehiculo.setModelo("GH-300");
        vehiculo.setTipo("Camión");
        vehiculo.setAnioFabricacion(2023);
        vehiculo.setCapacidadCarga(new BigDecimal("15000.00"));
        vehiculo.setCombustible("Diesel");
        vehiculo.setEstadoActual("En operación");
        vehiculo.setActivo(true);
    }

    @Test
    void testFindAll() {
        // Given
        when(repository.findAllActive()).thenReturn(Flux.just(vehiculo));

        // When & Then
        StepVerifier.create(service.findAll())
                .expectNext(vehiculo)
                .verifyComplete();
    }

    @Test
    void testFindById() {
        // Given
        when(repository.findByIdActive(1)).thenReturn(Mono.just(vehiculo));

        // When & Then
        StepVerifier.create(service.findById(1))
                .expectNext(vehiculo)
                .verifyComplete();
    }

    @Test
    void testCreate() {
        // Given
        when(repository.save(any(Vehiculo.class))).thenReturn(Mono.just(vehiculo));

        // When & Then
        StepVerifier.create(service.create(vehiculo))
                .expectNext(vehiculo)
                .verifyComplete();
    }

    @Test
    void testFindByEstado() {
        // Given
        when(repository.findByEstado("En operación")).thenReturn(Flux.just(vehiculo));

        // When & Then
        StepVerifier.create(service.findByEstado("En operación"))
                .expectNext(vehiculo)
                .verifyComplete();
    }
}
