package com.farmatodo.reto.service.impl;

import com.farmatodo.reto.dto.CreateCustomerRequest;
import com.farmatodo.reto.dto.CustomerDto;
import com.farmatodo.reto.entity.Customer;
import com.farmatodo.reto.repository.CustomerRepository;
import com.farmatodo.reto.service.CustomerService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository repo;

    public CustomerServiceImpl(CustomerRepository repo) {
        this.repo = repo;
    }

    @Override
    public CustomerDto create(CreateCustomerRequest req) {
        // Unicidad por aplicación (además de la constraint en DB)
        repo.findByEmail(req.email()).ifPresent(c -> { throw new DataIntegrityViolationException("email-duplicate"); });
        if (req.phone() != null && !req.phone().isBlank()) {
            repo.findByPhone(req.phone()).ifPresent(c -> { throw new DataIntegrityViolationException("phone-duplicate"); });
        }

        Customer c = new Customer();
        c.setName(req.name());
        c.setEmail(req.email());
        c.setPhone(req.phone());
        c.setAddress(req.address());

        Customer saved = repo.save(c);
        return new CustomerDto(saved.getId(), saved.getName(), saved.getEmail(), saved.getPhone(), saved.getAddress());
    }
}
