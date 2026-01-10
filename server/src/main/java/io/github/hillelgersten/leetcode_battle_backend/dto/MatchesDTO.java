package io.github.hillelgersten.leetcode_battle_backend.dto;

import io.github.hillelgersten.leetcode_battle_backend.sockets.dto.MessageType;

public class MatchesDTO {
    private String matchId;
    private String p1;
    private String p2;

    private String p1Code = "";
    private String p2Code = "";

    private QuestionDTO question;
    private MessageType type;

    private long startTime;


    public MatchesDTO() {
    }

    public MatchesDTO(String matchId, String p1, String p2, QuestionDTO question, MessageType type, long startTime) {
        this.matchId = matchId;
        this.p1 = p1;
        this.p2 = p2;
        this.question = question;
        this.type = type;
        this.startTime = startTime;
    }

    // Getters & Setters
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

    public QuestionDTO getQuestion() {
        return question;
    }

    public void setQuestion(QuestionDTO question) {
        this.question = question;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public void setStartTime(long startTime){this.startTime = startTime;}
    public long getStartTime(){return startTime;}

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

}