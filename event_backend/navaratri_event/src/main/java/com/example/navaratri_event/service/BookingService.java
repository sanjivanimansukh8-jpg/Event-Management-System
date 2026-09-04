
package com.example.navaratri_event.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.navaratri_event.model.Booking;
import com.example.navaratri_event.repository.BookingRepository;

@Service
public class BookingService {

    @Autowired
    BookingRepository brepo;

    public Booking addBooking(Booking booking) {

        return brepo.save(booking);
    }

    public List<Booking> getAllBookings() {

        return brepo.findAll();
    }
    
    public Booking getSingleBooking(int id) {

        return brepo.findById(id)
                .orElse(null);
    }
    
    public String removeBooking(int id) {

        if (!brepo.existsById(id)) {

            return "Booking not found";
        }

        brepo.deleteById(id);

        return "Booking Deleted Successfully";
    }
    
    public Booking modifyBooking(
            Booking booking,
            int id) {

        booking.setBookingId(id);

        return brepo.save(booking);
    }
}

