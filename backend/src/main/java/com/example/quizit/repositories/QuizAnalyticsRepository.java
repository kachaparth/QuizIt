package com.example.quizit.repositories;

import com.example.quizit.entities.QuizAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface QuizAnalyticsRepository extends JpaRepository<QuizAnalytics, UUID> {
    Optional<QuizAnalytics> findQuizAnalyticsByQuiz_QuizId(UUID quizQuizId);
    Optional<QuizAnalytics> findQuizAnalyticsByWinnerUser_Id(UUID winnerUserId);
}
