package io.github.hillelgersten.leetcode_battle_backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.hillelgersten.leetcode_battle_backend.dto.SubmissionDto;
import io.github.hillelgersten.leetcode_battle_backend.model.TestCases;
import io.github.hillelgersten.leetcode_battle_backend.repository.TestCasesRepository;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CodeExecutionService {

    private final TestCasesRepository testCasesRepository;
    private final ObjectMapper mapper = new ObjectMapper();

    public CodeExecutionService(TestCasesRepository testCasesRepository) {
        this.testCasesRepository = testCasesRepository;
    }

    public String runSubmission(SubmissionDto submission) {
        // 1) Fetch test cases for question
        System.out.println("getting testcases");
        List<TestCases> cases = testCasesRepository.findByQuestionId(submission.getQuestionId());
        if (cases.isEmpty()) {
            throw new IllegalArgumentException("No test cases for question " + submission.getQuestionId());
        }
        System.out.println("testCases" + cases);
        // 2) Create per-run temp di
        Path tempDir;
        try {
            tempDir = Files.createTempDirectory("runner-" + UUID.randomUUID());
            System.out.println("creating runner file" + tempDir);
        } catch (IOException e) {
            throw new RuntimeException("Failed to create temp dir", e);
        }

        try {
            // 3) Write user code
            Path userCode = tempDir.resolve("userCode.js");
            System.out.println(submission.getUserCode());
            Files.writeString(userCode, submission.getUserCode(), StandardCharsets.UTF_8);
            System.out.println("wrote into file");

            // 4) Write testcases.json (materialize from DB)
            Path tcFile = tempDir.resolve("testcases.json");
            // Transform DB entities -> a compact JSON array for the runner
            System.out.println("Transforming db entities into json");
            List<Map<String, Object>> payload = cases.stream()
                    .map(tc ->
                            {
                                try{
                                    Object input = mapper.readValue(tc.getInput(), Object.class);
                                    Object expected = mapper.readValue(tc.getOutput(), Object.class);
                                    return Map.of("input", input, "expected", expected);
                                }catch (JsonProcessingException e) {
                                    throw new RuntimeException("Invalid JSON in DB for test case " + tc.getId(), e);
                                }
                            }// store expected as JSON string or value
                    )
                    .collect(Collectors.toList());
            mapper.writeValue(tcFile.toFile(), payload);

            // 5) Copy runTests.js template from classpath into temp dir
            copyClasspathFile("templates/runTests.js", tempDir.resolve("runTests.js"));

            // 6) Run a single container, mount temp dir read-only, with limits & no network
            System.out.println("building ProcessBuilder");
            ProcessBuilder run = new ProcessBuilder(
                    "docker", "run", "--rm",
                    "--network", "none",
                    "--cpus", "0.5",
                    "--memory", "256m",
                    "-v", tempDir.toAbsolutePath() + ":/app:ro",
                    "-w", "/app",
                    "node:18-alpine", "node", "runTests.js"
            );
            run.redirectErrorStream(true);
            System.out.println("doing run.start");
            Process p = run.start();
            System.out.println("finished run.start");
            // (Optional) Timeout
            boolean finished;
            try {
                finished = p.waitFor(Duration.ofSeconds(10).toMillis(), java.util.concurrent.TimeUnit.MILLISECONDS);
            } catch (InterruptedException ie) {
                p.destroyForcibly();
                Thread.currentThread().interrupt();
                throw new RuntimeException("Execution interrupted", ie);
            }
            if (!finished) {
                p.destroyForcibly();
                throw new RuntimeException("Execution timed out");
            }
            System.out.println("getting output");
            String output = new String(p.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            int exit = p.exitValue();
            if (exit != 0) {
                throw new RuntimeException("Runner exited with code " + exit + "\n" + output);
            }
            System.out.println("returning output");
            return output; // JSON string: { results: [...] }

        } catch (IOException e) {
            throw new RuntimeException("Runner failed", e);
        } finally {
            // 7) Cleanup temp dir
            try {
                Files.walk(tempDir)
                        .sorted(Comparator.reverseOrder())
                        .forEach(path -> {
                            try { Files.deleteIfExists(path); } catch (IOException ignored) {}
                        });
            } catch (IOException ignored) {}
        }
    }

    private void copyClasspathFile(String classpathLocation, Path dest) throws IOException {
        System.out.println("copying classpath file");
        try (InputStream in = new ClassPathResource(classpathLocation).getInputStream()) {
            Files.copy(in, dest, StandardCopyOption.REPLACE_EXISTING);
        }
    }
}