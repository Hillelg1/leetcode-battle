package io.github.hillelgersten.leetcode_battle_backend.controller;
import io.github.hillelgersten.leetcode_battle_backend.model.LeetcodeQuestions;
import io.github.hillelgersten.leetcode_battle_backend.repository.LeetcodeQuestionRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/leetcode")
public class QuestionController {
    private final LeetcodeQuestionRepository repo;

    public QuestionController(LeetcodeQuestionRepository repo){
        this.repo = repo;
    }

    @GetMapping("/question")
    public LeetcodeQuestions getQuestion(){
        return repo.findByTitle("Two Sum").orElseThrow(() -> new RuntimeException("unable to find question"));
    }
}
