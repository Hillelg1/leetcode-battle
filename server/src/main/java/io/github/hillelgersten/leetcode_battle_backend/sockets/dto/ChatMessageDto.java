package io.github.hillelgersten.leetcode_battle_backend.sockets.dto;


public class ChatMessageDto {
    private String content;
    private String sender;
    private MessageType type;

    public String getContent(){
        return this.content;
    }
    public void setContent(String content){
        this.content = content;
    }
    public String getSender(){
        return this.sender;
    }
    public void setSender(String sender){
        this.sender = sender;
    }

    public MessageType getMessageType(){
        return this.type;
    }
    public void setMessageType(MessageType type){
        this.type = type;
    }
}
