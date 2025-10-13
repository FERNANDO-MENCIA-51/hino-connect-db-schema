package pe.edu.vallegrande.ms_catalogo_vehiculos.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.r2dbc.DataR2dbcTest;
import org.springframework.test.context.TestPropertySource;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Rol;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Vehiculo;
import reactor.test.StepVerifier;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@DataR2dbcTest
@TestPropertySource(properties = {
    "spring.r2dbc.url=r2dbc:h2:mem:///testdb",
    "spring.r2dbc.username=sa",
    "spring.r2dbc.password="
})
class RepositoryTest {

    @Autowired
    private VehiculoRepository vehiculoRepository;

    @Autowired
    private RolRepository rolRepository;

    @Test
    void testVehiculoRepositoryFindAllActive() {
        // Given
        Vehiculo vehiculo = new Vehiculo();
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
        vehiculo.setCreatedAt(LocalDateTime.now());
        vehiculo.setUpdatedAt(LocalDateTime.now());

        // When & Then
        StepVerifier.create(
            vehiculoRepository.save(vehiculo)
                .then(vehiculoRepository.findAllActive().collectList())
        )
        .expectNextMatches(list -> !list.isEmpty())
        .verifyComplete();
    }

    @Test
    void testRolRepositoryFindByNombre() {
        // Given
        Rol rol = new Rol();
        rol.setNombre("TEST_ROLE");
        rol.setDescripcion("Test role description");
        rol.setCreatedAt(LocalDateTime.now());
        rol.setUpdatedAt(LocalDateTime.now());

        // When & Then
        StepVerifier.create(
            rolRepository.save(rol)
                .then(rolRepository.findByNombre("TEST_ROLE"))
        )
        .expectNextMatches(foundRol -> 
            foundRol.getNombre().equals("TEST_ROLE") &&
            foundRol.getDescripcion().equals("Test role description")
        )
        .verifyComplete();
    }
}