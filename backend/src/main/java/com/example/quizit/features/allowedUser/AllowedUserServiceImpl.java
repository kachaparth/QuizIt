package com.example.quizit.features.allowedUser;


import com.example.quizit.exceptions.ResourceNotFoundException;
import com.example.quizit.features.quiz.Quiz;
import com.example.quizit.features.quiz.QuizRepository;
import com.example.quizit.features.quiz.QuizStatus;
import com.example.quizit.features.user.User;
import com.example.quizit.features.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AllowedUserServiceImpl implements AllowedUserSerivce{
    private final QuizRepository quizRepository;
    private final AllowedUserRepository allowedUserRepository;
    private final UserRepository userRepository;

    private static final long TOKEN_EXPIRY_SECONDS = 172800;

    @Value("${app.auth.frontend.base-url}")
    private String registerUrl;

    @Override
    @Transactional
    public AllowedUserResponse createAllowedUser(AllowedUserRequest request) {

        if (request == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }

        if(allowedUserRepository.existsAllowedUserByEmailAndQuiz_QuizId(request.getEmail(), request.getQuizId())){
            throw new IllegalStateException("User already allowed for this quiz");
        }

        Quiz quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        AllowedUser allowedUser = AllowedUser.builder()
                .email(request.getEmail())
                .token(UUID.randomUUID().toString())
                .registered(false)
                .tokenExpiry(Instant.now().plusSeconds(TOKEN_EXPIRY_SECONDS))
                .quiz(quiz)
                .invitationStatus(InvitationStatus.NOT_SENT)
                .build();

        allowedUserRepository.save(allowedUser);

        return AllowedUserResponse.builder()
                .id(allowedUser.getId())
                .email(allowedUser.getEmail())
                .registered(false)
                .build();
    }

    @Override
    @Transactional
    public void createAllowedUserInBulk(UUID quizId, List<String> emails) {

        if (quizId == null) {
            throw new IllegalArgumentException("quiz id is null");
        }

        if (emails == null || emails.isEmpty()) {
            return;
        }

        Quiz quiz = quizRepository.getReferenceById(quizId);

        List<AllowedUser> allowedUsers = emails.stream()
                .map(email -> AllowedUser.builder()
                        .email(email.trim().toLowerCase())
                        .token(UUID.randomUUID().toString())
                        .registered(false)
                        .tokenExpiry(Instant.now().plusSeconds(172800))
                        .quiz(quiz)
                        .invitationStatus(InvitationStatus.NOT_SENT)
                        .build())
                .toList();

        allowedUserRepository.saveAll(allowedUsers);
    }

    @Override
    @Transactional
    public void deleleAllowedUserInBulk(UUID quizId, List<String> emails) {
        if (quizId == null) {
            throw new IllegalArgumentException("quiz id is null");
        }

        if (emails == null || emails.isEmpty()) {
            return;
        }
        allowedUserRepository.deleteAllowedUsersByQuiz_QuizIdAndEmailIn(quizId, emails);
    }

    @Override
    public List<AllowedUserStatusDto> getAllAllowedUser(String quizId,UUID userId) {
        UUID quizUUID = UUID.fromString(quizId);
        if(!quizRepository.existsByQuizIdAndHostId(quizUUID,userId))
            throw new ResourceNotFoundException("Quiz not found");

        List<AllowedUserStatusDto> allowedUsers =  allowedUserRepository.findAllByQuiz_QuizId(quizUUID)
                .stream()
                .map(
                 allowedUser -> AllowedUserStatusDto.builder()
                         .invitationStatus(allowedUser.getInvitationStatus())
                         .registered(allowedUser.isRegistered())
                         .email(allowedUser.getEmail())
                         .quiz(allowedUser.getQuiz().getQuizId())
                         .id(allowedUser.getId())
                         .invitationSentAt(allowedUser.getInvitationSentAt())
                         .deliveryErrorMessage(allowedUser.getDeliveryErrorMessage())
                         .build())
                .toList();

        return allowedUsers;
    }

    @Override
    public List<AllowedUserQuizDto> getAllQuizzesOfAllowedUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String email = user.getEmail();
        List<AllowedUser> allowedUsers = allowedUserRepository.findDashboardQuizzes(email);

        List<AllowedUserQuizDto> allowedUserQuizDtos = allowedUsers.stream()
                .filter(allowedUser -> allowedUser.getQuiz().getCanJoin() != null)
                .map(allowedUser -> {
                    Quiz quiz = allowedUser.getQuiz();

                    String registerURL = null;
                    String joinURL = null;

                    if (allowedUser.getInvitationStatus() == InvitationStatus.SENT ||
                            allowedUser.getInvitationStatus() == InvitationStatus.FAILED) {

                        registerURL = registerUrl + "/register-exam/"
                                + quiz.getQuizId() + "/"
                                + allowedUser.getToken();
                    }

                    if (allowedUser.getInvitationStatus() == InvitationStatus.REGISTERED &&
                            Boolean.TRUE.equals(quiz.getCanJoin())) {
                        joinURL = registerUrl + "/waiting-room/" + quiz.getQuizId();
                    }

                    return AllowedUserQuizDto.builder()
                            .quizId(quiz.getQuizId())
                            .quizTitle(quiz.getQuizName())
                            .startTime(quiz.getStartTime())
                            .endTime(quiz.getEndTime())
                            .invitationStatus(allowedUser.getInvitationStatus())
                            .canJoin(quiz.getCanJoin())
                            .registerURL(registerURL)
                            .joinURL(joinURL)
                            .build();
                })
                .toList();
        for(AllowedUserQuizDto allowedUserQuizDto : allowedUserQuizDtos){
            System.out.println(allowedUserQuizDto.getQuizTitle());
        }
        return allowedUserQuizDtos;
    }
}
