# Service Center Backend

Spring Boot backend for a service center management system.

## Stack

- Java 21
- Spring Boot 3.5
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL
- Flyway
- Redis
- Swagger/OpenAPI via springdoc-openapi

## Local Run

Set environment variables or use the defaults from `application.yml`.
See `.env.example` for the full list.

```bash
./mvnw spring-boot:run
```

## Tests

```bash
./mvnw clean test
```

## Swagger

After starting the application:

```text
http://localhost:8080/swagger-ui.html
```
