package com.example.quizit.services.interfaces;

import com.example.quizit.dtos.QuestionAnalyticsQuizDto;
import com.example.quizit.dtos.UserDto;

import java.util.List;

public interface QuestionAnalyticsQuizService {

    QuestionAnalyticsQuizDto createQuestionAnalytics(QuestionAnalyticsQuizDto dto);
    QuestionAnalyticsQuizDto getQuestionAnalyticsByQuestionId(String questionId);
    List<QuestionAnalyticsQuizDto> getAnalyticsByQuizId(String quizId);
    List<QuestionAnalyticsQuizDto> getAllQuestionAnalytics();
}
