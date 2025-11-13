package com.farmatodo.reto.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TokenizeRequest(
  @NotNull Long customerId,
  @NotBlank String cardNumber,
  @NotBlank String cvv,
  @NotBlank String expDate
) {}
