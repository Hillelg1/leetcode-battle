package io.github.hillelgersten.leetcode_battle_backend.repository;

import io.github.hillelgersten.leetcode_battle_backend.model.TestCases;
import io.github.hillelgersten.leetcode_battle_backend.model.LeetcodeQuestions;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestCasesRepository extends JpaRepository<TestCases, Long> {
    // find all test cases for a given question
    List<TestCases> findByQuestion(LeetcodeQuestions question);
    // or by question id directly
    List<TestCases> findByQuestionId(Long questionId);
}