# IST Authentication System - Backend

A comprehensive Spring Boot backend providing centralized authentication and budget management services for educational institutions.

**Developer:** Manzi Niyongira Osee  
**Year:** 2025  
**Framework:** Spring Boot 3.5.6  

## 🎯 Overview

This backend serves as a centralized Identity Provider (IdP) with educational budget management capabilities. It provides secure JWT-based authentication, OAuth integration, and comprehensive financial tracking for educational institutions.

## 🚀 Features

### Core Authentication (100 Points)
- **JWT Authentication** with RSA-2048 key pair signing
- **Email Verification** via Gmail SMTP integration
- **LinkedIn OAuth 2.0** social login
- **Refresh Token** mechanism with automatic rotation
- **JWKS Endpoint** for public key distribution
- **Account Security** with failed login attempt tracking

### Bonus Features (+25%)
- **Role-based Authorization** (+10%): Admin, Teacher, Student roles
- **Educational Budget Management** (+15%): Complete expense tracking system

### Security Features
- BCrypt password hashing (strength 12)
- CORS configuration for cross-origin requests
- Request validation with Bean Validation
- SQL injection prevention with JPA
- Account lockout after failed attempts

## 🛠️ Technology Stack

- **Framework:** Spring Boot 3.5.6
- **Security:** Spring Security + OAuth2
- **Database:** H2 (in-memory for production)
- **Authentication:** JWT with RSA signing
- **Email:** Spring Mail (Gmail SMTP)
- **Documentation:** SpringDoc OpenAPI 3
- **Build:** Gradle with Kotlin DSL
- **Java:** JDK 21

## 📋 API Endpoints

### Authentication
```
POST /api/auth/login              # User login
POST /api/auth/register           # User registration
POST /api/auth/refresh            # Token refresh
POST /api/auth/logout             # User logout
GET  /api/auth/verify-email       # Email verification
```

### OAuth & JWKS
```
GET /.well-known/jwks.json        # Public keys
GET /.well-known/openid_configuration # OpenID config
GET /oauth2/login/linkedin        # LinkedIn OAuth
```

### Budget Management
```
GET  /api/budget/categories       # List categories
POST /api/budget/categories       # Create category
GET  /api/budget/expenses/pending # List expenses
POST /api/budget/expenses         # Create expense
POST /api/budget/expenses/{id}/approve # Approve expense
GET  /api/budget/summary          # Budget summary
```

### System
```
GET /api/actuator/health          # Health check
GET /api/actuator/info            # Application info
GET /swagger-ui.html              # API documentation
```

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Gradle 8.5+

### Local Development
```bash
# Clone repository
git clone <repository-url>
cd ist-auth-system

# Set environment variables
cp .env.example .env
# Edit .env with your configuration

# Run application
./gradlew bootRun

# Run tests
./gradlew test

# Build for production
./gradlew build
```

### Docker Deployment
```bash
# Build image
docker build -t ist-auth-backend .

# Run container
docker run -p 8080:8080 ist-auth-backend

# Or use docker-compose
docker-compose up -d
```

## 🔧 Configuration

### Environment Variables
```env
# Gmail SMTP
GMAIL_USERNAME=your-email@gmail.com
GMAIL_PASSWORD=your-app-password

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Admin User
ADMIN_EMAIL=admin@ist-auth.com
ADMIN_PASSWORD=Admin123!

# JWT Configuration
JWT_EXPIRATION=900000
JWT_REFRESH_EXPIRATION=604800000
```

### Database
- **Development:** H2 in-memory database
- **Production:** H2 in-memory (auto-configured)
- **Data:** Automatically initialized with admin user

## 🧪 Testing

```bash
# Unit tests
./gradlew test

# Integration tests
./gradlew integrationTest

# Test coverage
./gradlew test jacocoTestReport
```

## 📊 Budget Management

### Features
- Multi-departmental budget allocation
- Expense approval workflows
- Financial reporting and analytics
- Over-budget alerts and notifications
- Role-based permissions for budget access

### Workflow
1. Admin creates budget categories
2. Teachers/Staff submit expenses
3. Admin approves/rejects expenses
4. System tracks spending and generates reports

## 🔒 Security

### Authentication Security
- RSA-2048 signed JWT tokens
- Access tokens: 15 minutes expiration
- Refresh tokens: 7 days with rotation
- Account lockout after 5 failed attempts
- Mandatory email verification

### API Security
- Role-based endpoint protection
- CORS configuration for allowed origins
- Request validation and sanitization
- SQL injection prevention
- XSS protection with proper encoding

## 📈 Monitoring

### Health Endpoints
```
GET /api/actuator/health     # Application health
GET /api/actuator/info       # Application info
GET /api/actuator/metrics    # Performance metrics
```

### Logging
- Structured JSON logging in production
- Security event logging for audit trails
- Request/response logging for debugging

## 🚢 Deployment

### Production Deployment
- **Platform:** Fly.io
- **URL:** https://ist-auth-system-sparkling-wind-9681.fly.dev
- **Database:** H2 in-memory (production-ready)
- **Email:** Gmail SMTP integration

### Docker Configuration
- Multi-stage build for optimization
- Non-root user execution
- Health checks included
- Alpine Linux base for security

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

---

**Built for educational institutions with modern security practices and comprehensive budget management.**