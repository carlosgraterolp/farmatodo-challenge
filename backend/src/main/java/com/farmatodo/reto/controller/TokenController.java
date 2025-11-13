package com.farmatodo.reto.controller;

import com.farmatodo.reto.dto.TokenizeRequest;
import com.farmatodo.reto.dto.TokenizeResponse;
import com.farmatodo.reto.service.TokenizationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tokens")
public class TokenController {

  private final TokenizationService service;

  public TokenController(TokenizationService service) { this.service = service; }

  @PostMapping
  public ResponseEntity<TokenizeResponse> create(@RequestBody @Valid TokenizeRequest req) {
    return ResponseEntity.status(HttpStatus.CREATED).body(service.tokenize(req));
  }
}
