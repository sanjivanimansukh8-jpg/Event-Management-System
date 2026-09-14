package com.example.navaratri_event.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.navaratri_event.model.Package;
import com.example.navaratri_event.service.PackageService;

@RestController
@RequestMapping("/packages")
public class PackageController {

    @Autowired
    private PackageService packageService;

    @GetMapping
    public List<Package> getAllPackages() {
        return packageService.getAllPackages();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Package> getPackageById(@PathVariable int id) {

        Package packageData =
                packageService.getPackageById(id);

        if (packageData != null) {
            return ResponseEntity.ok(packageData);
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public Package addPackage(
            @RequestBody Package packageData) {

        return packageService.addPackage(packageData);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Package> updatePackage(
            @PathVariable int id,
            @RequestBody Package packageData) {

        Package updatedPackage =
                packageService.updatePackage(id, packageData);

        if (updatedPackage != null) {
            return ResponseEntity.ok(updatedPackage);
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePackage(
            @PathVariable int id) {

        Package existingPackage =
                packageService.getPackageById(id);

        if (existingPackage != null) {

            packageService.deletePackage(id);

            return ResponseEntity.ok(
                    "Package deleted successfully"
            );
        }

        return ResponseEntity.notFound().build();
    }
}