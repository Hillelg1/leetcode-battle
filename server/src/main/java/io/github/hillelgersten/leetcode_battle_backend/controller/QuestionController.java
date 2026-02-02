package io.github.hillelgersten.leetcode_battle_backend.controller;
import io.github.hillelgersten.leetcode_battle_backend.model.LeetcodeQuestions;
import io.github.hillelgersten.leetcode_battle_backend.model.TestCases;
import io.github.hillelgersten.leetcode_battle_backend.repository.LeetcodeQuestionRepository;
import java.util.List;

import io.github.hillelgersten.leetcode_battle_backend.repository.TestCasesRepository;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;


@RestController
@RequestMapping("api/leetcode")
public class QuestionController {
    private final LeetcodeQuestionRepository repo;

    public QuestionController(LeetcodeQuestionRepository repo) {this.repo = repo;}

    @GetMapping("/question/{id}")
    public LeetcodeQuestions getQuestion(
            @Parameter(
                    description = "ID of the question to get",
                    required = true,
                    example = "123"
            )
            @PathVariable Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("unable to find question"));
    }


    @PostMapping("/question")
    public ResponseEntity<?> createQuestion(@RequestBody LeetcodeQuestions question) {
        for (TestCases tc : question.getTestCases()) {
            tc.setQuestion(question);
        }
        try {
            repo.save(question);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Question already exists");
        }
        return ResponseEntity.ok("nice");
    }

    @DeleteMapping("/question/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        List<TestCases> testCases = repo.findById(id).get().getTestCases();
        repo.deleteById(id);
        return ResponseEntity.ok("Question deleted");
    }

    @GetMapping("/allQuestions")
    public List<LeetcodeQuestions> allQuestions() {
        return repo.findAll();
    }
}

