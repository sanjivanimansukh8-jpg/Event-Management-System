package com.example.navaratri_event.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.example.navaratri_event.model.OTP;

public interface OTPRepository extends JpaRepository<OTP, Integer> {

    Optional<OTP> findTopByEmailOrderByIDDesc(String email);

    @Modifying
    @Transactional
    @Query("DELETE FROM OTP o WHERE o.email = :email")
    void deleteByEmail(String email);
}