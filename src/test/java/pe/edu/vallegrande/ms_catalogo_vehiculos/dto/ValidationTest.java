package pe.edu.vallegrande.ms_catalogo_vehiculos.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class ValidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testVehiculoRequestValidation() {
        // Valid VehiculoRequest
        VehiculoRequest validRequest = new VehiculoRequest();
        validRequest.setCodigo("V0001");
        validRequest.setPlaca("ABC-123");
        validRequest.setMarca("HINO");
        validRequest.setModelo("GH-300");
        validRequest.setTipo("Camión");
        validRequest.setAnioFabricacion(2023);
        validRequest.setCapacidadCarga(new BigDecimal("15000.00"));
        validRequest.setCombustible("Diesel");
        validRequest.setEstadoActual("En operación");

        Set<ConstraintViolation<VehiculoRequest>> violations = validator.validate(validRequest);
        assertTrue(violations.isEmpty());
    }

    @Test
    void testVehiculoRequestInvalidPlaca() {
        VehiculoRequest invalidRequest = new VehiculoRequest();
        invalidRequest.setCodigo("V0001");
        invalidRequest.setPlaca("INVALID"); // Invalid format
        invalidRequest.setMarca("HINO");
        invalidRequest.setModelo("GH-300");

        Set<ConstraintViolation<VehiculoRequest>> violations = validator.validate(invalidRequest);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("formato ABC-123")));
    }

    @Test
    void testUsuarioRequestValidation() {
        // Valid UsuarioRequest
        UsuarioRequest validRequest = new UsuarioRequest();
        validRequest.setEmail("test@hinoconnect.com");
        validRequest.setPassword("Password123");
        validRequest.setNombre("Test");
        validRequest.setApellido("User");
        validRequest.setTelefono("+51987654321");
        validRequest.setRolId(1);

        Set<ConstraintViolation<UsuarioRequest>> violations = validator.validate(validRequest);
        assertTrue(violations.isEmpty());
    }

    @Test
    void testUsuarioRequestInvalidEmail() {
        UsuarioRequest invalidRequest = new UsuarioRequest();
        invalidRequest.setEmail("invalid-email"); // Invalid format
        invalidRequest.setPassword("Password123");
        invalidRequest.setNombre("Test");
        invalidRequest.setApellido("User");
        invalidRequest.setRolId(1);

        Set<ConstraintViolation<UsuarioRequest>> violations = validator.validate(invalidRequest);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getMessage().contains("Email inválido")));
    }

    @Test
    void testUsuarioRequestWeakPassword() {
        UsuarioRequest invalidRequest = new UsuarioRequest();
        invalidRequest.setEmail("test@hinoconnect.com");
        invalidRequest.setPassword("weak"); // Too weak
        invalidRequest.setNombre("Test");
        invalidRequest.setApellido("User");
        invalidRequest.setRolId(1);

        Set<ConstraintViolation<UsuarioRequest>> violations = validator.validate(invalidRequest);
        assertFalse(violations.isEmpty());
    }

    @Test
    void testLoginRequestValidation() {
        // Valid LoginRequest
        LoginRequest validRequest = new LoginRequest();
        validRequest.setEmail("admin@hinoconnect.com");
        validRequest.setPassword("admin123");

        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(validRequest);
        assertTrue(violations.isEmpty());
    }

    @Test
    void testLoginRequestEmptyFields() {
        LoginRequest invalidRequest = new LoginRequest();
        invalidRequest.setEmail("");
        invalidRequest.setPassword("");

        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(invalidRequest);
        assertEquals(2, violations.size()); // Email and password both invalid
    }
}