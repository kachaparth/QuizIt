package com.example.quizit.config;


import com.example.quizit.dtos.QuestionAnalyticsQuizDto;
import com.example.quizit.dtos.QuizAnalyticsDto;
import com.example.quizit.dtos.QuizDto;
import com.example.quizit.entities.QuestionAnalyticsQuiz;
import com.example.quizit.entities.Quiz;
import com.example.quizit.entities.QuizAnalytics;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ProjectConfig {

    @Bean
    public ModelMapper modelMapper() {

        return new ModelMapper();
    }
}
