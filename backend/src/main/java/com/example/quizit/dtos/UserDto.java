package com.example.quizit.dtos;


import com.example.quizit.entities.Provider;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class UserDto {

    private UUID id;

    private String email;
    private String role;
    private String username;
    private String password;

    private String image;

    private Boolean enable;
    private Instant createdAt;
    private Instant updatedAt;
    private Provider provider;

}
