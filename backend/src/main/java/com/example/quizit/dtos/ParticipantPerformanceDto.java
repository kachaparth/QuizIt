package com.example.quizit.dtos;

import com.example.quizit.entities.Participant;
import com.example.quizit.entities.Quiz;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;
@Getter
@Setter
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class ParticipantPerformanceDto {

    private UUID performanceId;
    private Participant participant;
    private Quiz quiz;
    private Integer score;
    private Integer rank;
    private Long totalTimeSpent;
    private Float cheatingRiskScore;
}
