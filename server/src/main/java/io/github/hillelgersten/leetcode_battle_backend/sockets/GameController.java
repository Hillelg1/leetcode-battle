package io.github.hillelgersten.leetcode_battle_backend.sockets;

import io.github.hillelgersten.leetcode_battle_backend.sockets.dto.FinishMatchDTO;
import io.github.hillelgersten.leetcode_battle_backend.service.BattleMatchService;
import io.github.hillelgersten.leetcode_battle_backend.dto.MatchesDTO;
import io.github.hillelgersten.leetcode_battle_backend.sockets.dto.GameMessageDto;
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
    public void rejoinMatch(@Payload io.github.hillelgersten.leetcode_battle_backend.sockets.dto.GameMessageDto tryMatch){
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
    public void finishMatch(@Payload FinishMatchDTO match) {
        System.out.println(match.getType() + ": received from:" + match.getSender());
        battleMatchService.finishMatch(match.getMatchId(), match.getSender(), match.getEndTime());
        System.out.println(match.toString());
        messagingTemplate.convertAndSend("/topic/match/" + match.getMatchId(), match);
    }
}