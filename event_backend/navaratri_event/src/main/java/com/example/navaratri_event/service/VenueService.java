package com.example.navaratri_event.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.navaratri_event.model.Venue;
import com.example.navaratri_event.repository.VenueRepository;

@Service
public class VenueService {

    @Autowired
    VenueRepository venueRepository;

    public List<Venue> getAllVenues() {
        return venueRepository.findAll();
    }
    
    public Venue addVenue(Venue venue) {
        return venueRepository.save(venue);
    }

    public Venue getSingleVenue(int id) {
        return venueRepository.findById(id).orElse(null);
    }
    
    public void deleteVenue(int id) {
        venueRepository.deleteById(id);
    }

    public Venue modifyVenue(Venue venue, int id) {
        Venue existingVenue = venueRepository.findById(id).orElse(null);
        if (existingVenue != null) {
            existingVenue.setVenueName(venue.getVenueName());
            existingVenue.setLocation(venue.getLocation());
            existingVenue.setCapacity(venue.getCapacity());
            return venueRepository.save(existingVenue);
        }
        return null;
    }
}