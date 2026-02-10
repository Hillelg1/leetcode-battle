package io.github.hillelgersten.leetcode_battle_backend.controller;

import io.github.hillelgersten.leetcode_battle_backend.model.MatchHistory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import io.github.hillelgersten.leetcode_battle_backend.service.MatchHistoryService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/match-history")
public class MatchHistoryController {
    private final MatchHistoryService matchHistoryService;
    public MatchHistoryController(MatchHistoryService matchHistoryService) {
        this.matchHistoryService = matchHistoryService;
    }
    @GetMapping("/{username}")
    public List<Optional<MatchHistory>> getMatchHistory(@PathVariable String username) {
        System.out.println("Getting match history for user: " + username);
        return matchHistoryService.findByUserName(username);
    }
}
