package com.example.quizit.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "user_role")
public class Role {
    @Id
    @GeneratedValue
    private UUID id =  UUID.randomUUID();
    @Column(unique = true,nullable = false)
    private String name;
}
