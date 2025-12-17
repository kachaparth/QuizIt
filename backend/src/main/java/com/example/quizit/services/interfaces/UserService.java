package com.example.quizit.services.interfaces;


import com.example.quizit.dtos.UserDto;


public interface UserService {


    UserDto createUser(UserDto userDto);

    UserDto updateUser(UserDto userDto);
    UserDto updateUser(UserDto userDto, String id);

    UserDto getUserByEmail(String email);
    UserDto getUserById(String id);
    void deleteUser(String uuid);

    Iterable<UserDto> getAllUsers();

}
