package io.github.hillelgersten.leetcode_battle_backend.model;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class TestCases {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // many test cases belong to one question
    @JoinColumn(name = "question_id", nullable = false)
    @JsonBackReference
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

    public Long getId(){return this.id;}
    public void setId(Long id){this.id=id;}
}
