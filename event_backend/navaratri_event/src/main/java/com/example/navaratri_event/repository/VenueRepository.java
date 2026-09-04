package com.example.navaratri_event.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.navaratri_event.model.Venue;

public interface VenueRepository extends JpaRepository<Venue, Integer> {

}