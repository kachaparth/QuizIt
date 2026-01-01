package com.example.quizit.services;


import com.example.quizit.dtos.QuizDto;
import com.example.quizit.entities.Quiz;
import com.example.quizit.exceptions.ResourceNotFoundException;
import com.example.quizit.helpers.UserHelper;
import com.example.quizit.repositories.QuizRepository;
import com.example.quizit.repositories.UserRepository;
import com.example.quizit.services.interfaces.QuizService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {


    private final QuizRepository quizRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private void validateQuizTimeWindow(Instant startTime, Instant endTime) {

        if (startTime == null || endTime == null) {
            return;
        }

        if (!endTime.isAfter(startTime)) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        Duration duration = Duration.between(startTime, endTime);

        if (duration.toDays() > 3) {
            throw new IllegalArgumentException(
                    "Quiz duration cannot exceed 3 days"
            );
        }
    }


    @Override
    public QuizDto createQuiz(QuizDto quizDto) {

        if (quizDto == null || quizDto.getQuizName() == null || quizDto.getHost() == null) {
            throw new IllegalArgumentException("Quiz name and host are required");
        }

        validateQuizTimeWindow(
                quizDto.getStartTime(),
                quizDto.getEndTime()
        );

        if (quizRepository.existsByQuizNameAndHostId(
                quizDto.getQuizName(), quizDto.getHost())) {
            throw new IllegalArgumentException("Quiz already exists");
        }

        Quiz quiz = new Quiz();
        quiz.setQuizName(quizDto.getQuizName());
        quiz.setMode(quizDto.getMode());
        quiz.setStartTime(quizDto.getStartTime());
        quiz.setEndTime(quizDto.getEndTime());

        quiz.setAllowGuest(quizDto.isAllowGuest());
        quiz.setShuffleQuestions(quizDto.isShuffleQuestions());
        quiz.setShowLeaderboard(quizDto.isShowLeaderboard());

        quiz.setHost(
                userRepository.getReferenceById(quizDto.getHost())
        );

        Quiz savedQuiz = quizRepository.save(quiz);

        return modelMapper.map(savedQuiz, QuizDto.class);
    }

    @Override
    public QuizDto updateQuiz(String quizId, QuizDto quizDto) {

        if (quizDto == null) {
            throw new IllegalArgumentException("Quiz data is required");
        }



        UUID quizUUID = UserHelper.parseUUID(quizId);

        Quiz existingQuiz = quizRepository.findById(quizUUID)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));


        Instant start = quizDto.getStartTime() != null
                ? quizDto.getStartTime()
                : existingQuiz.getStartTime();

        Instant end = quizDto.getEndTime() != null
                ? quizDto.getEndTime()
                : existingQuiz.getEndTime();

        validateQuizTimeWindow(start, end);


        if (quizDto.getQuizName() != null)
            existingQuiz.setQuizName(quizDto.getQuizName());

        if (quizDto.getMode() != null)
            existingQuiz.setMode(quizDto.getMode());

        if (quizDto.getStartTime() != null)
            existingQuiz.setStartTime(quizDto.getStartTime());

        if (quizDto.getEndTime() != null)
            existingQuiz.setEndTime(quizDto.getEndTime());

        /* Settings */
        existingQuiz.setAllowGuest(quizDto.isAllowGuest());
        existingQuiz.setShuffleQuestions(quizDto.isShuffleQuestions());
        existingQuiz.setShowLeaderboard(quizDto.isShowLeaderboard());

        Quiz savedQuiz = quizRepository.save(existingQuiz);

        return modelMapper.map(savedQuiz, QuizDto.class);
    }

    @Override
    public QuizDto getQuizById(String quizId) {

        if (quizId == null) {
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
                .map(quiz -> modelMapper.map(quiz, QuizDto.class))
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

