# Spring Boot Layered Architecture

This project follows a clean layered architecture pattern with proper separation of concerns.

## Architecture Flow

```
Controller → Service → Repository → Entity
     ↓           ↓           ↓        ↓
    DTO ← Business ← Database ← JPA
```

## Package Structure

```
com.booking/
├── controller/     # REST API endpoints
├── service/        # Business logic layer
├── repository/     # Data access layer
├── entity/         # JPA entities
├── dto/           # Data Transfer Objects
│   ├── request/   # Request DTOs
│   └── response/  # Response DTOs
├── security/      # JWT & Security configuration
├── exception/     # Custom exceptions
└── config/        # Configuration classes
```

## Layer Responsibilities

### Controller Layer
- Handle HTTP requests/responses
- Input validation using `@Valid`
- Call appropriate service methods
- Return proper HTTP status codes

### Service Layer
- Implement business logic
- Transaction management
- Coordinate between repositories
- Transform entities to DTOs

### Repository Layer
- Extend `JpaRepository`
- Define custom query methods
- Handle database operations

### Entity Layer
- JPA entities with proper annotations
- Database table mappings
- Relationships between entities

### DTO Layer
- Separate request/response objects
- Prevent entity exposure
- Data validation annotations

## Best Practices Implemented

✅ Constructor-based dependency injection  
✅ Proper package naming conventions  
✅ Lombok for boilerplate reduction  
✅ Builder pattern for object creation  
✅ RESTful API design  
✅ JWT security integration  
✅ Input validation  
✅ Custom exception handling  
✅ Clean separation of concerns  

## Technology Stack

- **Spring Boot 3.2.0** with Java 17
- **Spring Data JPA** for database operations
- **Spring Security** with JWT authentication
- **PostgreSQL** as primary database
- **H2** for local development
- **Lombok** for code generation
- **Maven** for dependency management
