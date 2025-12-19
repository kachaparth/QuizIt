package com.example.quizit.services.interfaces;

import com.example.quizit.dtos.QuestionAnalyticsUserDto;
import com.example.quizit.entities.Participant;
import com.example.quizit.entities.QuestionAnalyticsUser;

import java.util.List;
import java.util.UUID;

public interface QuestionAnalyticsUserService {

     QuestionAnalyticsUserDto createQuestionAnalyticsUser(QuestionAnalyticsUserDto questionAnalyticsUserDto);
     List<QuestionAnalyticsUserDto> getQuestionAnalyticsUsersByParticipantId(String participantId);
     QuestionAnalyticsUserDto getQuestionAnalyticsUserById(String questionAnalyticsUserId);
    QuestionAnalyticsUserDto getQuestionAnalyticsUserById(String participantId, String questionID);

     QuestionAnalyticsUserDto updateQuestionAnalyticsUser(String uuid,QuestionAnalyticsUserDto questionAnalyticsUserDto);
     QuestionAnalyticsUserDto updateQuestionAnalyticsUser(String participantId,String questionId,QuestionAnalyticsUserDto questionAnalyticsUserDto);
     void deleteQuestionAnalyticsUser(String questionAnalyticsUserId);
}
