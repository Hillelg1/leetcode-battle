package io.github.hillelgersten.leetcode_battle_backend.sockets;

import io.github.hillelgersten.leetcode_battle_backend.sockets.dto.GameMessageDto;
import io.github.hillelgersten.leetcode_battle_backend.service.BattleMatchService;
import io.github.hillelgersten.leetcode_battle_backend.dto.MatchesDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class GameController {

    @Autowired
    private BattleMatchService battleMatchService;

    private final SimpMessageSendingOperations messagingTemplate;

    public GameController(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/game/join")
    public void joinMatch(@Payload GameMessageDto message) {
        MatchesDTO match = battleMatchService.addToUserRoom(message.getSender());
        if(match!=null){
            messagingTemplate.convertAndSend("/topic/match/public", match);
        }
    }

    @MessageMapping("/game/finish")
    public void finishMatch(@Payload MatchesDTO match) {
        battleMatchService.finishMatch(match.getMatchId());
        messagingTemplate.convertAndSend("/topic/match/" + match.getMatchId(), match);
    }
}