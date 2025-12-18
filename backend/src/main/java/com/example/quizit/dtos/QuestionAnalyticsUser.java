package com.example.quizit.dtos;

import com.example.quizit.entities.Question;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.UUID;
@Getter
@Setter
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class QuestionAnalyticsUser {

    private UUID qauId;
    private Question question;
    private Integer timeSpent;
    private Object selectedAnswer;
    private Boolean isCorrect;
    private Integer tabSwitchCount;
}
