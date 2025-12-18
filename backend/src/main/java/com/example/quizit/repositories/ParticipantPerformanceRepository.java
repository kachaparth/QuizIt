package com.example.quizit.repositories;

import com.example.quizit.entities.ParticipantPerformance;
import com.example.quizit.entities.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ParticipantPerformanceRepository extends JpaRepository<ParticipantPerformance, UUID> {

    List<ParticipantPerformance> findAllByQuiz(Quiz quiz);


}
