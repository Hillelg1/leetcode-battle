package io.github.hillelgersten.leetcode_battle_backend.dto;

import java.util.Map;

public class TestCasesDto {
    private Long questionId;
    private Map<String, Object> input;
    private Object output;

    public Long getQuestionId(){
        return this.questionId;
    }
    public void setQuestionId(Long Id){
        this.questionId = Id;
    }

    public Map<String,Object> getInput(){
        return this.input;
    }
    public void setInput(Map<String,Object> input){
        this.input = input;
    }

    public void setOutput(Object output){
        this.output = output;
    }
    public Object getOutput(){
        return this.output;
    }
}
