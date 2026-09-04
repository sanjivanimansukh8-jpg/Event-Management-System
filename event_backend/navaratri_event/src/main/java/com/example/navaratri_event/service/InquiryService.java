package com.example.navaratri_event.service;

import com.example.navaratri_event.model.Inquiry;
import com.example.navaratri_event.repository.InquiryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InquiryService {

    @Autowired
    private InquiryRepository inquiryRepository;

    // Create Inquiry
    public Inquiry createInquiry(Inquiry inquiry) {

        inquiry.setStatus("Pending");

        return inquiryRepository.save(inquiry);
    }

    // Get all inquiries
    public List<Inquiry> getAllInquiries() {

        return inquiryRepository.findAll();
    }

    // Get inquiry by ID
    public Inquiry getInquiryById(Integer id) {

        return inquiryRepository
                .findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Inquiry not found with id: " + id
                        )
                );
    }

    // Update inquiry status
    public Inquiry updateStatus(
            Integer id,
            String status) {

        Inquiry inquiry = getInquiryById(id);

        inquiry.setStatus(status);

        return inquiryRepository.save(inquiry);
    }

    // Delete inquiry
    public void deleteInquiry(Integer id) {

        if (!inquiryRepository.existsById(id)) {

            throw new RuntimeException(
                    "Inquiry not found with id: " + id
            );
        }

        inquiryRepository.deleteById(id);
    }
}