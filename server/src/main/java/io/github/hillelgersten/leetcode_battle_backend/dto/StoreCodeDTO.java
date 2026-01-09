package io.github.hillelgersten.leetcode_battle_backend.dto;

public class StoreCodeDTO {
    private String code;
    private String userName;

    public StoreCodeDTO(String code, String userName) {
        this.code = code;
        this.userName = userName;
    }

    public String getCode() {
        return code;
    }
    public void setCode(String code) {
        this.code = code;
    }
    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
}
