package com.example.quizit.services.interfaces;

import com.example.quizit.dtos.QuizAnalyticsDto;

import java.util.List;
import java.util.UUID;

public interface QuizAnalyticsService {
    QuizAnalyticsDto createQuizAnalytics(QuizAnalyticsDto quizAnalyticsDto);
    QuizAnalyticsDto getAnalyticsByQuizId(String quizId);
    List<QuizAnalyticsDto> getAllAnalytics();
    List<QuizAnalyticsDto> getAnalyticsByWinnerUser(String userId);
}
