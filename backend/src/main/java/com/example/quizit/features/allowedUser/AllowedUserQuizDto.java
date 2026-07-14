package com.example.quizit.features.allowedUser;

import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AllowedUserQuizDto {
    private UUID quizId;
    private String quizTitle;
    private Instant startTime;
    private Instant endTime;
    private InvitationStatus invitationStatus;
    private boolean canJoin;
    private String registerURL;
    private String joinURL;
}
