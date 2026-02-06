package io.github.hillelgersten.leetcode_battle_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "match_history")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class MatchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String matchId;

    @Column(nullable = false)
    private String p1;

    @Column(nullable = false)
    private String p2;

    @Column(nullable = false)
    private String questionTitle;

    /**
     * Winner username (p1 or p2)
     */
    private String won;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String solution;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String p1Solution;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String p2Solution;

    /**
     * Formatted values (display-only)
     * Examples: "8/10", "6:10"
     */
    private String p1TestcasesSolved; // e.g. "8/10"
    private String p2TestcasesSolved; // e.g. "5/10"

    private String p1FinishedAt; // e.g. "06:10"
    private String p2FinishedAt; // e.g. "07:45"

    /* ---------- Constructors ---------- */

    public MatchHistory() {}

    public MatchHistory(String matchId, String p1, String p2, String questionTitle) {
        this.matchId = matchId;
        this.p1 = p1;
        this.p2 = p2;
        this.questionTitle = questionTitle;
    }

    /* ---------- Getters & Setters ---------- */

    public Long getId() {
        return id;
    }

    public String getMatchId() {
        return matchId;
    }

    public void setMatchId(String matchId) {
        this.matchId = matchId;
    }

    public String getP1() {
        return p1;
    }

    public void setP1(String p1) {
        this.p1 = p1;
    }

    public String getP2() {
        return p2;
    }

    public void setP2(String p2) {
        this.p2 = p2;
    }

    public String getQuestionTitle() {
        return questionTitle;
    }

    public void setQuestionTitle(String questionTitle) {
        this.questionTitle = questionTitle;
    }

    public String getWon() {
        return won;
    }

    public void setWon(String won) {
        this.won = won;
    }

    public String getSolution() {
        return solution;
    }

    public void setSolution(String solution) {
        this.solution = solution;
    }

    public String getP1Solution() {
        return p1Solution;
    }

    public void setP1Solution(String p1Solution) {
        this.p1Solution = p1Solution;
    }

    public String getP2Solution() {
        return p2Solution;
    }

    public void setP2Solution(String p2Solution) {
        this.p2Solution = p2Solution;
    }

    public String getP1TestcasesSolved() {
        return p1TestcasesSolved;
    }

    public void setP1TestcasesSolved(String p1TestcasesSolved) {
        this.p1TestcasesSolved = p1TestcasesSolved;
    }

    public String getP2TestcasesSolved() {
        return p2TestcasesSolved;
    }

    public void setP2TestcasesSolved(String p2TestcasesSolved) {
        this.p2TestcasesSolved = p2TestcasesSolved;
    }

    public String getP1FinishedAt() {
        return p1FinishedAt;
    }

    public void setP1FinishedAt(String p1FinishedAt) {
        this.p1FinishedAt = p1FinishedAt;
    }

    public String getP2FinishedAt() {
        return p2FinishedAt;
    }

    public void setP2FinishedAt(String p2FinishedAt) {
        this.p2FinishedAt = p2FinishedAt;
    }
}