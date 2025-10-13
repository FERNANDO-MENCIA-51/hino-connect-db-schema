package pe.edu.vallegrande.ms_catalogo_vehiculos.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import pe.edu.vallegrande.ms_catalogo_vehiculos.security.JwtUtil;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ConfigurationTest {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JwtProperties jwtProperties;

    @Test
    void testPasswordEncoderConfiguration() {
        assertNotNull(passwordEncoder);
        
        String rawPassword = "testPassword123";
        String encodedPassword = passwordEncoder.encode(rawPassword);
        
        assertNotNull(encodedPassword);
        assertNotEquals(rawPassword, encodedPassword);
        assertTrue(passwordEncoder.matches(rawPassword, encodedPassword));
    }

    @Test
    void testJwtUtilConfiguration() {
        assertNotNull(jwtUtil);
        
        String token = jwtUtil.generateToken("test@example.com", "Test User", "ADMIN");
        
        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(token.startsWith("eyJ")); // JWT format
    }

    @Test
    void testJwtPropertiesConfiguration() {
        assertNotNull(jwtProperties);
        assertNotNull(jwtProperties.getSecret());
        assertNotNull(jwtProperties.getExpiration());
        assertTrue(jwtProperties.getExpiration() > 0);
    }

    @Test
    void testJwtTokenValidation() {
        String email = "test@example.com";
        String token = jwtUtil.generateToken(email, "Test User", "ADMIN");
        
        String extractedEmail = jwtUtil.extractEmail(token);
        assertEquals(email, extractedEmail);
        
        assertTrue(jwtUtil.validateToken(token, email));
        assertFalse(jwtUtil.validateToken(token, "different@email.com"));
    }
}