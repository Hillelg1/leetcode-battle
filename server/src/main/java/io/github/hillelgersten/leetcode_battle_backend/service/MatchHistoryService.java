package io.github.hillelgersten.leetcode_battle_backend.service;
import io.github.hillelgersten.leetcode_battle_backend.model.MatchHistory;
import io.github.hillelgersten.leetcode_battle_backend.repository.MatchHistoryRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MatchHistoryService {
    private final MatchHistoryRepository matchHistoryRepository;

    public MatchHistoryService(MatchHistoryRepository matchHistoryRepository) {
        this.matchHistoryRepository = matchHistoryRepository;
    }

    public void saveMatchHistory(MatchHistory matchHistory) {
         matchHistoryRepository.save(matchHistory);
    }

    public List<Optional<MatchHistory>> findByUserName(String userName) {
        return matchHistoryRepository.getByUsername(userName);
    }

    public String formatTime(Instant end, Instant start) {
        return "";
    }

}
