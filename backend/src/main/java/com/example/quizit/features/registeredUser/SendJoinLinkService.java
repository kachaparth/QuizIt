package com.example.quizit.features.registeredUser;

import com.example.quizit.features.allowedUser.AllowedUser;
import com.example.quizit.features.allowedUser.AllowedUserRepository;
import com.example.quizit.features.emailService.EmailService;
import com.example.quizit.features.quiz.Quiz;
import com.example.quizit.features.quiz.QuizRepository;
import com.example.quizit.features.quiz.QuizService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class SendJoinLinkService {
    private final QuizRepository quizRepository;
    private final AllowedUserRepository allowedUserRepository;
    private final EmailService emailService;
    private final QuizService quizService;
    @Value("${app.auth.frontend.base-url}")
    private String registerUrl;

    @Transactional
    public void sendJoinLinkAll(UUID quizId, UUID hostId) {

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        if (!quiz.getHost().getId().equals(hostId)) {
            throw new AccessDeniedException("Not quiz host");
        }

        List<AllowedUser> users =
                allowedUserRepository.findAllByQuiz_QuizIdAndRegistered(quizId, true);

        //async emails for now
        emailService.broadcastJoinLinks(quiz, users);

        quiz.setCanJoin(true);
        quizService.scheduleQuizEnd(quiz);
        quizRepository.save(quiz);
    }
}
