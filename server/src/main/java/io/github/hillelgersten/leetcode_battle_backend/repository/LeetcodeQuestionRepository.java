package io.github.hillelgersten.leetcode_battle_backend.repository;

import io.github.hillelgersten.leetcode_battle_backend.model.LeetcodeQuestions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface LeetcodeQuestionRepository extends JpaRepository<LeetcodeQuestions, Long> {
    Optional<LeetcodeQuestions> findByTitle(String title);

    Optional<LeetcodeQuestions> findById(Long id);

    @Query(value = "SELECT * FROM leetcode_questions ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Optional<LeetcodeQuestions> getRandomQuestion();

    Optional<LeetcodeQuestions>  findTopByOrderByIdDesc();
}
