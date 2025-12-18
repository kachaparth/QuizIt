package com.example.quizit.services;

import com.example.quizit.dtos.QuestionDto;
import com.example.quizit.entities.Question;
import com.example.quizit.exceptions.ResourceNotFoundException;
import com.example.quizit.helpers.UserHelper;
import com.example.quizit.repositories.QuestionRepository;
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

    @Override
    public QuestionDto createQuestion(QuestionDto questionDto) {

        if(questionDto.getQuiz() == null ) {
            throw new IllegalArgumentException("Quiz is required");
        }
        if(questionDto.getCorrectAnswer() == null || questionDto.getCorrectAnswer().equals("") ) {
            throw new IllegalArgumentException("Correct answer is required");
        }
        if (questionDto.getDuration() == null || questionDto.getDuration().equals("") ) {
            throw new IllegalArgumentException("Duration is required");
        }

        Question que =  modelMapper.map(questionDto, Question.class);
        Question savedQuestion = questionRepository.save(que);
        return modelMapper.map(savedQuestion, QuestionDto.class);
    }

    @Override
    public QuestionDto updateQuestion(String id, QuestionDto questionDto) {

        if (questionDto == null) {
            throw new ResourceNotFoundException();
        }
         UUID  uuid = UserHelper.parseUUID(id);

        Question existingQuestion = questionRepository.findById(uuid).orElseThrow(()-> new ResourceNotFoundException("Question not found!"));
        if(questionDto.getQuiz() != null ) {
            existingQuestion.setQuiz(questionDto.getQuiz());
        }
        if(questionDto.getCorrectAnswer() != null &&  !questionDto.getCorrectAnswer().equals("") ) {
            existingQuestion.setCorrectAnswer(questionDto.getCorrectAnswer());
        }
        if (questionDto.getDuration() != null && !questionDto.getDuration().equals("") ) {
            existingQuestion.setDuration(questionDto.getDuration());
        }
        questionRepository.save(existingQuestion);
        return null;
    }

    @Override
    public void DeleteQuestion(String uuid) {

        UUID id = UserHelper.parseUUID(uuid);
        Question question = questionRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Question not found!"));
        questionRepository.delete(question);
    }
}
