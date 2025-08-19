package io.github.hillelgersten.leetcode_battle_backend.dto;

public class SubmissionDto {
    private Long questionId;
    private String userCode;

    public void setQuestionId(Long id){this.questionId=id;}
    public Long getQuestionId(){return this.questionId;}

    public void setUserCode(String code){this.userCode = code;}
    public String getUserCode(){return this.userCode;}
}
