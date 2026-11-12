package com.example.foodsharing.user;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;

    public AuthController(
            UserRepository users,
            PasswordEncoder encoder,
            AuthenticationManager authenticationManager) {
        this.users = users;
        this.encoder = encoder;
        this.authenticationManager = authenticationManager;
    }

    public record RegisterRequest(
            @NotBlank @Size(min = 3, max = 100) String username,
            @NotBlank @Email @Size(max = 150) String email,
            @NotBlank @Size(min = 8, max = 72) String password) {}

    public record LoginRequest(
            @NotBlank String username,
            @NotBlank String password) {}

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request) {

        String username = request.username().trim();
        String email = request.email().trim().toLowerCase();

        if (users.existsByUsername(username)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Username already exists"));
        }

        if (users.existsByEmail(email)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email already exists"));
        }

        AppUser user = new AppUser();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(encoder.encode(request.password()));
        user.setRole("USER");

        users.save(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message",
                        "Registration successful. Please log in."));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {

        try {
            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    request.username(),
                                    request.password()));

            SecurityContext context =
                    SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);

            HttpSession session = httpRequest.getSession(true);
            session.setAttribute(
                    HttpSessionSecurityContextRepository
                            .SPRING_SECURITY_CONTEXT_KEY,
                    context);

            AppUser user = users.findByUsername(
                    authentication.getName()).orElseThrow();

            return ResponseEntity.ok(Map.of(
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "role", user.getRole()));

        } catch (org.springframework.security.core.AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error",
                            "Invalid username or password"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        AppUser user = users.findByUsername(
                authentication.getName()).orElseThrow();

        return ResponseEntity.ok(Map.of(
                "username", user.getUsername(),
                "email", user.getEmail(),
                "role", user.getRole()));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        SecurityContextHolder.clearContext();

        return ResponseEntity.ok(
                Map.of("message", "Logged out successfully"));
    }
}