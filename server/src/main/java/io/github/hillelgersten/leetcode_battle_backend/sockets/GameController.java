package io.github.hillelgersten.leetcode_battle_backend.sockets;

import io.github.hillelgersten.leetcode_battle_backend.sockets.dto.GameMessageDto;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

@Controller
public class GameController {

    private final SimpMessageSendingOperations messagingTemplate;

    public GameController(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/game/join")
    public void joinMatch(@Payload GameMessageDto message) {
        message.setMatchId("1234"); // hardcode match
        messagingTemplate.convertAndSend("/topic/match/1234", message);
    }

    @MessageMapping("/game/finish")
    public void finishMatch(@Payload GameMessageDto message) {
        message.setMatchId("1234"); // hardcode match
        messagingTemplate.convertAndSend("/topic/match/1234", message);
    }
}