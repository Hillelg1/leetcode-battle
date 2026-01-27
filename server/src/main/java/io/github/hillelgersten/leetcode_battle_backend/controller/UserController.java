package io.github.hillelgersten.leetcode_battle_backend.controller;

import io.github.hillelgersten.leetcode_battle_backend.dto.UserDTO;
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
    public ResponseEntity<?> createUser(@RequestBody UserDTO userDto) {
        if (repo.findByUsername(userDto.getUsername()).isPresent() || repo.findByUsername(userDto.getUsername().toLowerCase()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Username already exists");
        }
        User user = new User();
        user.setUsername(user.getUsername().toLowerCase());
        user.setPassword(user.getPassword());

        User savedUser = repo.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return repo.findAll();
    }
    @PostMapping("/fetchUser")
    public User fetchUser(@RequestBody UserDTO userDto){
       User user = repo.findByUsernameAndPassword(userDto.getUsername().toLowerCase(), userDto.getPassword()).orElseThrow(() -> new RuntimeException("invalid username or password"));
       System.out.println(user.getUsername());
       return user;
    }
}
