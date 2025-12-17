package com.example.quizit.repositories;

import com.example.quizit.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    boolean existsByemail(String email);
    User findByemail(String email);

    @Override
    <S extends User> S save(S entity);
}
