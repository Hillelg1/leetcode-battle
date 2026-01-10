package io.github.hillelgersten.leetcode_battle_backend.service;

import io.github.hillelgersten.leetcode_battle_backend.dto.QuestionDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.github.hillelgersten.leetcode_battle_backend.repository.LeetcodeQuestionRepository;
import io.github.hillelgersten.leetcode_battle_backend.model.LeetcodeQuestions;
import io.github.hillelgersten.leetcode_battle_backend.dto.MatchesDTO;

import io.github.hillelgersten.leetcode_battle_backend.dto.StoreCodeDTO;
import java.util.LinkedList;
import java.util.HashMap;
import java.util.Queue;
import java.util.Optional;
import java.util.UUID;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class BattleMatchService {

    @Autowired
    private LeetcodeQuestionRepository repo;

    private final Queue<String> waitingRoom = new LinkedList<>();
    HashMap<String, MatchesDTO> matches = new HashMap<>();
    HashMap<String,MatchesDTO> userToMatches = new HashMap<>();
    public synchronized MatchesDTO addToUserRoom(String user){
            if(userToMatches.containsKey(user))return null;
            userToMatches.put(user,null);
            this.waitingRoom.add(user);
            System.out.println(waitingRoom);
            if(this.waitingRoom.size() >= 2 && this.userToMatches.size() >= 2){
                String p1 = this.waitingRoom.poll();
                String p2 = this.waitingRoom.poll();

                try {
                    Optional<LeetcodeQuestions> optionalQuestion = repo.findById(1L);
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
        matches.remove(matchId);
        MatchesDTO match = userToMatches.get(sender);
        userToMatches.remove(match.getP1());
        userToMatches.remove(match.getP2());
    }

    public MatchesDTO checkForRejoin(String userName){
        return userToMatches.get(userName);
    }

    public void storeCode(StoreCodeDTO code){
        MatchesDTO match = userToMatches.get(code.getUserName());
        if (code.getUserName().equals(match.getP1()))
            match.setP1Code(code.getCode());
        else if (code.getUserName().equals(match.getP2()))
            match.setP2Code(code.getCode());
    }
}
