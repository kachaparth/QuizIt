package com.example.quizit.features.emailService;

import com.example.quizit.features.allowedUser.AllowedUser;
import com.example.quizit.features.quiz.Quiz;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.auth.frontend.base-url}")
    private String registerUrl;

    @Async
    public void sendOtp(String toEmail, String otp) {
        int maxAttempts = 3;
        int attempt = 0;

        while (attempt < maxAttempts) {
            try {
                attempt++;

                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setTo(toEmail);
                helper.setSubject("🔒 Verify your QuizIt Account");

                String html = "..."; // your same HTML
                helper.setText(html.formatted(otp), true);

                mailSender.send(message);

                return; // ✅ success → exit method

            } catch (Exception e) {
                System.out.println("Attempt " + attempt + " failed");

                if (attempt == maxAttempts) {
                    throw new RuntimeException("Failed after 3 attempts", e);
                }

                try {
                    Thread.sleep(2000); // wait 2 sec before retry
                } catch (InterruptedException ignored) {
                }
            }
        }
    }

    public CompletableFuture<Void> sendRegisterMail(String toEmail, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setFrom("gohilsuryadeep3101@gmail.com");
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            mailSender.send(message);

            return CompletableFuture.completedFuture(null);

        } catch (Exception e) {
            return CompletableFuture.failedFuture(e);
        }
    }

    @Async
    public void broadcastJoinLinks(Quiz quiz, List<AllowedUser> users) {
        String link = registerUrl + "/waiting-room/" + quiz.getQuizId();
        String subject = "🚀 Your Join Link for " + quiz.getQuizName() + " is Ready! | QuizIt";

        for (AllowedUser user : users) {
            try {
                String body = buildSendJoinLinkBody(quiz, link);
                sendRegisterMail(user.getEmail(), subject, body);
                Thread.sleep(150);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                System.err.println("Broadcast interrupted");
                break;
            } catch (Exception e) {
                System.err.println("Failed to queue mail to: " + user.getEmail());
                e.printStackTrace();
            }
        }
    }

    private String buildSendJoinLinkBody(Quiz quiz, String joinLink) {
        String hostName = quiz.getHost().getUsername();
        ZoneId indiaZone = ZoneId.of("Asia/Kolkata");
        DateTimeFormatter indianFormatter = DateTimeFormatter.ofPattern("dd-MMM-yyyy, hh:mm a");
        String startTime = quiz.getStartTime() != null
                ? quiz.getStartTime().atZone(indiaZone).format(indianFormatter)
                : "To be announced";

        String endTime = quiz.getEndTime() != null
                ? quiz.getEndTime().atZone(indiaZone).format(indianFormatter)
                : "Check portal";

        return """
                <!DOCTYPE html>
                <html>
                <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <table width="100%%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                            <td align="center" style="padding: 40px 0;">
                                <table width="500" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                                    <tr>
                                        <td align="center" style="background: linear-gradient(135deg, #0891b2 0%%, #0e7490 100%%); padding: 35px 20px;">
                                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">QuizIt</h1>
                                            <p style="color: #cffafe; margin: 10px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Secure Access Token</p>
                                        </td>
                                    </tr>
                
                                    <tr>
                                        <td style="padding: 40px 32px;">
                                            <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 22px; text-align: center;">Join Link Generated!</h2>
                
                                            <div style="background-color: #fff7ed; border-left: 4px solid #fb923c; padding: 15px; margin-bottom: 24px;">
                                                <p style="color: #9a3412; font-size: 13px; margin: 0; font-weight: 600;">
                                                    ⚠️ JOINING POLICY:
                                                </p>
                                                <p style="color: #c2410c; font-size: 13px; margin: 5px 0 0 0;">
                                                    • Please join the waiting room <b>5 minutes before</b> the start time.<br/>
                                                    • Access is only allowed between the start and end time. Entry will be <b>blocked</b> after the end time.
                                                </p>
                                            </div>
                
                                            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-bottom: 32px;">
                                                <table width="100%%">
                                                    <tr>
                                                        <td style="padding: 4px 0;"><span style="color: #94a3b8; font-size: 13px;">Quiz:</span></td>
                                                        <td align="right"><span style="color: #1f2937; font-weight: 600; font-size: 14px;">%s</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 4px 0;"><span style="color: #94a3b8; font-size: 13px;">Starts:</span></td>
                                                        <td align="right"><span style="color: #1f2937; font-weight: 600; font-size: 14px;">%s</span></td>
                                                    </tr>
                                                    <tr>
                                                        <td style="padding: 4px 0;"><span style="color: #94a3b8; font-size: 13px;">Ends:</span></td>
                                                        <td align="right"><span style="color: #ef4444; font-weight: 600; font-size: 14px;">%s</span></td>
                                                    </tr>
                                                </table>
                                            </div>
                
                                            <div style="text-align: center;">
                                                <a href="%s" style="background-color: #fb923c; color: #ffffff; padding: 16px 32px; text-decoration: none; font-size: 16px; font-weight: 700; border-radius: 12px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(251, 146, 60, 0.4);">
                                                    Enter Waiting Room
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                
                                    <tr>
                                        <td style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #f3f4f6;">
                                            <p style="color: #6b7280; font-size: 11px; margin: 0;">
                                                This link is unique to your email. Do not share it.<br/>
                                                &copy; 2026 QuizIt Inc.
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
                startTime,
                endTime,
                joinLink
        );
    }
}