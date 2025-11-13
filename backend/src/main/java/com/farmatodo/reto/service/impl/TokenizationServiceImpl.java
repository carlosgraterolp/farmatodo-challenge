package com.farmatodo.reto.service.impl;

import com.farmatodo.reto.dto.TokenizeRequest;
import com.farmatodo.reto.dto.TokenizeResponse;
import com.farmatodo.reto.entity.CardToken;
import com.farmatodo.reto.repository.CardTokenRepository;
import com.farmatodo.reto.service.TokenizationService;
import com.farmatodo.reto.util.CryptoUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.UUID;

@Service
public class TokenizationServiceImpl implements TokenizationService {

  private final CardTokenRepository repo;
  private final Random random = new Random();

  @Value("${tokenization.rejection-percentage:20}")
  private int rejectionPct;

  @Value("${encryption.secret}")
  private String secret;

  public TokenizationServiceImpl(CardTokenRepository repo) { this.repo = repo; }

  @Override
  public TokenizeResponse tokenize(TokenizeRequest req) {
    int r = random.nextInt(100);            // 0..99
    if (r < rejectionPct) {                 // % rechazo configurable
      throw new IllegalArgumentException("tokenization-rejected");
    }

    String data = req.cardNumber()+"|"+req.cvv()+"|"+req.expDate();
    String enc = CryptoUtil.aesEncrypt(data, secret);
    String token = UUID.randomUUID().toString();

    CardToken ct = new CardToken();
    ct.setCustomerId(req.customerId());
    ct.setToken(token);
    ct.setEncryptedData(enc);
    repo.save(ct);

    return new TokenizeResponse(token);
  }
}
