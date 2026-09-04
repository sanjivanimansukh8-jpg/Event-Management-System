package com.example.navaratri_event.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.navaratri_event.model.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking,Integer>{

}
