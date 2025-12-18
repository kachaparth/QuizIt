package com.example.quizit.services;

import com.example.quizit.dtos.QuestionDto;
import com.example.quizit.entities.Question;
import com.example.quizit.entities.Quiz;
import com.example.quizit.exceptions.ResourceNotFoundException;
import com.example.quizit.helpers.UserHelper;
import com.example.quizit.repositories.QuestionRepository;
import com.example.quizit.repositories.QuizRepository;
import com.example.quizit.repositories.UserRepository;
import com.example.quizit.services.interfaces.QuestionService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class QuestionServiceImpl implements QuestionService {
    private final QuestionRepository questionRepository;
    private final QuizRepository quizRepository;
    private final ModelMapper modelMapper;

    @Override
    public QuestionDto getQuestionById(String uuid) {

        UUID id = UUID.fromString(uuid);
        Question question = questionRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Question with id " + id + " not found"));

        return modelMapper.map(question, QuestionDto.class);
    }

    @Override
    public List<QuestionDto> getAllQuestionsOfQuiz(String quizId) {

        UUID id = UserHelper.parseUUID(quizId);
        return questionRepository.findByQuiz_QuizId(UUID.fromString(quizId))
                .stream()
                .map(question->modelMapper.map(question,QuestionDto.class))
                .toList();

    }

    public QuestionDto createQuestion(QuestionDto questionDto) {

        if (questionDto.getQuizId() == null) {
            throw new IllegalArgumentException("Quiz ID is required");
        }

        if (questionDto.getCorrectAnswer() == null) {
            throw new IllegalArgumentException("Correct answer is required");
        }

        if (questionDto.getDuration() == null) {
            throw new IllegalArgumentException("Duration is required");
        }

        Quiz quiz = quizRepository.findById(questionDto.getQuizId())
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        Question question = modelMapper.map(questionDto, Question.class);
        question.setQuiz(quiz);
        Question savedQuestion = questionRepository.save(question);
        return modelMapper.map(savedQuestion, QuestionDto.class);
    }

    @Override
    public QuestionDto updateQuestion(String id, QuestionDto questionDto) {

        if (questionDto == null) {
            throw new ResourceNotFoundException();
        }
         UUID  uuid = UserHelper.parseUUID(id);

        Question existingQuestion = questionRepository.findById(uuid).orElseThrow(()-> new ResourceNotFoundException("Question not found!"));


        if(questionDto.getQuizId() != null ) {
         Quiz quiz = quizRepository.findById(questionDto.getQuizId())
                    .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

            existingQuestion.setQuiz(quiz);
        }
        if (questionDto.getCorrectAnswer() != null) {
            existingQuestion.setCorrectAnswer(questionDto.getCorrectAnswer());
        }
        if (questionDto.getDuration() != null) {
            existingQuestion.setDuration(questionDto.getDuration());
        }

            existingQuestion.setContent(questionDto.getContent());
            existingQuestion.setQuestionType(questionDto.getQuestionType());
            existingQuestion.setDifficultyLevel(questionDto.getDifficultyLevel());
            existingQuestion.setOptions(questionDto.getOptions());

        Question newQuestion=    questionRepository.save(existingQuestion);
        return modelMapper.map(newQuestion, QuestionDto.class);
    }

    @Override
    public void DeleteQuestion(String uuid) {

        UUID id = UserHelper.parseUUID(uuid);
        Question question = questionRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Question not found!"));
        questionRepository.delete(question);
    }
}
