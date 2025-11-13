package com.farmatodo.reto.service;

import com.farmatodo.reto.dto.TokenizeRequest;
import com.farmatodo.reto.dto.TokenizeResponse;

public interface TokenizationService {
  TokenizeResponse tokenize(TokenizeRequest req);
}
