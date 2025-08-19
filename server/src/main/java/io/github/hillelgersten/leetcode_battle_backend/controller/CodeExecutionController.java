package io.github.hillelgersten.leetcode_battle_backend.controller;
import io.github.hillelgersten.leetcode_battle_backend.dto.SubmissionDto;
import io.github.hillelgersten.leetcode_battle_backend.repository.LeetcodeQuestionRepository;
import io.github.hillelgersten.leetcode_battle_backend.service.CodeExecutionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/code")
public class CodeExecutionController {

    private final CodeExecutionService executionService;

    public CodeExecutionController(CodeExecutionService executionService) {
        this.executionService = executionService;
    }

    @PostMapping("/submit")
    public ResponseEntity<String> submitCode(@RequestBody SubmissionDto submission) {
        String results = executionService.runSubmission(submission);
        return ResponseEntity.ok(results);
    }
}
