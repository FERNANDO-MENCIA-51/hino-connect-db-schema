package pe.edu.vallegrande.ms_catalogo_vehiculos.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Vehiculo;

import java.math.BigDecimal;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebTestClient
class VehiculoControllerIntegrationTest {

    @Autowired
    private WebTestClient webTestClient;

    @Test
    void testGetAllVehiculos() {
        webTestClient
                .get()
                .uri("/api/v1/vehiculos")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.success").isEqualTo(true)
                .jsonPath("$.data").isArray();
    }

    @Test
    void testGetVehiculosPaginated() {
        webTestClient
                .get()
                .uri("/api/v1/vehiculos/paginated?page=0&size=5")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.success").isEqualTo(true)
                .jsonPath("$.data.content").isArray()
                .jsonPath("$.data.pageNumber").isEqualTo(0)
                .jsonPath("$.data.pageSize").isEqualTo(5);
    }

    @Test
    void testCreateVehiculo() {
        Vehiculo vehiculo = new Vehiculo();
        vehiculo.setCodigo("V9999");
        vehiculo.setPlaca("TEST-999");
        vehiculo.setMarca("HINO");
        vehiculo.setModelo("TEST-MODEL");
        vehiculo.setTipo("Camión");
        vehiculo.setAnioFabricacion(2024);
        vehiculo.setCapacidadCarga(new BigDecimal("15000.00"));
        vehiculo.setCombustible("Diesel");
        vehiculo.setEstadoActual("Disponible");
        vehiculo.setActivo(true);

        webTestClient
                .post()
                .uri("/api/v1/vehiculos")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(vehiculo)
                .exchange()
                .expectStatus().isCreated()
                .expectBody()
                .jsonPath("$.success").isEqualTo(true)
                .jsonPath("$.data.placa").isEqualTo("TEST-999");
    }

    @Test
    void testGetVehiculosByEstado() {
        webTestClient
                .get()
                .uri("/api/v1/vehiculos/estado/Disponible")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.success").isEqualTo(true)
                .jsonPath("$.data").isArray();
    }
}