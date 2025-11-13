package com.farmatodo.reto.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CryptoUtilTest {

    @Test
    void aesEncrypt_shouldEncryptData() {
        // Arrange
        String plain = "sensitive-data";
        String secret = "1234567890123456"; // 16 chars for AES-128

        // Act
        String encrypted = CryptoUtil.aesEncrypt(plain, secret);

        // Assert
        assertNotNull(encrypted);
        assertNotEquals(plain, encrypted);
    }

    @Test
    void aesEncrypt_shouldReturnDifferentOutputForDifferentInput() {
        // Arrange
        String plain1 = "data1";
        String plain2 = "data2";
        String secret = "1234567890123456";

        // Act
        String encrypted1 = CryptoUtil.aesEncrypt(plain1, secret);
        String encrypted2 = CryptoUtil.aesEncrypt(plain2, secret);

        // Assert
        assertNotEquals(encrypted1, encrypted2);
    }

    @Test
    void aesEncrypt_shouldReturnConsistentOutputForSameInput() {
        // Arrange
        String plain = "consistent-data";
        String secret = "1234567890123456";

        // Act
        String encrypted1 = CryptoUtil.aesEncrypt(plain, secret);
        String encrypted2 = CryptoUtil.aesEncrypt(plain, secret);

        // Assert
        assertEquals(encrypted1, encrypted2);
    }

    @Test
    void aesEncrypt_shouldReturnBase64EncodedString() {
        // Arrange
        String plain = "test-data";
        String secret = "1234567890123456";

        // Act
        String encrypted = CryptoUtil.aesEncrypt(plain, secret);

        // Assert
        assertTrue(encrypted.matches("^[A-Za-z0-9+/=]+$"));
    }

    @Test
    void aesEncrypt_withInvalidSecret_shouldThrowException() {
        // Arrange
        String plain = "data";
        String invalidSecret = "short"; // Too short for AES

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            CryptoUtil.aesEncrypt(plain, invalidSecret);
        });
    }
}
