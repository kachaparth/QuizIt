package com.example.quizit.records;

public record LoginReuest(
        String email,
        String password
) {

    public static LoginReuest of(String email, String password) {
        return new LoginReuest(email, password);
    }
}
