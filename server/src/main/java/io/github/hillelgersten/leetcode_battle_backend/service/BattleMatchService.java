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
            if(this.waitingRoom.size() >= 2 && this.userToMatches.size() >= 2){
                String p1 = this.waitingRoom.poll();
                String p2 = this.waitingRoom.poll();
                waitingUsers.remove(p1);
                waitingUsers.remove(p2);

                if(p1 == null || p2 == null){
                    if(p2 == null) {
                        this.waitingRoom.add(p1);
                        this.waitingUsers.add(p1);
                    }
                    if(p1 == null) {
                        this.waitingRoom.add(p2);
                        this.waitingUsers.add(p2);
                    }
                    return null;
                }

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
            }
        return null;
    }

    public void finishMatch(String matchId, String sender){
        MatchesDTO match = userToMatches.get(sender);
        if(match == WAITING || match == null)return;
        match.setDone(sender);
        if(match.getP1().equals(sender))userToMatches.remove(match.getP1());
        else userToMatches.remove(match.getP2());
        if (!match.bothDone())return;
        matches.remove(matchId);
    }

    public MatchesDTO checkForRejoin(String userName){
        return userToMatches.get(userName);
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
