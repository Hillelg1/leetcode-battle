package io.github.hillelgersten.leetcode_battle_backend.dto;

public class TestCasesDto {
    private Long questionId;
    private String input;
    private String output;

    public Long getQuestionId(){
        return this.questionId;
    }
    public void setQuestionId(Long Id){
        this.questionId = Id;
    }

    public String getInput(){
        return this.input;
    }
    public void setInput(String input){
        this.input = input;
    }

    public void setOutput(String output){
        this.output = output;
    }
    public String getOutput(){
        return this.output;
    }
}
