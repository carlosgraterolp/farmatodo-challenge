package com.farmatodo.reto.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ProductSearchLog {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  private String term;
  private Long customerId;            // opcional
  private LocalDateTime createdAt = LocalDateTime.now();

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getTerm() {
    return term;
  }

  public void setTerm(String term) {
    this.term = term;
  }

  public Long getCustomerId() {
    return customerId;
  }

  public void setCustomerId(Long customerId) {
    this.customerId = customerId;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }
}
