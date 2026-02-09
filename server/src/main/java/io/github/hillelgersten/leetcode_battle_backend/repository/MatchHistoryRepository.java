package io.github.hillelgersten.leetcode_battle_backend.repository;

import io.github.hillelgersten.leetcode_battle_backend.model.MatchHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatchHistoryRepository extends JpaRepository<MatchHistory, Long> {

    /**
     * Used to ensure match history is finalized only once
     */
    Optional<MatchHistory> findByMatchId(String matchId);

    /**
     * Fetch all matches where the user participated
     */
    List<MatchHistory> findByP1OrP2(String p1, String p2);

    /**
     * Fetch all wins for a user
     */
    List<MatchHistory> findByWon(String won);

    /**
     * Optional: most recent matches first (useful for profile/history pages)
     */
    List<MatchHistory> findTop20ByP1OrP2OrderByIdDesc(String p1, String p2);

    @Query(value = "Select * from match_history MH where MH.p1 = :username or MH.p2 = :username", nativeQuery = true)
    public List<Optional<MatchHistory>> getByUsername(String username);
}