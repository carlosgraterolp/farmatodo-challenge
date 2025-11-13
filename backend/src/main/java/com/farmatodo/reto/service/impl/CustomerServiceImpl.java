package com.farmatodo.reto.service.impl;

import com.farmatodo.reto.dto.CreateCustomerRequest;
import com.farmatodo.reto.dto.CustomerDto;
import com.farmatodo.reto.entity.Customer;
import com.farmatodo.reto.repository.CustomerRepository;
import com.farmatodo.reto.service.CustomerService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository repo;

    public CustomerServiceImpl(CustomerRepository repo) {
        this.repo = repo;
    }

    @Override
    @Transactional
    public CustomerDto create(CreateCustomerRequest req) {
        // Unicidad por aplicación (además de la constraint en DB)
        if (repo.existsByEmailIgnoreCase(req.email())) {
            throw new DataIntegrityViolationException("email-duplicate");
        }
        if (req.phone() != null && !req.phone().isBlank()) {
            if (repo.existsByPhone(req.phone())) {
                throw new DataIntegrityViolationException("phone-duplicate");
            }
        }

        // Split name into firstName and lastName
        String[] nameParts = req.name().trim().split("\\s+", 2);
        String firstName = nameParts[0];
        String lastName = nameParts.length > 1 ? nameParts[1] : "";

        Customer c = new Customer();
        c.setFirstName(firstName);
        c.setLastName(lastName);
        c.setEmail(req.email().trim());
        c.setPhone(req.phone() != null ? req.phone().trim() : "");
        c.setAddress(req.address() != null ? req.address().trim() : "");
        // Set a default password since it's required but not in CreateCustomerRequest
        // In a real scenario, this should be handled differently (e.g., generate temp
        // password)
        c.setPassword("CHANGE_ME");

        Customer saved = repo.save(c);
        // Combine firstName and lastName for the DTO
        String fullName = saved.getFirstName() + (saved.getLastName() != null && !saved.getLastName().isBlank()
                ? " " + saved.getLastName()
                : "");
        return new CustomerDto(saved.getId(), fullName, saved.getEmail(), saved.getPhone(), saved.getAddress());
    }
}
