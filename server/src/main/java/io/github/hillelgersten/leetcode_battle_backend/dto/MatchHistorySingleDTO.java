package io.github.hillelgersten.leetcode_battle_backend.dto;

public class MatchHistorySingleDTO {
    public String p1Code;
    public String p2Code;
    public String winner;
    public String matchId;
    public String solution;

    public int p1SubmissionCount;
    public int p2SubmissionCount;

    public MatchHistorySingleDTO(String matchId, String p1Code, String p2Code, String winner, String solution, int p1SubmissionCount, int p2SubmissionCount){
        this.matchId = matchId;
        this.p1Code = p1Code;
        this.p2Code = p2Code;
        this.winner = winner;
        this.solution = solution;
    }

    public String getMatchId() {
        return matchId;
    }
    public void setMatchId(String matchId) {
        this.matchId = matchId;
    }
    public String getWinner() {
        return winner;
    }
    public void setWinner(String winner) {
        this.winner = winner;
    }
    public String getP1Code() {
        return p1Code;
    }
    public void setP1Code(String p1Code) {
        this.p1Code = p1Code;
    }
    public String getP2Code() {
        return p2Code;
    }
    public void setP2Code(String p2Code) {
        this.p2Code = p2Code;
    }
    public String getSolution() {
        return solution;
    }
    public void setSolution(String solution) {
        this.solution = solution;
    }
    public int getP1SubmissionCount() {
        return p1SubmissionCount;
    }
    public void setP1SubmissionCount(int p1SubmissionCount) {
        this.p1SubmissionCount = p1SubmissionCount;
    }
    public int getP2SubmissionCount() {
        return p2SubmissionCount;
    }
    public void setP2SubmissionCount(int p2SubmissionCount) {}
}
