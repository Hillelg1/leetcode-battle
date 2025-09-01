package io.github.hillelgersten.leetcode_battle_backend.dto;

public class QuestionDTO {
    private Long id;
    private String description;
    private String example;
    private String starterCode;

    public QuestionDTO() {
    }

    public QuestionDTO(Long id, String description, String example, String starterCode) {
        this.id = id;
        this.description = description;
        this.example = example;
        this.starterCode = starterCode;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getExample() {
        return example;
    }

    public void setExample(String example) {
        this.example = example;
    }

    public String getStarterCode() {
        return starterCode;
    }

    public void setStarterCode(String starterCode) {
        this.starterCode = starterCode;
    }
}