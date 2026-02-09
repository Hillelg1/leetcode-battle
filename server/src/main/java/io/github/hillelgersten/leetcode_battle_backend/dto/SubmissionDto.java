package io.github.hillelgersten.leetcode_battle_backend.dto;

public class SubmissionDto {
    private Long questionId;
    private String userCode;
    private String userName;
    public void setQuestionId(Long id){this.questionId=id;}
    public Long getQuestionId(){return this.questionId;}

    public void setUserCode(String code){this.userCode = code;}
    public String getUserCode(){return this.userCode;}

    public void setUserName(String name){this.userName = name;}
    public String getUserName(){return this.userName;}

}
