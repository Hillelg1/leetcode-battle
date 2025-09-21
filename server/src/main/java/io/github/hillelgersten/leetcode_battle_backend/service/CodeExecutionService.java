package io.github.hillelgersten.leetcode_battle_backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.hillelgersten.leetcode_battle_backend.dto.SubmissionDto;
import io.github.hillelgersten.leetcode_battle_backend.model.TestCases;
import io.github.hillelgersten.leetcode_battle_backend.repository.TestCasesRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CodeExecutionService {

    private final TestCasesRepository testCasesRepository;
    private final ObjectMapper mapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();
    private final String runnerUrl;

    public CodeExecutionService(TestCasesRepository testCasesRepository) {
        this.testCasesRepository = testCasesRepository;
        // Pull runner URL from env, fallback if not provided
        this.runnerUrl = System.getenv().getOrDefault("RUNNER_URL", "http://runner:4000");
    }

    public String runSubmission(SubmissionDto submission) {
        System.out.println(submission.getUserCode());
        // 1. Fetch test cases from DB
        List<TestCases> cases = testCasesRepository.findByQuestionId(submission.getQuestionId());
        if (cases.isEmpty()) {
            throw new IllegalArgumentException("No test cases found for question " + submission.getQuestionId());
        }
        System.out.println(cases);

        // 2. Transform test cases into JSON-ready objects
        List<Map<String, Object>> payload = cases.stream().map(tc -> {
            try {
                Object input = mapper.readValue(tc.getInput(), Object.class);
                Object expected = mapper.readValue(tc.getOutput(), Object.class);
                return Map.of("input", input, "expected", expected);
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Invalid JSON in DB for test case " + tc.getId(), e);
            }
        }).collect(Collectors.toList());

        // 3. Build request payload
        Map<String, Object> request = new HashMap<>();
        request.put("userCode", submission.getUserCode());
        request.put("testCases", payload);

        // 4. Call runner service
        try {
            System.out.println(request);
            String result = restTemplate.postForObject(runnerUrl + "/run", request, String.class);
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Runner service failed", e);
        }
    }
}