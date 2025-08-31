package io.github.hillelgersten.leetcode_battle_backend.sockets.dto;

public class GameMessageDto {
    private String sender;
    private String type;     // JOIN, FINISH, etc.
    private String matchId;
    private String payload;  // optional, e.g. code results

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getMatchId() { return matchId; }
    public void setMatchId(String matchId) { this.matchId = matchId; }

    public String getPayload() { return payload; }
    public void setPayload(String payload) { this.payload = payload; }
}