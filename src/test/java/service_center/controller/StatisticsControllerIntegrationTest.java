package service_center.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import service_center.domain.entity.User;
import service_center.domain.enums.Role;
import service_center.repository.UserRepository;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@AutoConfigureMockMvc
class StatisticsControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @MockitoBean
    private StringRedisTemplate stringRedisTemplate;

    private String adminEmail;
    private String adminPassword;

    @BeforeEach
    void setUp() {
        adminEmail = "admin.%s@example.com".formatted(UUID.randomUUID());
        adminPassword = "password123";

        userRepository.save(User.builder()
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .firstName("Admin")
                .lastName("User")
                .phone("+375291111111")
                .role(Role.ADMIN)
                .isActive(true)
                .build());
    }

    @Test
    void getStatistics_ShouldReturn403_WhenNotAuthenticated() throws Exception {
        var response = mockMvc.perform(get("/api/v1/statistics"))
                .andReturn()
                .getResponse();

        assertThat(response.getStatus()).isEqualTo(403);
    }

    @Test
    void getStatistics_ShouldReturn200_WhenAdmin() throws Exception {
        String token = loginAndExtractToken();

        var response = mockMvc.perform(get("/api/v1/statistics")
                        .header("Authorization", "Bearer " + token))
                .andReturn()
                .getResponse();

        assertThat(response.getStatus()).isEqualTo(200);
    }

    private String loginAndExtractToken() throws Exception {
        var response = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "%s",
                                  "password": "%s"
                                }
                                """.formatted(adminEmail, adminPassword)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        int tokenStart = response.indexOf("\"accessToken\":\"") + "\"accessToken\":\"".length();
        int tokenEnd = response.indexOf('"', tokenStart);
        return response.substring(tokenStart, tokenEnd);
    }
}
