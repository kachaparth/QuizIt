package com.example.quizit.features.allowedUser;

import com.example.quizit.features.emailService.EmailService;
import com.example.quizit.features.quiz.AsyncInvitationWorker;
import com.example.quizit.features.quiz.Quiz;
import com.example.quizit.features.quiz.QuizRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Transactional
public class InvitationService {
    private final QuizRepository quizRepository;
    private final AllowedUserRepository allowedUserRepository;
    private final AsyncInvitationWorker asyncInvitationWorker;

    @Transactional
    public void sendOneEmail(UUID quizId, UUID allowedUserId, UUID hostId){

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        if (!quiz.getHost().getId().equals(hostId)) {
            throw new AccessDeniedException("Not quiz host");
        }

        AllowedUser user = allowedUserRepository.findById(allowedUserId)
                .orElseThrow(() -> new RuntimeException("Allowed user not found"));

        if (!user.getQuiz().getQuizId().equals(quizId)) {
            throw new IllegalArgumentException("User does not belong to quiz");
        }

        //remove emails for now
//        sendInvitationInternal(quiz, user);
        if (user.getInvitationStatus() == InvitationStatus.NOT_SENT ||
                user.getInvitationStatus() == InvitationStatus.FAILED) {

            user.setInvitationStatus(InvitationStatus.SENT);
            user.setInvitationSentAt(Instant.now());
            user.setDeliveryErrorMessage(null);
        }
        asyncInvitationWorker.processBulkInvitations(quiz, List.of(user));
    }
    @Transactional
    public void sendAllEmail(UUID quizId, UUID hostId) {

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        if (!quiz.getHost().getId().equals(hostId)) {
            throw new AccessDeniedException("Not quiz host");
        }

        List<AllowedUser> users =
                allowedUserRepository.findAllowedUsersByQuiz_QuizIdAndInvitationStatusIn(
                        quizId,
                        List.of(InvitationStatus.NOT_SENT, InvitationStatus.FAILED)
                );

        //removing emails for now!
//        System.out.println("Starting email sending for quiz " + quizId + ". Total users: " + users.size());
//
//        for (AllowedUser user : users) {
//            sendSingleEmailTransactional(quiz, user);
//            try {
//                Thread.sleep(150);
//            } catch (InterruptedException ignored) {}
//        }
//        System.out.println("Finished sending emails for quiz " + quizId);

        for (AllowedUser user : users) {
            user.setInvitationStatus(InvitationStatus.SENT);
            user.setInvitationSentAt(Instant.now());
            user.setDeliveryErrorMessage(null);
        }

        allowedUserRepository.saveAll(users);
        System.out.println("Before async " +  Instant.now());
        if (!users.isEmpty()) {
            asyncInvitationWorker.processBulkInvitations(quiz, users);
        }
        System.out.println("After async " +  Instant.now());
        System.out.println("Published invitations for quiz " + quizId +
                ". Total users: " + users.size());

    }

    @Transactional
    public void sendBulkEmail(UUID quizId, UUID hostId, List<UUID> allowedUserIds) {
        if (allowedUserIds == null || allowedUserIds.isEmpty()) {
            System.out.println("No users selected for bulk email.");
            return;
        }

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        if (!quiz.getHost().getId().equals(hostId)) {
            throw new AccessDeniedException("Not quiz host");
        }

        List<AllowedUser> users = allowedUserRepository.findAllById(allowedUserIds);

        //remove emails for now
//        System.out.println("Starting bulk email sending for quiz " + quizId + ". Total users fetched: " + users.size());
//
//        for (AllowedUser user : users) {
//            if (!user.getQuiz().getQuizId().equals(quizId)) {
//                System.err.println("Skipping user " + user.getId() + ": Does not belong to quiz " + quizId);
//                continue;
//            }
//
//            sendSingleEmailTransactional(quiz, user);
//
//            try {
//                Thread.sleep(150);
//            } catch (InterruptedException ignored) {
//                Thread.currentThread().interrupt();
//            }
//        }
//
//        System.out.println("Finished bulk sending emails for quiz " + quizId);

        Instant now = Instant.now();

        for (AllowedUser user : users) {

            if (!user.getQuiz().getQuizId().equals(quizId)) {
                continue;
            }

            if (user.getInvitationStatus() == InvitationStatus.NOT_SENT ||
                    user.getInvitationStatus() == InvitationStatus.FAILED) {

                user.setInvitationStatus(InvitationStatus.SENT);
                user.setInvitationSentAt(now);
                user.setDeliveryErrorMessage(null);
            }
        }
        List<AllowedUser> validUsers = users.stream()
                .filter(u -> u.getQuiz().getQuizId().equals(quizId))
                .toList();
        if (!validUsers.isEmpty()) {
            asyncInvitationWorker.processBulkInvitations(quiz, validUsers);
        }
        allowedUserRepository.saveAll(users);
    }
}
