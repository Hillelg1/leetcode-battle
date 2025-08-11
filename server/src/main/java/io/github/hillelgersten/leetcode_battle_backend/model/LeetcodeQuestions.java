package io.github.hillelgersten.leetcode_battle_backend.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
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
    @Column(columnDefinition="TEXT")
    private String testCases;

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

    public String getTestCases() { return testCases; }
    public void setTestCases(String testCases) { this.testCases = testCases; }
}
