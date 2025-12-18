package com.example.quizit.services.interfaces;

import com.example.quizit.dtos.QuestionDto;

import java.util.List;

public interface QuestionService {

    QuestionDto getQuestionById(String uuid);
    QuestionDto createQuestion(QuestionDto questionDto);
    QuestionDto updateQuestion(String uuid,QuestionDto questionDto);
    void DeleteQuestion(String uuid);
    List<QuestionDto> getAllQuestionsOfQuiz(String quizId);
}
