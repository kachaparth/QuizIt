package com.example.quizit.controllers;

import com.example.quizit.dtos.UserDto;
import com.example.quizit.entities.User;
import com.example.quizit.records.LoginReuest;
import com.example.quizit.records.TokenResponse;
import com.example.quizit.repositories.UserRepository;
import com.example.quizit.security.CookieService;
import com.example.quizit.security.JwtService;
import com.example.quizit.security.RefreshToken;
import com.example.quizit.security.RefreshTokenRepository;
import com.example.quizit.services.interfaces.RegisterService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.UUID;

@RestController
@RequestMapping("/quizit")
@AllArgsConstructor
public class AuthenticationController {


    private final AuthenticationManager authenticationManager;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final CookieService cookieService;
   private final RegisterService registerService;
   private final UserRepository userRepository;
   private final ModelMapper modelMapper;

   @PostMapping("/login")
   public ResponseEntity<TokenResponse> login(@RequestBody LoginReuest loginReuest, HttpServletResponse response)
   {
        Authentication authentication=  authenticate(loginReuest);
        User user = userRepository.findByemail(loginReuest.email())
                .orElseThrow(()->new BadCredentialsException("Invalid email or password"));
        if(!user.isEnabled())
        {
            throw new DisabledException("User is disabled");
        }


        var refreshTokenOb = RefreshToken.builder()
                .jti(UUID.randomUUID().toString())
                .user(user)
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(jwtService.getRefreshTokenValiditySeconds()))
                .revoked(false)
                .build();

        refreshTokenRepository.save(refreshTokenOb);

        String token = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user,refreshTokenOb.getJti());

        cookieService.attachRefreshCookie(response,refreshToken, (int) jwtService.getRefreshTokenValiditySeconds());
        cookieService.addNoStoreHeader(response);

        TokenResponse tokenResponse =
                TokenResponse.of(
                        token,
                        refreshToken,
                        jwtService.getAccessTokenValiditySeconds(),
                        modelMapper.map(user, UserDto.class)
                );
        return ResponseEntity.ok(tokenResponse);
   }

   private Authentication authenticate(LoginReuest loginReuest)
   {
       try {
          return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginReuest.email(),loginReuest.password()));
       }
       catch (Exception e){
           throw new BadCredentialsException("Invalid username or password");
       }

   }


   @PostMapping("/register")
    public ResponseEntity<UserDto> registerUser(@RequestBody UserDto userDto) {
      UserDto userdto1 =  registerService.registerUser(userDto);
      return ResponseEntity.ok(userdto1);
   }

}
