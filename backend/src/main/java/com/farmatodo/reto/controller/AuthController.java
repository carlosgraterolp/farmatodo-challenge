package com.farmatodo.reto.controller;

import com.farmatodo.reto.dto.CustomerRegistrationRequest;
import com.farmatodo.reto.dto.CustomerResponse;
import com.farmatodo.reto.dto.LoginRequest;
import com.farmatodo.reto.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin // por si accedes desde localhost:3000
public class AuthController {

    private final AuthService auth;

    public AuthController(AuthService auth) {
        this.auth = auth;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody CustomerRegistrationRequest request) {
        try {
            CustomerResponse response = auth.register(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(
                    new ErrorMessage(ex.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            CustomerResponse response = auth.login(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(
                    new ErrorMessage(ex.getMessage()));
        }
    }

    public record ErrorMessage(String message) {
    }
}
