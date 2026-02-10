package io.github.hillelgersten.leetcode_battle_backend.sockets.dto;

public class FinishMatchDTO {
        private String sender;
        private String type;     // JOIN, FINISH, etc.
        private String payload;  // optional, e.g. code results
        private String matchId;



        public String getSender() { return sender; }
        public void setSender(String sender) { this.sender = sender; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getPayload() { return payload; }
        public void setPayload(String payload) { this.payload = payload; }

        public String getMatchId() {
            return matchId;
        }
        public void setMatchId(String matchID) {
            this.matchId = matchID;
        }

        public String toString(){
            return "sender: " + sender + " type: " + type + " MatchId: " + matchId;
        }

}
