package com.example.quizit.dtos;

import com.example.quizit.entities.Quiz;
import com.example.quizit.enums.DifficultyLevel;
import jakarta.persistence.Column;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;
import java.util.UUID;


@AllArgsConstructor
@Builder
@NoArgsConstructor
@Setter
@Getter
public class QuestionDto {

    private UUID questionId;
    private UUID quizId;
    private String content;
    private Map<String, Object> correctAnswer;
    private Map<String, Object> options;
    private Integer duration;
    private String questionType;
    private DifficultyLevel difficultyLevel;

    private QuestionForUserDto toQuestionForUserDto(QuestionDto dto) {
        QuestionForUserDto userDto = new QuestionForUserDto();
        userDto.setQuestionId(dto.getQuestionId());
        userDto.setQuizId(dto.getQuizId());
        userDto.setContent(dto.getContent());
        userDto.setOptions(dto.getOptions());
        userDto.setDuration(dto.getDuration());
        userDto.setQuestionType(dto.getQuestionType());
        return userDto;
    }
}
