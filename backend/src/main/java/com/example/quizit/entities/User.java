package com.example.quizit.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id")
    private UUID id;

    @Column(name = "user_email", unique = true,length = 100)
    private String email;
    private String role;
    private String username;
    private String password;

    private String image;

    private boolean enable = true;


    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();



    @PrePersist
    private void onCreate() {
        Instant  now  = Instant.now();
        if(this.createdAt == null) {
            this.createdAt = now;
        }
        this.updatedAt = now;
    }

    @PreUpdate
    private void onUpdate() {
        this.updatedAt = Instant.now();
    }

    @Enumerated(EnumType.STRING)
    private Provider provider = Provider.LOCAL;


}
