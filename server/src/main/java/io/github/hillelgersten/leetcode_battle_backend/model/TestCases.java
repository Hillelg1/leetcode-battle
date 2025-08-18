package io.github.hillelgersten.leetcode_battle_backend.model;
import jakarta.persistence.*;
import org.antlr.v4.runtime.misc.NotNull;

@Entity
public class TestCases {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // many test cases belong to one question
    @JoinColumn(name = "question_id", nullable = false)
    private LeetcodeQuestions question;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String input;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String output;

    public LeetcodeQuestions getQuestion() {
        return question;
    }
    public void setQuestion(LeetcodeQuestions question) {
        this.question = question;
    }

    public String getInput(){
        return this.input;
    }
    public void setInput(String input){
        this.input = input;
    }

    public String getOutput(){
        return this.output;
    }
    public void setOutput(String output){
        this.output = output;
    }
}
