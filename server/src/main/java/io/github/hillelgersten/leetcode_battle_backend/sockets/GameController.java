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
    public void finishMatch(@Payload GameMessageDto match) {
        System.out.println("finish received from:" + match.getSender());
        battleMatchService.finishMatch(match.getMatchId(), match.getSender());
        System.out.println(match.toString());
        messagingTemplate.convertAndSend("/topic/match/" + match.getMatchId(), match);
    }

    @MessageMapping("/game/quit")
    public void quitMatch(@Payload GameMessageDto match){
        System.out.println("quit received from:" + match.getSender());
        battleMatchService.finishMatch(match.getMatchId(), match.getSender());
        messagingTemplate.convertAndSend("/topic/match/" + match.getMatchId(), match);
        System.out.println(match.getSender() + ": quit");
    }

    @MessageMapping("/game/rejoin")
    public void rejoinMatch(@Payload GameMessageDto tryMatch){
        MatchesDTO match = battleMatchService.checkForRejoin(tryMatch.getSender());
        if(match!=null){
            messagingTemplate.convertAndSend("/topic/match/public", match);
        }
        else {
            MatchesDTO noMatch = new MatchesDTO();
            noMatch.setMatchId("");
            messagingTemplate.convertAndSend("/topic/match/public", noMatch);
        }
    }
}