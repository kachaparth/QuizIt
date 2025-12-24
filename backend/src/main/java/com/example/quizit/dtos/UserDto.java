package com.example.quizit.dtos;


import com.example.quizit.entities.Role;
import com.example.quizit.enums.Provider;

import lombok.*;

import java.time.Instant;
import java.util.Set;
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

    private Set<Role> roles;

}
