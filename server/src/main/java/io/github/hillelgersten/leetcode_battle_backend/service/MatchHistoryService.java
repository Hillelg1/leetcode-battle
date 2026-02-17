package io.github.hillelgersten.leetcode_battle_backend.service;
import io.github.hillelgersten.leetcode_battle_backend.dto.MatchHistoryDTO;
import io.github.hillelgersten.leetcode_battle_backend.dto.MatchesDTO;
import io.github.hillelgersten.leetcode_battle_backend.model.LeetcodeQuestions;
import io.github.hillelgersten.leetcode_battle_backend.repository.LeetcodeQuestionRepository;
import io.github.hillelgersten.leetcode_battle_backend.model.MatchHistory;
import io.github.hillelgersten.leetcode_battle_backend.repository.MatchHistoryRepository;
import org.springframework.stereotype.Service;
import io.github.hillelgersten.leetcode_battle_backend.dto.MatchHistorySingleDTO;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MatchHistoryService {
    private final MatchHistoryRepository matchHistoryRepository;

    private final LeetcodeQuestionRepository questionRepo;

    public MatchHistoryService(MatchHistoryRepository matchHistoryRepository, LeetcodeQuestionRepository questionRepo) {
        this.matchHistoryRepository = matchHistoryRepository;
        this.questionRepo = questionRepo;
    }

    public void saveMatchHistory(MatchHistory matchHistory) {
         matchHistoryRepository.save(matchHistory);
    }

    public List<Optional<MatchHistory>> findByUserName(String userName) {
        return matchHistoryRepository.getByUsername(userName);
    }

    public String formatTime(long end, long start, long duration) {
        System.out.println("END: " + end);
        System.out.println("START: " + start);
        System.out.println("END - START: " + (end - start));
        long elapsed = Math.max(0, end - start);
        long seconds = Math.min(elapsed, duration);

        long minutes = seconds / 60;
        long remainingSeconds = seconds % 60;

        return String.format("%02d:%02d", minutes, remainingSeconds);
    }

    public void createNewMatchHistory(MatchesDTO match){
        MatchHistory matchHistory = new MatchHistory();
        matchHistory.setP1(match.getP1());
        matchHistory.setP2(match.getP2());
        matchHistory.setMatchId(match.getMatchId());
        matchHistory.setP1TestcasesSolved(match.getP1AmountFinished() + "/10");
        matchHistory.setP2TestcasesSolved(match.getP2AmountFinished() + "/10");
        matchHistory.setP1FinishedAt(formatTime(match.getP1endTime(), match.getStartTime(), 600L));
        matchHistory.setP2FinishedAt(formatTime(match.getP2endTime(), match.getStartTime(), 600L));
        matchHistory.setP1Solution(match.getP1Code());
        matchHistory.setP2Solution(match.getP2Code());
        if(match.getP1AmountFinished() < match.getP2AmountFinished())matchHistory.setWon(match.getP2());
        else if(match.getP2AmountFinished() < match.getP1AmountFinished())matchHistory.setWon(match.getP1());
        else if(match.getP1SubmissionCount() < match.getP2SubmissionCount())matchHistory.setWon(match.getP1());
        else if(match.getP2SubmissionCount() < match.getP1SubmissionCount())matchHistory.setWon(match.getP2());
        else if (match.getP1endTime() < match.getP2endTime()) matchHistory.setWon(match.getP1());
        else if (match.getP2endTime() < match.getP1endTime()) matchHistory.setWon(match.getP2());
        else matchHistory.setWon("Draw");
        matchHistory.setQuestionTitle(match.getQuestion().getTitle());
        saveMatchHistory(matchHistory);
    }

    public void deleteAllMatchHistory(){
        matchHistoryRepository.deleteAll();
    }

    public List<Optional<MatchHistory>> getAllWins(String userName){
        return matchHistoryRepository.getWinCountForUser(userName);
    }

    public List<Optional<MatchHistory>> getAllLoses(String userName){
        return matchHistoryRepository.getLossCountForUser(userName);
    }

    public List<Optional<MatchHistory>> getAllDraws(String userName){
        return matchHistoryRepository.getDrawCountForUser(userName);
    }
    public MatchHistoryDTO createMatchHistoryDTO(String username) {
        return new MatchHistoryDTO(getAllWins(username), getAllLoses(username), getAllDraws(username));
    }

    public MatchHistory findByMatchId(String matchId){
        return matchHistoryRepository.findByMatchId(matchId).orElse(null);
    }

    public MatchHistorySingleDTO getMatchHistorySingleDTO(String matchId, String title){
        MatchHistory match = findByMatchId(matchId);
        Optional<LeetcodeQuestions> optQuestion = questionRepo.findByTitle(title);
        LeetcodeQuestions question = optQuestion.orElse(null);
        if(question == null) return null;
        String solutionVideoUrl = question.getSolutionVideoUrl();
        return new MatchHistorySingleDTO(matchId, match.getP1Solution(), match.getP2Solution(), match.getWon(), solutionVideoUrl);
    }

}
