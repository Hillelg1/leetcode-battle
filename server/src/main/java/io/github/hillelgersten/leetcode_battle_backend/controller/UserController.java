package io.github.hillelgersten.leetcode_battle_backend.controller;

import io.github.hillelgersten.leetcode_battle_backend.model.User;
import io.github.hillelgersten.leetcode_battle_backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController{

    private final UserRepository repo;

    public UserController(UserRepository repo) {
        this.repo = repo;
    }

    @PostMapping("/user")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        if (repo.findByUsername(user.getUsername()).isPresent() || repo.findByUsername(user.getUsername().toLowerCase()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Username already exists");
        }
        User savedUser = repo.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return repo.findAll();
    }
    @PostMapping("/fetchUser")
    public User fetchUser(@RequestBody User user){
        return repo.findByUsernameAndPassword(user.getUsername(), user.getPassword()).orElseThrow(() -> new RuntimeException("invalid username or password"));
    }
}
