package io.github.hillelgersten.leetcode_battle_backend.service;

import io.github.hillelgersten.leetcode_battle_backend.dto.QuestionDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.github.hillelgersten.leetcode_battle_backend.repository.LeetcodeQuestionRepository;
import io.github.hillelgersten.leetcode_battle_backend.model.LeetcodeQuestions;

import io.github.hillelgersten.leetcode_battle_backend.dto.MatchesDTO;
import io.github.hillelgersten.leetcode_battle_backend.dto.StoreCodeDTO;

import java.util.Queue;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;


import java.time.Instant;
import java.time.temporal.ChronoUnit;


import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

@Service
public class BattleMatchService {

    @Autowired
    private LeetcodeQuestionRepository repo;

    private final Queue<String> waitingRoom = new ConcurrentLinkedQueue<>();
    ConcurrentHashMap<String, MatchesDTO> matches = new ConcurrentHashMap<>();
    ConcurrentHashMap<String,MatchesDTO> userToMatches = new ConcurrentHashMap<>();

    private final Set<String> waitingUsers = ConcurrentHashMap.newKeySet();
    private static final MatchesDTO WAITING = new MatchesDTO();
    public MatchesDTO addToUserRoom(String user){
            if(userToMatches.putIfAbsent(user,WAITING)!=null)return null;
            if (!waitingUsers.add(user)) return null;

            this.waitingRoom.add(user);
            System.out.println(waitingRoom);
                String p1 = waitingRoom.poll();
                String p2 = waitingRoom.poll();

                if (p1 == null || p2 == null) {
                    if (p1 != null) {
                        waitingRoom.add(p1);
                        waitingUsers.add(p1);
                    }
                    if (p2 != null) {
                        waitingRoom.add(p2);
                        waitingUsers.add(p2);
                    }
                    return null;
                }

                waitingUsers.remove(p1);
                waitingUsers.remove(p2);

                try {

                    Optional<LeetcodeQuestions> optionalQuestion = repo.getRandomQuestion();
                    if(optionalQuestion.isPresent()){
                        MatchesDTO match = new MatchesDTO();
                        LeetcodeQuestions question = optionalQuestion.get();
                        QuestionDTO questionDTO = new QuestionDTO(
                                question.getId(),
                                question.getDescription(),
                                question.getExample(),
                                question.getStarterCode()
                        );
                        match.setP1(p1);
                        match.setP2(p2);
                        match.setQuestion(questionDTO);
                        String matchId = UUID.randomUUID().toString();
                        match.setMatchId(matchId);
                        Instant startedAt = Instant.now().truncatedTo(ChronoUnit.SECONDS);
                        match.setStartTime(startedAt.getEpochSecond());
                        matches.put(matchId,match);
                        userToMatches.put(p1,match);
                        userToMatches.put(p2,match);
                        return match;
                    }
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
        return null;
    }

    public void finishMatch(String matchId, String sender) {
        MatchesDTO match = userToMatches.get(sender);
        if (match == null || match == WAITING) return;

        // Mark sender as done
        match.setDone(sender);

        // Free THIS user immediately
        userToMatches.remove(sender);

        if (match.bothDone()) {
            matches.remove(matchId);
        }
    }

    public void setTestCasesCompleted(String sender, int amount){
        MatchesDTO match = userToMatches.get(sender);
        if (match == null || match == WAITING) return;
        if (match.getP1().equals(sender))match.setP1AmountFinished(amount);
        else match.setP2AmountFinished(amount);
    }

    public void setEndTime(String sender, long endTime){
        MatchesDTO match = userToMatches.get(sender);
        if (match == null || match == WAITING) return;
        if (match.getP1().equals(sender)) match.setP1endTime(endTime);
        else match.setP2endTime(endTime);
    }

    public MatchesDTO checkForRejoin(String userName){
        return userToMatches.get(userName) == WAITING ? null : userToMatches.get(userName);
    }

    public void storeCode(StoreCodeDTO code){
        MatchesDTO match = userToMatches.get(code.getUserName());
        if (match == null)return;
        if (code.getUserName().equals(match.getP1()))
            match.setP1Code(code.getCode());
        else if (code.getUserName().equals(match.getP2()))
            match.setP2Code(code.getCode());
    }
}
