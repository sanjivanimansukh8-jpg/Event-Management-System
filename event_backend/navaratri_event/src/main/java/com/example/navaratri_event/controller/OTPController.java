package com.example.navaratri_event.controller;

import com.example.navaratri_event.service.OTPService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/otp")
@CrossOrigin(origins = "http://localhost:5173")
public class OTPController {

    @Autowired
    OTPService otpService;

    // Send OTP
    @PostMapping("/send")
    public ResponseEntity<?> sendOTP(
            @RequestBody Map<String, String> request) {

        String email = request.get("email");

        if (email == null || email.trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Email is required"
                    ));
        }

        try {

            otpService.sendOTP(email);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "OTP sent successfully"
                    )
            );

        } catch (Exception e) {
        	e.printStackTrace();
            return ResponseEntity
                    .internalServerError()
                    .body(Map.of(
                            "message",
                            "Failed to send OTP"
                    ));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyOTP(
            @RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        if (email == null || otp == null) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Email and OTP are required"
                    ));
        }

        boolean verified =
                otpService.verifyOTP(email, otp);

        if (verified) {
            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "OTP verified successfully",
                            "verified",
                            true
                    )
            );
        }

        return ResponseEntity
                .badRequest()
                .body(Map.of(
                        "message",
                        "Invalid or expired OTP",
                        "verified",
                        false
                ));
    }
}