package com.example.quizit.dtos;

import com.example.quizit.entities.User;
import com.example.quizit.enums.QuizMode;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QuizDto {
    private UUID quizId;
    private String quizName;
    private UUID host;
    private String quizType;
    private QuizMode mode;
    private Instant startTime;
    private Instant endTime;
    private Instant createdAt;
}
