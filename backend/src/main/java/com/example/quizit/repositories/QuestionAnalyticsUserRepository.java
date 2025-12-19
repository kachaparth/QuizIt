package com.example.quizit.repositories;

import com.example.quizit.entities.Participant;
import com.example.quizit.entities.Question;
import com.example.quizit.entities.QuestionAnalyticsQuiz;
import com.example.quizit.entities.QuestionAnalyticsUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface QuestionAnalyticsUserRepository extends JpaRepository<QuestionAnalyticsUser, UUID> {


    QuestionAnalyticsUser save(QuestionAnalyticsUser questionAnalyticsUser);
    void deleteById(UUID uuid);
    boolean existsByParticipantAndQuestion(Participant participant, Question question);
    Optional<QuestionAnalyticsUser> findByParticipant_ParticipantIdAndQuestion_QuestionId(UUID participantId, UUID questionId);
    List<QuestionAnalyticsUser> findAllByParticipant(Participant participant);
}
