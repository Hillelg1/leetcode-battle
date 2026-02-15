package io.github.hillelgersten.leetcode_battle_backend.dto;
import io.github.hillelgersten.leetcode_battle_backend.model.MatchHistory;

import java.util.List;
import java.util.Optional;

public class MatchHistoryDTO {
    public List<Optional<MatchHistory>> wins;
    public List<Optional<MatchHistory>> loses;
    public int winCount;
    public int lossCount;
    public int totalMatches;
    public MatchHistoryDTO(List<Optional<MatchHistory>> wins, List<Optional<MatchHistory>> loses) {
        this.wins = wins;
        this.loses = loses;
        this.winCount = wins.size();
        this.lossCount = loses.size();
        this.totalMatches = winCount + lossCount;
    }
    public List<Optional<MatchHistory>> getWins() {
        return wins;
    }
    public void setWins(List<Optional<MatchHistory>> wins) {
        this.wins = wins;
    }
    public List<Optional<MatchHistory>> getLoses() {
        return loses;
    }
    public void setLoses(List<Optional<MatchHistory>> loses) {
        this.loses = loses;
    }
    public int getWinCount() {
        return winCount;
    }
    public void setWinCount(int winCount) {
        this.winCount = winCount;
    }
    public int getLossCount() {
        return lossCount;
    }
    public void setLossCount(int lossCount) {
        this.lossCount = lossCount;
    }
    public int getTotalMatches() {
        return totalMatches;
    }
    public void setTotalMatches(int totalMatches) {
        this.totalMatches = totalMatches;
    }
}
