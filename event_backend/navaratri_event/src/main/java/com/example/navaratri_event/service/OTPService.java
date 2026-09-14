package com.example.navaratri_event.service;

import com.example.navaratri_event.model.OTP;
import com.example.navaratri_event.repository.OTPRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OTPService {

    @Autowired
    OTPRepository otpRepository;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public String generateOTP() {
        Random random = new Random();
        int number = 100000 + random.nextInt(900000);
        return String.valueOf(number);
    }

    public void sendOTP(String email) {

        otpRepository.deleteByEmail(email);

        String otpCode = generateOTP();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(5);

        OTP otp = new OTP(email, otpCode, expiryTime);
        otpRepository.save(otp);

        String apiKey = System.getenv("RESEND_API_KEY");

        if (apiKey == null || apiKey.isEmpty()) {
            throw new RuntimeException("RESEND_API_KEY is not configured");
        }

        String jsonBody =
                "{"
                + "\"from\":\"onboarding@resend.dev\","
                + "\"to\":[\"" + email + "\"],"
                + "\"subject\":\"Navaratri Event Management - Email Verification OTP\","
                + "\"text\":\"Hello,\\n\\n"
                + "Your OTP for email verification is: " + otpCode
                + "\\n\\nThis OTP is valid for 5 minutes."
                + "\\n\\nPlease do not share this OTP with anyone."
                + "\\n\\nThank you,\\nNavaratri Event Management\""
                + "}";

        try {

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response =
                    httpClient.send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );

            if (response.statusCode() < 200 ||
                response.statusCode() >= 300) {

                throw new RuntimeException(
                        "Resend email failed: "
                        + response.body()
                );
            }

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to send OTP email",
                    e
            );
        }
    }

    public void sendAdminLoginOTP(String email) {

        otpRepository.deleteByEmail(email);

        String otpCode = generateOTP();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(5);

        OTP otp = new OTP(email, otpCode, expiryTime);
        otpRepository.save(otp);

        String apiKey = System.getenv("RESEND_API_KEY");

        if (apiKey == null || apiKey.isEmpty()) {
            throw new RuntimeException("RESEND_API_KEY is not configured");
        }

        String jsonBody =
                "{"
                + "\"from\":\"onboarding@resend.dev\","
                + "\"to\":[\"" + email + "\"],"
                + "\"subject\":\"EventHub - Admin Login OTP\","
                + "\"text\":\"Hello,\\n\\n"
                + "Your OTP for Admin Login is: " + otpCode
                + "\\n\\nThis OTP is valid for 5 minutes."
                + "\\n\\nPlease do not share this OTP with anyone."
                + "\\n\\nThank you,\\nEventHub\""
                + "}";

        try {

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response =
                    httpClient.send(
                            request,
                            HttpResponse.BodyHandlers.ofString()
                    );

            if (response.statusCode() < 200 ||
                response.statusCode() >= 300) {

                throw new RuntimeException(
                        "Resend email failed: "
                        + response.body()
                );
            }

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to send admin OTP email",
                    e
            );
        }
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