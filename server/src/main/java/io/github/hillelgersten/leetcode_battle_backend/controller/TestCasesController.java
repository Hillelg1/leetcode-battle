package io.github.hillelgersten.leetcode_battle_backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.hillelgersten.leetcode_battle_backend.dto.TestCasesDto;
import io.github.hillelgersten.leetcode_battle_backend.model.TestCases;
import io.github.hillelgersten.leetcode_battle_backend.model.LeetcodeQuestions;
import io.github.hillelgersten.leetcode_battle_backend.repository.TestCasesRepository;
import io.github.hillelgersten.leetcode_battle_backend.repository.LeetcodeQuestionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/testcases")
public class TestCasesController {

    private final TestCasesRepository testCaseRepo;
    private final LeetcodeQuestionRepository questionRepo;

    // ✅ Constructor injection
    public TestCasesController(TestCasesRepository testCaseRepo, LeetcodeQuestionRepository questionRepo) {
        this.testCaseRepo = testCaseRepo;
        this.questionRepo = questionRepo;
    }

    // GET all test cases for a question
    @GetMapping
    public List<TestCases> getTestCases(@RequestParam Long questionId) {
        return testCaseRepo.findByQuestionId(questionId);
    }

    // CREATE a new test case
    @PostMapping
    public TestCases addTestCase(@RequestBody TestCasesDto dto) throws JsonProcessingException {
        // fetch the related question
        LeetcodeQuestions question = questionRepo.findById(dto.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question not found"));

        // create a new test case
        ObjectMapper mapper = new ObjectMapper();
        TestCases testCase = new TestCases();
        testCase.setQuestion(question);
        testCase.setInput(mapper.writeValueAsString(dto.getInput()));
        testCase.setOutput(mapper.writeValueAsString(dto.getOutput()));
        question.addTestCase(testCase);
        // save to DB
        return testCaseRepo.save(testCase);
    }

    // DELETE a test case
    @DeleteMapping("/{id}")
    public void deleteTestCase(@PathVariable Long id) {
        Optional<TestCases> testCaseOpt = testCaseRepo.findById(id);

        if (testCaseOpt.isPresent()) {
            TestCases testCase = testCaseOpt.get();

            if (testCase.getQuestion() != null) {
                testCase.getQuestion().removeTestCase(testCase);
            }

            testCaseRepo.delete(testCase);
        }
    }
}