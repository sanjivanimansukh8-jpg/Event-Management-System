package com.example.navaratri_event.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.navaratri_event.model.User;
import com.example.navaratri_event.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    

    @Autowired 
    private PasswordEncoder passwordEncoder;
    
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }

    // GET SINGLE USER
    public User getSingleUser(int id) {

        return userRepository.findById((int) id)
                .orElse(null);
    }

    // REGISTER USER
    public User addUser(User user) {

        // Check if email already exists
        User existingUser =
                userRepository.findByEmail(user.getEmail());

        if (existingUser != null) {
            throw new RuntimeException(
                    "Email already registered"
            );
        }

        // Set default role
        if (user.getRole() == null ||
                user.getRole().isEmpty()) {

            user.setRole("USER");
        }

        // Encrypt password
        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        return userRepository.save(user);
    }

    // LOGIN USER
    public User loginUser(
            String email,
            String password) {

        User user =
                userRepository.findByEmail(email);

        // Email not found
        if (user == null) {
            return null;
        }

        // Check BCrypt password
        boolean passwordMatches =
                passwordEncoder.matches(
                        password,
                        user.getPassword()
                );

        if (!passwordMatches) {
            return null;
        }

        return user;
    }
    
    // DELETE USER
    public void removeUser(int id) {

        userRepository.deleteById((int) id);
    }

    // UPDATE USER
    public User modifyUser(
            User user,
            int id) {

        User existingUser =
                userRepository.findById((int) id)
                        .orElse(null);

        if (existingUser == null) {
            return null;
        }

        existingUser.setName(user.getName());
        existingUser.setEmail(user.getEmail());
        existingUser.setPhone(user.getPhone());

        // Password is not changed here
        return userRepository.save(existingUser);
    }

    // CHANGE PASSWORD
    public User changePassword(
            int id,
            String newPassword) {

        User user =
                userRepository.findById((int) id)
                        .orElse(null);

        if (user == null) {
            return null;
        }

        // Remove spaces
        newPassword = newPassword.trim();

        // If frontend sends JSON string like "password"
        if (newPassword.startsWith("\"") &&
                newPassword.endsWith("\"")) {

            newPassword = newPassword.substring(
                    1,
                    newPassword.length() - 1
            );
        }

        // Encrypt new password
        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        return userRepository.save(user);
    }
}