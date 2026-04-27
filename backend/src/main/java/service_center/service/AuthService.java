package service_center.service;

import service_center.dto.request.LoginRequest;
import service_center.dto.request.RefreshTokenRequest;
import service_center.dto.request.RegisterRequest;
import service_center.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refresh(RefreshTokenRequest request);
}