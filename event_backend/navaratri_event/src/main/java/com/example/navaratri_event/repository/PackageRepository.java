package com.example.navaratri_event.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.navaratri_event.model.Package;

public interface PackageRepository extends JpaRepository<Package, Integer> {

}