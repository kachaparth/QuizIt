package com.example.quizit.features.quiz;

import com.example.quizit.features.allowedUser.AllowedUser;
import com.example.quizit.features.allowedUser.AllowedUserRepository;
import com.example.quizit.features.allowedUser.InvitationStatus;
import com.example.quizit.features.emailService.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AsyncInvitationWorker {

    private final EmailService emailService;
    private final AllowedUserRepository allowedUserRepository;

    @Value("${app.auth.frontend.base-url}")
    private String registerUrl;

    @Async
    public void processBulkInvitations(Quiz quiz, List<AllowedUser> users) {
        System.out.println("Starting background bulk email worker for quiz: " + quiz.getQuizId() + " " + Instant.now());
        System.out.println("Async thread = " + Thread.currentThread().getName());
        for (AllowedUser user : users) {
            String link = registerUrl + "/register-exam/" + quiz.getQuizId() + "/" + user.getToken();

            try {
                emailService.sendRegisterMail(
                        user.getEmail(),
                        "📩 Invitation: Register for " + quiz.getQuizName() + " | QuizIt",
                        buildEmailBody(quiz, link)
                );

                user.setInvitationStatus(InvitationStatus.SENT);
                user.setInvitationSentAt(Instant.now());
                user.setDeliveryErrorMessage(null);
                System.out.println("Email sent successfully to: " + user.getEmail());
                Thread.sleep(150);

            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                System.err.println("Broadcast interrupted");
                break;
            } catch (Exception e) {
                user.setInvitationStatus(InvitationStatus.FAILED);
                user.setDeliveryErrorMessage(e.getMessage());
                System.err.println("Failed to send email to: " + user.getEmail());
            }

            allowedUserRepository.save(user);
        }

        System.out.println("Finished background bulk email worker for quiz: " + quiz.getQuizId());
    }

    private String buildEmailBody(Quiz quiz, String registrationLink) {
        String hostName = quiz.getHost().getUsername();
        // Using the Indian Time Zone logic
        ZoneId indiaZone = ZoneId.of("Asia/Kolkata");
        DateTimeFormatter indianFormatter = DateTimeFormatter.ofPattern("dd-MMM-yyyy, hh:mm a");

        String startTime = quiz.getStartTime() != null
                ? quiz.getStartTime().atZone(indiaZone).format(indianFormatter)
                : "To be announced";

        String endTime = quiz.getEndTime() != null
                ? quiz.getEndTime().atZone(indiaZone).format(indianFormatter)
                : "Not specified";

        return """
    <!DOCTYPE html>
    <html>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table width="100%%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td align="center" style="padding: 40px 0;">
                    <table width="550" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                        <tr>
                            <td align="center" style="background: linear-gradient(135deg, #0891b2 0%%, #0e7490 100%%); padding: 35px 20px;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">QuizIt</h1>
                                <p style="color: #cffafe; margin: 10px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Official Invitation</p>
                            </td>
                        </tr>
                        
                        <tr>
                            <td style="padding: 40px 32px;">
                                <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 22px; text-align: center;">You've Been Invited!</h2>
                                <p style="color: #4b5563; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
                                    A new assessment has been scheduled for you. Please register using the portal link below to secure your spot.
                                </p>
                                
                                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                                    <table width="100%%">
                                        <tr>
                                            <td style="padding: 6px 0;"><span style="color: #94a3b8; font-size: 13px; font-weight: 600; text-transform: uppercase;">Quiz Name</span></td>
                                            <td align="right"><span style="color: #1f2937; font-weight: 700; font-size: 15px;">%s</span></td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 6px 0;"><span style="color: #94a3b8; font-size: 13px; font-weight: 600; text-transform: uppercase;">Hosted By</span></td>
                                            <td align="right"><span style="color: #1f2937; font-weight: 600; font-size: 14px;">%s</span></td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 6px 0;"><span style="color: #94a3b8; font-size: 13px; font-weight: 600; text-transform: uppercase;">Mode</span></td>
                                            <td align="right"><span style="color: #0891b2; font-weight: 700; font-size: 14px;">%s</span></td>
                                        </tr>
                                        <tr><td colspan="2" style="border-bottom: 1px solid #e2e8f0; padding: 10px 0;"></td></tr>
                                        <tr>
                                            <td style="padding: 12px 0 4px 0;"><span style="color: #94a3b8; font-size: 13px;">Start Time:</span></td>
                                            <td align="right" style="padding-top: 12px;"><span style="color: #1f2937; font-weight: 600; font-size: 14px;">%s</span></td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 4px 0;"><span style="color: #94a3b8; font-size: 13px;">End Time:</span></td>
                                            <td align="right"><span style="color: #1f2937; font-weight: 600; font-size: 14px;">%s</span></td>
                                        </tr>
                                    </table>
                                </div>

                                <div style="text-align: center;">
                                    <a href="%s" style="background-color: #fb923c; color: #ffffff; padding: 16px 36px; text-decoration: none; font-size: 15px; font-weight: 700; border-radius: 14px; display: inline-block; box-shadow: 0 4px 10px rgba(251, 146, 60, 0.3); text-transform: uppercase; letter-spacing: 0.5px;">
                                        Complete Registration
                                    </a>
                                </div>
                            </td>
                        </tr>
                        
                        <tr>
                            <td style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #f3f4f6;">
                                <p style="color: #94a3b8; font-size: 11px; margin: 0 0 8px 0;">
                                    You received this because you are whitelisted for this session.
                                </p>
                                <p style="color: #6b7280; font-size: 12px; font-weight: 600; margin: 0;">
                                    &copy; 2026 QuizIt Team
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """.formatted(
                quiz.getQuizName(),
                hostName,
                quiz.getMode(),
                startTime,
                endTime,
                registrationLink
        );
    }
}
