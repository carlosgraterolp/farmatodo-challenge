package com.farmatodo.reto.util;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class CryptoUtil {
  public static String aesEncrypt(String plain, String secret) {
    try {
      var key = new SecretKeySpec(secret.getBytes(), "AES");
      var cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
      cipher.init(Cipher.ENCRYPT_MODE, key);
      return Base64.getEncoder().encodeToString(cipher.doFinal(plain.getBytes()));
    } catch (Exception e) { throw new RuntimeException(e); }
  }
}
