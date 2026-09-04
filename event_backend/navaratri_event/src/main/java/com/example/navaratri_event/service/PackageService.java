package com.example.navaratri_event.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.navaratri_event.model.Package;
import com.example.navaratri_event.repository.PackageRepository;

@Service
public class PackageService {

    @Autowired
    private PackageRepository packageRepository;

    // Get all packages
    public List<Package> getAllPackages() {
        return packageRepository.findAll();
    }

    // Get package by ID
    public Package getPackageById(int id) {
        return packageRepository.findById(id).orElse(null);
    }

    // Add new package
    public Package addPackage(Package packageData) {
        return packageRepository.save(packageData);
    }

    // Update package
    public Package updatePackage(int id, Package packageData) {

        Package existingPackage =
                packageRepository.findById(id).orElse(null);

        if (existingPackage != null) {

            existingPackage.setPackageName(
                    packageData.getPackageName()
            );

            existingPackage.setPricePerPerson(
                    packageData.getPricePerPerson()
            );

            existingPackage.setPeople(
                    packageData.getPeople()
            );

            return packageRepository.save(existingPackage);
        }

        return null;
    }

    // Delete package
    public void deletePackage(int id) {
        packageRepository.deleteById(id);
    }
}