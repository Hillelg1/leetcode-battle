package io.github.hillelgersten.leetcode_battle_backend.service;

import io.github.hillelgersten.leetcode_battle_backend.dto.QuestionDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.github.hillelgersten.leetcode_battle_backend.repository.LeetcodeQuestionRepository;
import io.github.hillelgersten.leetcode_battle_backend.model.LeetcodeQuestions;
import io.github.hillelgersten.leetcode_battle_backend.dto.MatchesDTO;

import java.util.*;

@Service
public class BattleMatchService {

    @Autowired
    private LeetcodeQuestionRepository repo;

    private final Queue<String> waitingRoom = new LinkedList<>();
    HashMap<String, MatchesDTO> matches = new HashMap<>();
    public MatchesDTO addToUserRoom(String user){
        this.waitingRoom.add(user);

        if(this.waitingRoom.size() >= 2){
            System.out.println(this.waitingRoom.size());
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
                        matches.put(matchId,match);
                        return match;
                    }
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
            this.waitingRoom.clear();
        }
        return null;
    }

    public void finishMatch(String matchId){
        matches.remove(matchId);
    }

}
