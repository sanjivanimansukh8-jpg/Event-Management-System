package com.example.navaratri_event.controller;

import com.example.navaratri_event.model.Inquiry;
import com.example.navaratri_event.repository.InquiryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inquiries")
public class InquiryController {

    @Autowired
    private InquiryRepository inquiryRepository;

    @PostMapping
    public Inquiry createInquiry(
            @RequestBody Inquiry inquiry) {

        inquiry.setStatus("Pending");

        return inquiryRepository.save(inquiry);
    }

    @GetMapping
    public List<Inquiry> getAllInquiries() {

        return inquiryRepository.findAll();
    }

    @GetMapping("/{id}")
    public Inquiry getInquiryById(
            @PathVariable Integer id) {

        return inquiryRepository
                .findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Inquiry not found"
                        )
                );
    }

    @PutMapping("/{id}/status")
    public Inquiry updateStatus(
            @PathVariable Integer id,
            @RequestParam String status) {

        Inquiry inquiry =
                inquiryRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Inquiry not found"
                                )
                        );

        inquiry.setStatus(status);

        return inquiryRepository.save(inquiry);
    }

    @DeleteMapping("/{id}")
    public void deleteInquiry(
            @PathVariable Integer id) {

        inquiryRepository.deleteById(id);
    }
    
    @PutMapping("/{id}")
    public Inquiry updateInquiry(
            @PathVariable Integer id,
            @RequestBody Inquiry inquiry) {

        Inquiry existingInquiry =
                inquiryRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Inquiry not found"));

        existingInquiry.setStatus(inquiry.getStatus());

        return inquiryRepository.save(existingInquiry);
    }
}