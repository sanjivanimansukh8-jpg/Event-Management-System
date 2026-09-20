package com.example.navaratri_event.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.navaratri_event.model.Booking;
import com.example.navaratri_event.service.BookingService;

@RestController
public class BookingController {

    @Autowired
    BookingService bservice;

    @GetMapping("/bookings")
    public List<Booking> getAll() {

        return bservice.getAllBookings();
    }

    @GetMapping("/bookings/{id}")
    public ResponseEntity<Booking> getSingle(
            @PathVariable int id) {

        Booking booking =
                bservice.getSingleBooking(id);

        if (booking == null) {

            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(booking);
    }

    @PostMapping("/bookings")
    public Booking createBooking(
            @RequestBody Booking booking) {

        return bservice.addBooking(booking);
    }

    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<String> deleteBooking(
            @PathVariable int id) {

        String result =
                bservice.removeBooking(id);

        return ResponseEntity.ok(result);
    }

    @PutMapping("/bookings/{id}")
    public Booking modifyBooking(
            @RequestBody Booking booking,
            @PathVariable int id) {

        return bservice.modifyBooking(
                booking,
                id
        );
    }
}