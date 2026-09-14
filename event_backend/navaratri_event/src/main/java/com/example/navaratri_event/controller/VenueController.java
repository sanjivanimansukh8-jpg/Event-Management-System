package com.example.navaratri_event.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.navaratri_event.model.Venue;
import com.example.navaratri_event.service.VenueService;

@RestController
public class VenueController {

    @Autowired
    VenueService vservice;

    @GetMapping("/venues")
    public List<Venue> getAll() {
        return vservice.getAllVenues();
    }

    @GetMapping("/venues/{id}")
    public Venue getSingle(@PathVariable int id) {
        return vservice.getSingleVenue(id);
    }

    @PostMapping("/venues")
    public Venue createVenue(@RequestBody Venue venue) {
        return vservice.addVenue(venue);
    }

    @DeleteMapping("/venues/{id}")
    public ResponseEntity<String> deleteVenue(@PathVariable int id) {

        vservice.deleteVenue(id);

        return ResponseEntity.ok("Venue Deleted Successfully");
    }

    @PutMapping("/venues/{id}")
    public Venue modifyVenue(
            @RequestBody Venue venue,
            @PathVariable int id) {

        return vservice.modifyVenue(venue, id);
    }
}