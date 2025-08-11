package io.github.hillelgersten.leetcode_battle_backend.controller;

import io.github.hillelgersten.leetcode_battle_backend.model.User;
import io.github.hillelgersten.leetcode_battle_backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController{

    private final UserRepository repo;

    public UserController(UserRepository repo) {
        this.repo = repo;
    }

    @PostMapping("/createUser")
    public User createUser(@RequestBody User user) {
        System.out.println("creating user");
        return repo.save(user);
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
