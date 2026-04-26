package service_center.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Optional;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;

    public String generateAccessToken(String email) {
        return buildToken(email, expiration);
    }

    public String generateRefreshToken(String email) {
        return buildToken(email, refreshExpiration);
    }

    private String buildToken(String email, long expiration) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignKey())
                .compact();
    }

    public Optional<String> extractEmail(String token) {
        try {
            return Optional.of(
                    Jwts.parser()
                            .verifyWith(getSignKey())
                            .build()
                            .parseSignedClaims(token)
                            .getPayload()
                            .getSubject()
            );
        } catch (JwtException e) {
            return Optional.empty();
        }
    }

    public boolean isTokenValid(String token) {
        return extractEmail(token).isPresent();
    }

    private SecretKey getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}