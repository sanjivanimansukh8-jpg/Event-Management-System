package com.example.navaratri_event.service;

import com.example.navaratri_event.model.OTP;
import com.example.navaratri_event.repository.OTPRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OTPService {

    @Autowired
    OTPRepository otpRepository;

    @Autowired
    JavaMailSender mailSender;

    // Generate 6 digit OTP
    public String generateOTP() {
        Random random = new Random();
        int number = 100000 + random.nextInt(900000);
        return String.valueOf(number);
    }

    public void sendOTP(String email) {
        otpRepository.deleteByEmail(email);
        String otpCode = generateOTP();
        LocalDateTime expiryTime =
                LocalDateTime.now().plusMinutes(5);

        OTP otp = new OTP(
                email,
                otpCode,
                expiryTime
        );

        otpRepository.save(otp);

        SimpleMailMessage message =
                new SimpleMailMessage();
        message.setTo(email);
        message.setSubject(
                "Navaratri Event Management - Email Verification OTP"
        );

        message.setText(
                "Hello,\n\n"
                + "Your OTP for email verification is: "
                + otpCode
                + "\n\n"
                + "This OTP is valid for 5 minutes.\n\n"
                + "Please do not share this OTP with anyone.\n\n"
                + "Thank you,\n"
                + "Navaratri Event Management"
        );
        mailSender.send(message);
    }
    
 // Send OTP for Admin Login
    public void sendAdminLoginOTP(String email) {

        otpRepository.deleteByEmail(email);

        String otpCode = generateOTP();

        LocalDateTime expiryTime =
                LocalDateTime.now().plusMinutes(5);

        OTP otp = new OTP(
                email,
                otpCode,
                expiryTime
        );

        otpRepository.save(otp);

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);

        message.setSubject(
                "EventHub - Admin Login OTP"
        );

        message.setText(
                "Hello,\n\n"
                + "Your OTP for Admin Login is: "
                + otpCode
                + "\n\n"
                + "This OTP is valid for 5 minutes.\n\n"
                + "Please do not share this OTP with anyone.\n\n"
                + "Thank you,\n"
                + "EventHub"
        );

        mailSender.send(message);
    }
    
    public boolean verifyOTP(String email, String enteredOTP) {
        Optional<OTP> otpOptional =
                otpRepository.findTopByEmailOrderByIDDesc(email);

        if (otpOptional.isEmpty()) {
            return false;
        }
        OTP otp = otpOptional.get();

        if (LocalDateTime.now().isAfter(otp.getExpiryTime())) {
            otpRepository.delete(otp);
            return false;
        }

        if (otp.getOtp().equals(enteredOTP)) {
            otpRepository.delete(otp);
            return true;
        }
        return false;
    }
}