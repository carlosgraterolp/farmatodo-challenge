package com.farmatodo.reto.service.impl;

import com.farmatodo.reto.dto.TokenizeRequest;
import com.farmatodo.reto.dto.TokenizeResponse;
import com.farmatodo.reto.entity.CardToken;
import com.farmatodo.reto.repository.CardTokenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TokenizationServiceImplTest {

    @Mock
    private CardTokenRepository cardTokenRepository;

    @InjectMocks
    private TokenizationServiceImpl tokenizationService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(tokenizationService, "rejectionPct", 0);
        ReflectionTestUtils.setField(tokenizationService, "secret", "1234567890123456");
    }

    @Test
    void tokenize_whenSuccessful_shouldReturnToken() {
        // Arrange
        TokenizeRequest request = new TokenizeRequest(1L, "4111111111111111", "123", "12/25");
        when(cardTokenRepository.save(any(CardToken.class))).thenReturn(new CardToken());

        // Act
        TokenizeResponse response = tokenizationService.tokenize(request);

        // Assert
        assertNotNull(response);
        assertNotNull(response.token());
        verify(cardTokenRepository, times(1)).save(any(CardToken.class));
    }

    @Test
    void tokenize_shouldEncryptCardData() {
        // Arrange
        TokenizeRequest request = new TokenizeRequest(1L, "4111111111111111", "123", "12/25");
        when(cardTokenRepository.save(any(CardToken.class))).thenReturn(new CardToken());

        // Act
        tokenizationService.tokenize(request);

        // Assert
        ArgumentCaptor<CardToken> captor = ArgumentCaptor.forClass(CardToken.class);
        verify(cardTokenRepository).save(captor.capture());
        
        CardToken savedToken = captor.getValue();
        assertNotNull(savedToken.getEncryptedData());
        assertNotEquals("4111111111111111|123|12/25", savedToken.getEncryptedData());
    }

    @Test
    void tokenize_shouldSaveCustomerId() {
        // Arrange
        TokenizeRequest request = new TokenizeRequest(42L, "4111111111111111", "123", "12/25");
        when(cardTokenRepository.save(any(CardToken.class))).thenReturn(new CardToken());

        // Act
        tokenizationService.tokenize(request);

        // Assert
        ArgumentCaptor<CardToken> captor = ArgumentCaptor.forClass(CardToken.class);
        verify(cardTokenRepository).save(captor.capture());
        
        CardToken savedToken = captor.getValue();
        assertEquals(42L, savedToken.getCustomerId());
    }

    @Test
    void tokenize_whenRejectionConfigured_mayThrowException() {
        // Arrange
        ReflectionTestUtils.setField(tokenizationService, "rejectionPct", 100);
        TokenizeRequest request = new TokenizeRequest(1L, "4111111111111111", "123", "12/25");

        // Act & Assert
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> tokenizationService.tokenize(request)
        );
        assertEquals("tokenization-rejected", exception.getMessage());
        verify(cardTokenRepository, never()).save(any(CardToken.class));
    }

    @Test
    void tokenize_shouldGenerateUniqueTokens() {
        // Arrange
        TokenizeRequest request1 = new TokenizeRequest(1L, "4111111111111111", "123", "12/25");
        TokenizeRequest request2 = new TokenizeRequest(1L, "4111111111111111", "123", "12/25");
        when(cardTokenRepository.save(any(CardToken.class))).thenReturn(new CardToken());

        // Act
        TokenizeResponse response1 = tokenizationService.tokenize(request1);
        TokenizeResponse response2 = tokenizationService.tokenize(request2);

        // Assert
        assertNotEquals(response1.token(), response2.token());
    }
}
