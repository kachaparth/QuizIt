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

        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration()
                .setAmbiguityIgnored(true);
        mapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT);
        mapper.typeMap(Quiz.class, QuizDto.class)
                .addMappings(m ->
                        m.map(src -> src.getHost().getId(), QuizDto::setHost)
                );

        mapper.typeMap(QuizAnalytics.class, QuizAnalyticsDto.class)
                .addMappings(m -> {
                    m.map(src -> src.getQuiz().getQuizId(),
                            QuizAnalyticsDto::setQuizId);

                    m.map(src -> src.getWinnerUser().getId(),
                            QuizAnalyticsDto::setWinnerUserId);
                });
        mapper.typeMap(QuestionAnalyticsQuiz.class, QuestionAnalyticsQuizDto.class)
                .addMappings(m -> {
                    m.map(src -> src.getQuiz().getQuizId(), QuestionAnalyticsQuizDto::setQuizId);
                    m.map(src -> src.getQuestion().getQuestionId(), QuestionAnalyticsQuizDto::setQuestionId);
                    m.map(src -> src.getFastestUser().getId(), QuestionAnalyticsQuizDto::setFastestUserId);
                });
        return mapper;
    }
}
