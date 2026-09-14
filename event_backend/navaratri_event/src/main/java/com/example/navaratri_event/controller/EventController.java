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

import com.example.navaratri_event.model.Event;
import com.example.navaratri_event.service.EventService;

@RestController

public class EventController {
	
	@Autowired
	EventService eservice;
	
	//to get all events
	@GetMapping("/events") 
	public List<Event> getAll() {
		return eservice.getAllEvents();
	}
	
	// Get events by category
	@GetMapping("/events/category/{category}")
	public List<Event> getEventsByCategory(@PathVariable String category) {
	    return eservice.getEventsByCategory(category);
	}
	
	//to get single event
	@GetMapping("/events/{id}")
	public Event getSingle(@PathVariable int id) {
		return eservice.getSingleEvent(id);
	}
	
	//to add event
	@PostMapping("/events")
	public Event createEvent(@RequestBody Event event) {
		return eservice.addEvent(event);
	}
	
	@DeleteMapping("/events/{id}")
	public ResponseEntity<String> deleteEvent(@PathVariable int id) {
		eservice.deleteEvent(id);
		return ResponseEntity.ok("Event Deleted Successfully");
	}
	
	//to update event
	@PutMapping("/events/{id}")
	public Event modifyEvent(@RequestBody Event event,@PathVariable int id) {
		return eservice.modifyEvent(event, id);
	}
}