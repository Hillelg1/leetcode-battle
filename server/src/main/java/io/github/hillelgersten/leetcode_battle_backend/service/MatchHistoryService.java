package io.github.hillelgersten.leetcode_battle_backend.service;
import io.github.hillelgersten.leetcode_battle_backend.dto.MatchesDTO;
import io.github.hillelgersten.leetcode_battle_backend.model.LeetcodeQuestions;
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

    public String formatTime(long end, long start, long duration) {
        System.out.println(end);
        long elapsed = Math.max(0, end - start);
        long seconds = Math.min(elapsed, duration);

        long minutes = seconds / 60;
        long remainingSeconds = seconds % 60;

        return String.format("%02d:%02d", minutes, remainingSeconds);
    }

    public void createNewMatchHistory(MatchesDTO match){
        MatchHistory matchHistory = new MatchHistory();
        matchHistory.setP1(match.getP1());
        matchHistory.setP2(match.getP2());
        matchHistory.setMatchId(match.getMatchId());
        matchHistory.setP1TestcasesSolved(match.getP1AmountFinished() + "/10");
        matchHistory.setP2TestcasesSolved(match.getP2AmountFinished() + "/10");
        matchHistory.setP1FinishedAt(formatTime(match.getP1endTime(), match.getStartTime(), 600L));
        matchHistory.setP2FinishedAt(formatTime(match.getP2endTime(), match.getStartTime(), 600L));
        matchHistory.setP1Solution(match.getP1Code());
        matchHistory.setP2Solution(match.getP2Code());
        if(match.getP1AmountFinished() < match.getP2AmountFinished())matchHistory.setWon(match.getP2());
        else if(match.getP2AmountFinished() < match.getP1AmountFinished())matchHistory.setWon(match.getP1());
        else if (match.getP1endTime() < match.getP2endTime()) matchHistory.setWon(match.getP1());
        else if (match.getP2endTime() < match.getP1endTime()) matchHistory.setWon(match.getP2());
        else matchHistory.setWon("Draw");
        matchHistory.setSolution("");
        matchHistory.setQuestionTitle(match.getQuestion().getTitle());
        saveMatchHistory(matchHistory);
    }

}
