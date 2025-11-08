package com.flexidesk.demo.controller;

import com.flexidesk.demo.model.Ressource;
import com.flexidesk.demo.repository.RessourceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/ressources")
public class RessourceController {


    private final RessourceRepository ressourceRepository;

    public RessourceController(RessourceRepository ressourceRepository) {
        this.ressourceRepository = ressourceRepository;
    }

    @GetMapping
    public List<Ressource> getAllRessources() {
        return ressourceRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Ressource createRessource(@RequestBody Ressource ressource) {
        return ressourceRepository.save(ressource);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ressource> getRessourceById(@PathVariable Long id) {
        Optional<Ressource> ressource = ressourceRepository.findById(id);

        return ressource.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}