package com.example.quizit.dtos;

import com.example.quizit.entities.Question;
import lombok.*;

import java.util.UUID;
@Getter
@Setter
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class QuestionAnalyticsUserDto {

    private UUID qauId;
    private Question question;
    private Integer timeSpent;
    private Object selectedAnswer;
    private Boolean isCorrect;
    private Integer tabSwitchCount;
}
