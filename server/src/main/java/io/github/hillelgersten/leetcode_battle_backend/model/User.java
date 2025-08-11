package io.github.hillelgersten.leetcode_battle_backend.model;

import jakarta.persistence.*;
import org.antlr.v4.runtime.misc.NotNull;

@Entity
public class User {
    @Id
    @NotNull
    @Column(nullable = false)
    private String username;

    @NotNull
    @Column
    private String password;

    public void setPassword(String password){
        this.password = password;
    }

    public String getPassword(){
        return this.password;
    }
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

}