package com.example.navaratri_event.repository;

import com.example.navaratri_event.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
}