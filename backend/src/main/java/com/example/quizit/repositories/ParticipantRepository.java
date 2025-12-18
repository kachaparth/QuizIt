package com.example.quizit.repositories;

import com.example.quizit.entities.Participant;
import com.example.quizit.entities.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ParticipantRepository extends JpaRepository<Participant, UUID> {

    List<Participant> findAllByQuiz(Quiz quiz);

}
