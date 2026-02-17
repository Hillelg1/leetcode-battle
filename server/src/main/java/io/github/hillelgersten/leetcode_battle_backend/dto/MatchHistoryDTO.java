package io.github.hillelgersten.leetcode_battle_backend.dto;
import io.github.hillelgersten.leetcode_battle_backend.model.MatchHistory;

import java.util.List;
import java.util.Optional;

public class MatchHistoryDTO {
    public List<Optional<MatchHistory>> wins;
    public List<Optional<MatchHistory>> loses;

    public List<Optional<MatchHistory>> draws;
    public int winCount;
    public int lossCount;

    public int drawCount;
    public int totalMatches;

    public MatchHistoryDTO(List<Optional<MatchHistory>> wins, List<Optional<MatchHistory>> loses, List<Optional<MatchHistory>> draws) {
        this.wins = wins;
        this.loses = loses;
        this.draws = draws;

        this.winCount = wins.size();
        this.lossCount = loses.size();
        this.drawCount = draws.size();

        this.totalMatches = winCount + lossCount + drawCount;
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
    public List<Optional<MatchHistory>> getDraws() {
        return draws;
    }
    public void setDraws(List<Optional<MatchHistory>> draws) {
        this.draws = draws;
    }
    public int getDrawCount() {
        return drawCount;
    }
    public void setDrawCount(int drawCount) {
        this.drawCount = drawCount;
    }
}
