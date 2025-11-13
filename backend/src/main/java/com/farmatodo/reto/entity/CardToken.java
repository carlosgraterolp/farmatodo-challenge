package com.farmatodo.reto.entity;

import jakarta.persistence.*;

@Entity
@Table(name="card_tokens", indexes = @Index(name="idx_card_token_token", columnList="token"))
public class CardToken {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @Column(nullable=false) private Long customerId;
  @Column(nullable=false, unique=true, length=60) private String token;        // UUID recortado/normal
  @Column(nullable=false, length=512) private String encryptedData;            // num+cvv+exp cifrados

  // getters/setters
  public Long getId(){return id;} public void setId(Long id){this.id=id;}
  public Long getCustomerId(){return customerId;} public void setCustomerId(Long c){this.customerId=c;}
  public String getToken(){return token;} public void setToken(String t){this.token=t;}
  public String getEncryptedData(){return encryptedData;} public void setEncryptedData(String e){this.encryptedData=e;}
}
