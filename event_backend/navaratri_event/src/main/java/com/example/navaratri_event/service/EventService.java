package com.example.navaratri_event.service;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.navaratri_event.model.Event;
import com.example.navaratri_event.repository.EventRepository;


@Service
public class EventService {
	@Autowired
	EventRepository erepo;
	
	//Add Event
	public Event addEvent(Event event) {
		return erepo.save(event);
	}
	
	//Get All Events
	public List<Event> getAllEvents() {
		return erepo.findAll();
	}
	
	//Get Events by Category
	public List<Event> getEventsByCategory(String category) {
		return erepo.findByCategoryIgnoreCase(category);
	}
	
	//Get Single Event by id
	public Event getSingleEvent(int id) {
		return erepo.findById(id).get();
	}
	
	//Delete Event
	public void  deleteEvent(int id) {
		if(!erepo.existsById(id)) {
			throw new RuntimeException("Event not found");
		}
		erepo.deleteById(id);
	}
	
	//Update Event
	public Event modifyEvent(Event event,int id) {
		event.setId(id);
		return erepo.save(event);
	}

}
