package com.farmatodo.reto.dto;

public record CustomerRegistrationRequest(
        String firstName,
        String lastName,
        String email,
        String phone,
        String address,
        String password) {
}
