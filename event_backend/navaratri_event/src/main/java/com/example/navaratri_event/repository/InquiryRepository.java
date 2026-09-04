package com.example.navaratri_event.repository;

import com.example.navaratri_event.model.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InquiryRepository
        extends JpaRepository<Inquiry, Integer> {
}