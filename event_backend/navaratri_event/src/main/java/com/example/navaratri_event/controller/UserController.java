package com.example.navaratri_event.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.navaratri_event.model.User;
import com.example.navaratri_event.service.OTPService;
import com.example.navaratri_event.service.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    UserService uservice;

    @Autowired
    OTPService otpService;

    // ==========================================
    // GET ALL USERS
    // ==========================================
    @GetMapping("/users")
    public List<User> getAll() {

        return uservice.getAllUsers();
    }


    // ==========================================
    // GET SINGLE USER
    // ==========================================
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getSingle(
            @PathVariable int id) {

        User user = uservice.getSingleUser(id);

        if (user == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        return ResponseEntity.ok(user);
    }


    // ==========================================
    // REGISTER USER
    // ==========================================
    @PostMapping("/users/register")
    public ResponseEntity<User> registerUser(
            @RequestBody User user) {

        User savedUser =
                uservice.addUser(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedUser);
    }


    // ==========================================
    // LOGIN USER
    // ==========================================
    @PostMapping("/users/login")
    public ResponseEntity<?> loginUser(
            @RequestBody User user) {

        User loggedInUser =
                uservice.loginUser(
                        user.getEmail(),
                        user.getPassword()
                );


        // --------------------------------------
        // INVALID EMAIL OR PASSWORD
        // --------------------------------------
        if (loggedInUser == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            Map.of(
                                    "message",
                                    "Invalid email or password"
                            )
                    );
        }


        // --------------------------------------
        // ADMIN LOGIN
        // --------------------------------------
        if ("ADMIN".equalsIgnoreCase(
                loggedInUser.getRole())) {

            try {

                // Send OTP to admin email
                otpService.sendAdminLoginOTP(
                        loggedInUser.getEmail()
                );


                return ResponseEntity.ok(
                        Map.of(
                                "requiresOtp",
                                true,

                                "email",
                                loggedInUser.getEmail(),

                                "message",
                                "OTP sent to admin email"
                        )
                );

            } catch (Exception e) {

                e.printStackTrace();

                return ResponseEntity
                        .internalServerError()
                        .body(
                                Map.of(
                                        "message",
                                        "Failed to send admin OTP"
                                )
                        );
            }
        }


        // --------------------------------------
        // NORMAL USER LOGIN
        // --------------------------------------
        return ResponseEntity.ok(
                loggedInUser
        );
    }


    // ==========================================
    // VERIFY ADMIN LOGIN OTP
    // ==========================================
    @PostMapping("/users/admin-login/verify-otp")
    public ResponseEntity<?> verifyAdminLoginOTP(
            @RequestBody Map<String, String> request) {


        String email =
                request.get("email");

        String otp =
                request.get("otp");


        // --------------------------------------
        // CHECK EMAIL AND OTP
        // --------------------------------------
        if (email == null ||
                email.trim().isEmpty() ||
                otp == null ||
                otp.trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Email and OTP are required"
                            )
                    );
        }


        // --------------------------------------
        // VERIFY OTP
        // --------------------------------------
        boolean verified =
                otpService.verifyOTP(
                        email,
                        otp
                );


        // --------------------------------------
        // INVALID OR EXPIRED OTP
        // --------------------------------------
        if (!verified) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            Map.of(
                                    "message",
                                    "Invalid or expired OTP"
                            )
                    );
        }


        // --------------------------------------
        // GET ADMIN USER
        // --------------------------------------
        User admin =
                uservice.getUserByEmail(
                        email
                );


        if (admin == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            Map.of(
                                    "message",
                                    "Admin user not found"
                            )
                    );
        }

        // --------------------------------------
        // CHECK ADMIN ROLE
        // --------------------------------------
        if (!"ADMIN".equalsIgnoreCase(
                admin.getRole())) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            Map.of(
                                    "message",
                                    "Admin access denied"
                            )
                    );
        }
        
        // --------------------------------------
        // OTP VERIFIED
        // --------------------------------------
        return ResponseEntity.ok(
                admin
        );
    }

    // ==========================================
    // DELETE USER
    // ==========================================
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(
            @PathVariable int id) {

        User user =
                uservice.getSingleUser(id);


        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            "User not found"
                    );
        }
        uservice.removeUser(id);
        return ResponseEntity.ok(
                "User Deleted Successfully"
        );
    }

    // ==========================================
    // UPDATE USER
    // ==========================================
    @PutMapping("/users/{id}")
    public ResponseEntity<User> modifyUser(
            @RequestBody User user,
            @PathVariable int id) {
        User updatedUser =
                uservice.modifyUser(
                        user,
                        id
                );

        if (updatedUser == null) {
            return ResponseEntity
                    .notFound()
                    .build();
        }
        return ResponseEntity.ok(
                updatedUser
        );
    }

    // ==========================================
    // CHANGE PASSWORD
    // ==========================================
    @PutMapping("/users/{id}/password")
    public ResponseEntity<?> changePassword(
            @PathVariable int id,
            @RequestBody String newPassword) {

        User user =
                uservice.changePassword(
                        id,
                        newPassword
                );

        if (user == null) {
            return ResponseEntity
                    .notFound()
                    .build();
        }
        return ResponseEntity.ok(
                "Password changed successfully"
        );
    }
}