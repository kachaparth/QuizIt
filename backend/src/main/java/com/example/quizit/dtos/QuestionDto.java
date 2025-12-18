package com.example.quizit.dtos;

import com.example.quizit.entities.Quiz;
import com.example.quizit.enums.DifficultyLevel;
import lombok.*;

import java.util.UUID;


@AllArgsConstructor
@Builder
@NoArgsConstructor
@Setter
@Getter
public class QuestionDto {

    private UUID questionId;
    private Quiz quiz;
    private String content;
    private Object options;
    private Object correctAnswer;
    private Integer duration;
    private String questionType;
    private DifficultyLevel difficultyLevel;
}
