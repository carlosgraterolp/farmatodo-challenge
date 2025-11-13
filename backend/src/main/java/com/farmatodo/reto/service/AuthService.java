package com.farmatodo.reto.service;

import com.farmatodo.reto.dto.CustomerRegistrationRequest;
import com.farmatodo.reto.dto.CustomerResponse;
import com.farmatodo.reto.dto.LoginRequest;
import com.farmatodo.reto.entity.Customer;
import com.farmatodo.reto.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final CustomerRepository customers;

    public AuthService(CustomerRepository customers) {
        this.customers = customers;
    }

    @Transactional
    public CustomerResponse register(CustomerRegistrationRequest request) {

        if (request.firstName() == null || request.firstName().isBlank()
                || request.lastName() == null || request.lastName().isBlank()
                || request.email() == null || request.email().isBlank()
                || request.phone() == null || request.phone().isBlank()
                || request.address() == null || request.address().isBlank()
                || request.password() == null || request.password().isBlank()) {
            throw new IllegalArgumentException("Todos los campos son obligatorios.");
        }

        if (customers.existsByEmailIgnoreCase(request.email())) {
            throw new IllegalArgumentException("El correo ya está registrado.");
        }

        if (customers.existsByPhone(request.phone())) {
            throw new IllegalArgumentException("El teléfono ya está registrado.");
        }

        Customer c = new Customer();
        c.setFirstName(request.firstName().trim());
        c.setLastName(request.lastName().trim());
        c.setEmail(request.email().trim());
        c.setPhone(request.phone().trim());
        c.setAddress(request.address().trim());
        c.setPassword(request.password()); // **Reto**: texto plano

        Customer saved = customers.save(c);

        return new CustomerResponse(
                saved.getId(),
                saved.getFirstName(),
                saved.getLastName(),
                saved.getEmail(),
                saved.getPhone(),
                saved.getAddress());
    }

    @Transactional(readOnly = true)
    public CustomerResponse login(LoginRequest request) {
        if (request.email() == null || request.email().isBlank()
                || request.password() == null || request.password().isBlank()) {
            throw new IllegalArgumentException("Correo y contraseña son obligatorios.");
        }

        Customer customer = customers.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas."));

        if (!customer.getPassword().equals(request.password())) {
            throw new IllegalArgumentException("Credenciales inválidas.");
        }

        return new CustomerResponse(
                customer.getId(),
                customer.getFirstName(),
                customer.getLastName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getAddress());
    }
}
