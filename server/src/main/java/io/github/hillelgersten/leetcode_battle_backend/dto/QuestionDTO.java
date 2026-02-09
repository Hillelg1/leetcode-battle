package io.github.hillelgersten.leetcode_battle_backend.dto;

public class QuestionDTO {

    private String title;
    private Long id;
    private String description;
    private String example;
    private String starterCode;

    public QuestionDTO(Long id, String description, String example, String starterCode, String title) {
        this.id = id;
        this.description = description;
        this.example = example;
        this.starterCode = starterCode;
        this.title = title;
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

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
}