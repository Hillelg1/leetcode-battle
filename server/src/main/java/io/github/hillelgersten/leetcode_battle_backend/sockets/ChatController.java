package io.github.hillelgersten.leetcode_battle_backend.sockets;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import io.github.hillelgersten.leetcode_battle_backend.sockets.dto.ChatMessageDto;


@Controller
public class ChatController {

    @MessageMapping("/chat/sendMessage")
    @SendTo("/topic/public")
    public ChatMessageDto sendMessage(@Payload ChatMessageDto message){
        return message;
    }

    @MessageMapping("/chat/addUser")
    @SendTo("/topic/public")
    public ChatMessageDto addUser(@Payload ChatMessageDto message, SimpMessageHeaderAccessor headerAccessor){
        //add username in web socket session
        headerAccessor.getSessionAttributes().put("username", message.getSender());
        return message;
    }
}
