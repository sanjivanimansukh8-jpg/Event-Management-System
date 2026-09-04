package com.example.navaratri_event.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.navaratri_event.model.Event;

@Repository
public interface EventRepository extends JpaRepository<Event,Integer> {
    List<Event> findByCategoryIgnoreCase(String category);
}