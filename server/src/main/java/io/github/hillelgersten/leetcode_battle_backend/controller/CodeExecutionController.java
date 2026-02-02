package io.github.hillelgersten.leetcode_battle_backend.controller;
import  io.github.hillelgersten.leetcode_battle_backend.dto.SubmissionDto;
import  io.github.hillelgersten.leetcode_battle_backend.service.*;
import  org.springframework.http.ResponseEntity;
import  org.springframework.web.bind.annotation.PostMapping;
import  org.springframework.web.bind.annotation.RequestBody;
import  org.springframework.web.bind.annotation.RequestMapping;
import  org.springframework.web.bind.annotation.RestController;

import io.github.hillelgersten.leetcode_battle_backend.dto.StoreCodeDTO;


@RestController
@RequestMapping("/api/code")
public class CodeExecutionController {

    private final CodeExecutionService executionService;
    private final BattleMatchService battleMatchService;

    public CodeExecutionController(CodeExecutionService executionService, BattleMatchService battleMatchService) {
        this.executionService = executionService;
        this.battleMatchService = battleMatchService;
    }

    @PostMapping("/submit")
    public ResponseEntity<String> submitCode(@RequestBody SubmissionDto submission) {
        String results = executionService.runSubmission(submission);
        return ResponseEntity.ok(results);
    }

    @PostMapping("/store")
    public ResponseEntity<String> storeCode(@RequestBody StoreCodeDTO code){
        battleMatchService.storeCode(code);
        return ResponseEntity.ok("Done");
    }
}
