package pe.edu.vallegrande.ms_catalogo_vehiculos.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import pe.edu.vallegrande.ms_catalogo_vehiculos.model.Usuario;
import pe.edu.vallegrande.ms_catalogo_vehiculos.repository.UsuarioRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public Flux<Usuario> findAll() {
        return repository.findAllActive();
    }

    public Mono<Usuario> findById(Integer id) {
        return repository.findByIdActive(id);
    }

    public Mono<Usuario> findByEmail(String email) {
        return repository.findByEmail(email);
    }

    public Mono<Usuario> create(Usuario usuario) {
        usuario.setPasswordHash(passwordEncoder.encode(usuario.getPasswordHash()));
        usuario.setCreatedAt(LocalDateTime.now());
        usuario.setUpdatedAt(LocalDateTime.now());
        return repository.save(usuario);
    }

    public Mono<Usuario> update(Integer id, Usuario usuario) {
        return repository.findByIdActive(id)
                .flatMap(existing -> {
                    usuario.setId(id);
                    usuario.setCreatedAt(existing.getCreatedAt());
                    usuario.setUpdatedAt(LocalDateTime.now());
                    if (usuario.getPasswordHash() != null && !usuario.getPasswordHash().isEmpty()) {
                        usuario.setPasswordHash(passwordEncoder.encode(usuario.getPasswordHash()));
                    } else {
                        usuario.setPasswordHash(existing.getPasswordHash());
                    }
                    return repository.save(usuario);
                });
    }

    public Mono<Void> delete(Integer id) {
        return repository.findByIdActive(id)
                .flatMap(usuario -> {
                    usuario.setDeletedAt(LocalDateTime.now());
                    return repository.save(usuario);
                })
                .then();
    }

    public Mono<Void> restore(Integer id) {
        return repository.findByIdInactive(id)
                .flatMap(usuario -> {
                    usuario.setDeletedAt(null);
                    return repository.save(usuario);
                })
                .then();
    }

    public Mono<Boolean> validatePassword(String rawPassword, String encodedPassword) {
        return Mono.just(passwordEncoder.matches(rawPassword, encodedPassword));
    }

    public Mono<Void> updateUltimoLogin(Integer id) {
        return repository.findById(id)
                .flatMap(usuario -> {
                    usuario.setUltimoLogin(LocalDateTime.now());
                    return repository.save(usuario);
                })
                .then();
    }
}
