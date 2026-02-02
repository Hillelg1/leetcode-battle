package io.github.hillelgersten.leetcode_battle_backend.sockets;

import io.github.hillelgersten.leetcode_battle_backend.sockets.dto.GameMessageDto;
import io.github.hillelgersten.leetcode_battle_backend.service.BattleMatchService;
import io.github.hillelgersten.leetcode_battle_backend.dto.MatchesDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

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
        String user = message.getSender();
        MatchesDTO match = battleMatchService.addToUserRoom(user);
        if(match!=null){
            messagingTemplate.convertAndSend("/topic/match/" + match.getP1(), match);
            messagingTemplate.convertAndSend("/topic/match/" + match.getP2(), match);
        }
    }
    @MessageMapping("/game/rejoin")
    public void rejoinMatch(@Payload GameMessageDto tryMatch){
        String user = tryMatch.getSender();
        MatchesDTO match = battleMatchService.checkForRejoin(user);
        if(match!=null){
            messagingTemplate.convertAndSend("/topic/match/"+user, match);
        }
        else {
            MatchesDTO noMatch = new MatchesDTO();
            noMatch.setMatchId("");
            messagingTemplate.convertAndSend("/topic/match/"+user, noMatch);
        }
    }

    @MessageMapping("/game/finish")
    public void finishMatch(@Payload GameMessageDto match) {
        System.out.println("finish received from:" + match.getSender());
        battleMatchService.finishMatch(match.getMatchId(), match.getSender());
        System.out.println(match.toString());
        messagingTemplate.convertAndSend("/topic/match/" + match.getMatchId(), match);
    }

}