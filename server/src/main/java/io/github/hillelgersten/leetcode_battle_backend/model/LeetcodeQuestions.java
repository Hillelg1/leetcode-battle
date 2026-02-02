package io.github.hillelgersten.leetcode_battle_backend.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import org.antlr.v4.runtime.misc.NotNull;

import java.util.ArrayList;
import java.util.List;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class LeetcodeQuestions {
    @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    @Column(columnDefinition="TEXT", nullable = false)
    private String description;
    private String difficulty;
    @Column(columnDefinition = "TEXT", nullable = false)
    private String example;
    @Column(columnDefinition="TEXT")
    private String starterCode;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<TestCases> testCases = new ArrayList<>();

    public Long getId(){return id; }
    public void setId(Long id){this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getExample() { return example; }
    public void setExample(String example) { this.example = example; }

    public String getStarterCode() { return starterCode; }
    public void setStarterCode(String starterCode) { this.starterCode = starterCode; }

    public void addTestCase(TestCases testCase) {
        testCases.add(testCase);
        testCase.setQuestion(this);  // sync both sides
    }

    public List<TestCases> getTestCases(){
        return this.testCases;
    }

    public void removeTestCase(TestCases testCase) {
        testCases.remove(testCase);
        testCase.setQuestion(null);  // break the link
    }
}
