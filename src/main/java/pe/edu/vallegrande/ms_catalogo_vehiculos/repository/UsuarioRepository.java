package pe.edu.vallegrande.ms_catalogo_vehiculos.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Usuario;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface UsuarioRepository extends R2dbcRepository<Usuario, Integer> {
    
    @Query("SELECT * FROM usuarios WHERE deleted_at IS NULL")
    Flux<Usuario> findAllActive();
    
    @Query("SELECT * FROM usuarios WHERE id = :id AND deleted_at IS NULL")
    Mono<Usuario> findByIdActive(Integer id);
    
    @Query("SELECT * FROM usuarios WHERE email = :email AND deleted_at IS NULL")
    Mono<Usuario> findByEmail(String email);
}
