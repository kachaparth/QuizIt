package com.example.quizit.services.interfaces;

import com.example.quizit.dtos.ParticipantDto;

public interface ParticipantService {

    public ParticipantDto getParticipantById(String uuid);
    public ParticipantDto getParticipantByQuizId(String uuid);

}
