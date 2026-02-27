package io.github.hillelgersten.leetcode_battle_backend.repository;

import io.github.hillelgersten.leetcode_battle_backend.model.LeetcodeQuestions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface LeetcodeQuestionRepository extends JpaRepository<LeetcodeQuestions, Long> {
    Optional<LeetcodeQuestions> findByTitle(String title);

    Optional<LeetcodeQuestions> findById(Long id);

    @Query(value = "SELECT * FROM leetcode_questions ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Optional<LeetcodeQuestions> getRandomQuestion();

    Optional<LeetcodeQuestions>  findTopByOrderByIdDesc();

    @Transactional
    @Modifying
    @Query(value = "UPDATE leetcode_questions SET solution_video_url = :videoUrl WHERE id = :id", nativeQuery = true)
    int updateSolutionVideoUrl(@Param("videoUrl") String videoUrl, @Param("id") Long id);

}
