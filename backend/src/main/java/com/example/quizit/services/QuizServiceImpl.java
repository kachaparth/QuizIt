package com.example.quizit.services;


import com.example.quizit.dtos.QuizDto;
import com.example.quizit.entities.Quiz;
import com.example.quizit.exceptions.ResourceNotFoundException;
import com.example.quizit.helpers.UserHelper;
import com.example.quizit.repositories.QuizRepository;
import com.example.quizit.services.interfaces.QuizService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;
    private final ModelMapper modelMapper;

    @Override
    public QuizDto createQuiz(QuizDto quizDto) {
        if(quizDto.getQuizName() == null || quizDto.getHost() == null){
            throw new IllegalArgumentException("Quiz name is required");
        }
        if(quizRepository.existsByQuizNameAndHostId(quizDto.getQuizName(), quizDto.getHost())){
            throw new IllegalArgumentException("Quiz already exists");
        }
        Quiz quiz = modelMapper.map(quizDto, Quiz.class);
        Quiz savedQuiz = quizRepository.save(quiz);
        return modelMapper.map(savedQuiz, QuizDto.class);
    }

    @Override
    public QuizDto updateQuiz(String quizId, QuizDto quizDto) {
        if(quizDto == null){
            throw new IllegalArgumentException("Quiz data is required");
        }
        UUID quizUUID = UserHelper.parseUUID(quizId);
        Quiz existingQuiz = quizRepository.findById(quizUUID)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
        /*
            quizName, quizType, mode, startTime, endTime
        */
        if(quizDto.getQuizName() != null) existingQuiz.setQuizName(quizDto.getQuizName());
        if(quizDto.getQuizType() != null) existingQuiz.setQuizType(quizDto.getQuizType());
        if(quizDto.getMode() != null) existingQuiz.setMode(quizDto.getMode());
        if(quizDto.getStartTime() != null) existingQuiz.setStartTime(quizDto.getStartTime());
        if(quizDto.getEndTime() != null) existingQuiz.setEndTime(quizDto.getEndTime());

        Quiz savedQuiz = quizRepository.save(existingQuiz);

        return modelMapper.map(savedQuiz, QuizDto.class);
    }

    @Override
    public QuizDto getQuizById(String quizId) {
        if(quizId == null){
            throw new IllegalArgumentException("Quiz id is null");
        }
        UUID quizUUID = UserHelper.parseUUID(quizId);
        Quiz existingQuiz = quizRepository.findById(quizUUID)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
        return modelMapper.map(existingQuiz, QuizDto.class);
    }

    @Override
    public List<QuizDto> getQuizzesByHost(String hostId) {
        UUID hostUUID = UserHelper.parseUUID(hostId);

        return quizRepository.findQuizByHost_Id(hostUUID)
                .stream()
                .map(quiz -> modelMapper.map(quiz, QuizDto.class))
                .toList();
    }

    @Override
    public List<QuizDto> getAllQuizzes() {
        return quizRepository.findAll()
                .stream()
                .map(quiz->modelMapper.map(quiz, QuizDto.class))
                .toList();
    }

    @Override
    public void deleteQuiz(String quizId) {
        UUID quizUUID = UserHelper.parseUUID(quizId);
        Quiz existingQuiz = quizRepository.findById(quizUUID)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
        quizRepository.delete(existingQuiz);
    }
}
