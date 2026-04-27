package service_center.security.oauth2;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import service_center.domain.entity.RefreshToken;
import service_center.domain.entity.User;
import service_center.domain.enums.Role;
import service_center.repository.RefreshTokenRepository;
import service_center.repository.UserRepository;
import service_center.security.jwt.JwtService;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Component
@Slf4j
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public OAuth2AuthenticationSuccessHandler(
            UserRepository userRepository,
            RefreshTokenRepository refreshTokenRepository,
            JwtService jwtService,
            @Lazy PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2AuthenticationToken authToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oauth2User = authToken.getPrincipal();
        String provider = authToken.getAuthorizedClientRegistrationId();

        String email = extractEmail(oauth2User, provider);
        String oauthId = oauth2User.getName(); // Usually the internal ID

        if (email == null) {
            log.error("Email not found in OAuth2 provider: {}", provider);
            response.sendRedirect("http://localhost:3000/login?error=email_not_found");
            return;
        }

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createNewUser(email, oauth2User, provider, oauthId));

        // Update provider info if not set
        if (user.getOauthProvider() == null) {
            user.setOauthProvider(provider);
            user.setOauthId(oauthId);
            userRepository.save(user);
        }

        String accessToken = jwtService.generateAccessToken(user.getEmail());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        // Save refresh token
        RefreshToken tokenEntity = RefreshToken.builder()
                .token(refreshToken)
                .user(user)
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();
        refreshTokenRepository.save(tokenEntity);

        String redirectUrl = String.format("http://localhost:3000/oauth2/redirect?token=%s&refreshToken=%s",
                accessToken, refreshToken);
        
        response.sendRedirect(redirectUrl);
    }

    private String extractEmail(OAuth2User oauth2User, String provider) {
        if ("github".equals(provider)) {
            // GitHub might return list of emails or just one in attributes
            return (String) oauth2User.getAttribute("email");
        } else if ("google".equals(provider)) {
            return (String) oauth2User.getAttribute("email");
        }
        return (String) oauth2User.getAttribute("email");
    }

    private User createNewUser(String email, OAuth2User oauth2User, String provider, String oauthId) {
        String name = oauth2User.getAttribute("name");
        String firstName = "User";
        String lastName = "OAuth";

        if (name != null && !name.isEmpty()) {
            String[] parts = name.split(" ");
            firstName = parts[0];
            if (parts.length > 1) {
                lastName = parts[1];
            }
        } else {
            // Fallback for GitHub username
            String login = oauth2User.getAttribute("login");
            if (login != null) firstName = login;
        }

        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                .firstName(firstName)
                .lastName(lastName)
                .role(Role.CLIENT)
                .oauthProvider(provider)
                .oauthId(oauthId)
                .isActive(true)
                .build();

        return userRepository.save(user);
    }
}
