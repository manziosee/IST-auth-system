# IST Authentication System

A comprehensive Identity Provider (IdP) solution designed for educational institutions, providing centralized authentication and authorization services with modern security practices.

**Developer:** Manzi Niyongira Osee  
**Year:** 2025  
**License:** MIT

## 🎯 Project Overview

The IST Authentication System is a full-stack application that serves as a centralized Identity Provider for educational institutions. It replaces multiple application authentication systems with a single, secure, and scalable solution.

### 🎯 What This System Does

The IST Authentication System serves as a **centralized identity provider** that eliminates the need for multiple authentication systems across educational applications. Here's what it accomplishes:

**🔐 Centralized Authentication**
- Single sign-on (SSO) for all educational applications
- Secure JWT-based token system with automatic refresh
- Email verification and LinkedIn OAuth integration
- Role-based access control for students, teachers, and administrators

**🏫 Educational Institution Management**
- Multi-departmental budget tracking and expense management
- Academic year organization and resource allocation
- Financial reporting with spending analytics and over-budget alerts
- Approval workflows for educational expenses

**🛡️ Enterprise-Grade Security**
- RSA-signed JWT tokens with public key distribution
- Account lockout protection and secure password policies
- CORS configuration and API security best practices
- Docker-ready deployment with production optimizations

**🔧 Developer-Friendly Integration**
- RESTful API with comprehensive documentation
- Lightweight authentication widget for easy integration
- Client registration system for third-party applications
- Health monitoring and debugging endpoints

## 🏗️ Architecture

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   Frontend (React)  │    │  Backend (Spring)   │    │  Database (PostgreSQL) │
│   - Authentication  │◄──►│  - JWT Service      │◄──►│  - User Management  │
│   - OAuth Widget    │    │  - OAuth2 Provider  │    │  - Budget System    │
│   - Admin Dashboard │    │  - Budget API       │    │  - Client Registry  │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
                                      │
                                      ▼
                              ┌─────────────────────┐
                              │   Redis Cache       │
                              │   - Sessions        │
                              │   - Token Storage   │
                              └─────────────────────┘
```

## 🚀 Key Features

### Core Authentication (100 Points)
- **JWT-based Authentication** with RSA key pair signing
- **Email + Password** authentication with mandatory email verification
- **LinkedIn OAuth 2.0** integration for social login
- **Refresh Token** mechanism with automatic rotation
- **JWKS Endpoint** (/.well-known/jwks.json) for public key distribution
- **Client Registration** system with Client ID/Secret validation

### Security & Authorization (+10% Bonus)
- **Role-based Access Control** (Admin, Teacher, Student)
- **Account Security** with failed login attempt tracking
- **CORS Configuration** for cross-origin requests
- **Security Headers** and best practices implementation
- **BCrypt Password Hashing** (strength 12)

### Educational Budget Management (+15% Bonus)
- **Multi-departmental Budget** allocation and tracking
- **Expense Approval Workflow** with role-based permissions
- **Financial Reporting** and analytics with utilization metrics
- **Over-budget Alerts** and spending analysis
- **Academic Year** and department-based organization
- **Cost Center Management** with detailed expense tracking

### Technical Excellence
- **Modern React Frontend** with TypeScript and TailwindCSS
- **Spring Boot 3.5.6** backend with comprehensive security
- **Docker Containerization** with multi-stage builds
- **PostgreSQL Database** with JPA/Hibernate
- **Redis Caching** for session management
- **Comprehensive API Documentation** with SpringDoc OpenAPI

## 📁 Project Structure

```
IST-auth-system/
├── Frontend (FE)/                 # React TypeScript Frontend
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── auth/            # Authentication components
│   │   │   ├── budget/          # Budget management UI
│   │   │   └── ui/              # Base UI components
│   │   ├── contexts/            # React Context providers
│   │   ├── pages/               # Application pages
│   │   └── services/            # API service layer
│   ├── public/                  # Static assets
│   ├── Dockerfile              # Frontend container
│   ├── package.json            # Dependencies
│   └── vite.config.ts          # Build configuration
│
├── ist-auth-system/             # Spring Boot Backend
│   ├── src/main/java/com/ist/auth/
│   │   ├── controller/         # REST API controllers
│   │   ├── service/            # Business logic services
│   │   ├── entity/             # JPA entities
│   │   ├── dto/                # Data transfer objects
│   │   ├── config/             # Configuration classes
│   │   └── security/           # Security configuration
│   ├── src/main/resources/     # Configuration files
│   ├── Dockerfile              # Backend container
│   ├── build.gradle.kts        # Build configuration
│   └── docker-compose.yml      # Container orchestration
│
├── README.md                    # This file
└── LICENSE                      # MIT License
```

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18.3.1 with TypeScript
- **Build Tool:** Vite 5.4.2
- **Styling:** TailwindCSS 3.4.1
- **Routing:** React Router DOM 7.8.2
- **Icons:** Lucide React 0.344.0
- **State Management:** React Context API

### Backend
- **Framework:** Spring Boot 3.5.6
- **Security:** Spring Security + OAuth2
- **Database:** PostgreSQL with JPA/Hibernate
- **Caching:** Redis
- **Authentication:** JWT with RSA signing
- **Email:** Spring Mail
- **Documentation:** SpringDoc OpenAPI 3
- **Testing:** JUnit 5, Testcontainers
- **Build:** Gradle with Kotlin DSL

### Infrastructure
- **Containerization:** Docker with multi-stage builds
- **Orchestration:** Docker Compose
- **Database:** PostgreSQL 15+
- **Cache:** Redis 7+
- **Deployment:** Production-ready containers

## 🚀 Live Demo

### 🌐 **Production Deployment**
- **Frontend**: https://ist-auth-system.vercel.app
- **Backend API**: https://ist-auth-system-sparkling-wind-9681.fly.dev/api
- **API Documentation**: https://ist-auth-system-sparkling-wind-9681.fly.dev/swagger-ui.html
- **JWKS Endpoint**: https://ist-auth-system-sparkling-wind-9681.fly.dev/.well-known/jwks.json

### 🧪 **Test the System**
1. Visit the frontend: https://ist-auth-system.vercel.app
2. Register a new account (email verification required)
3. Login and explore role-based dashboards
4. Test LinkedIn OAuth integration

## 🚀 Quick Start

### Prerequisites
- **Java 21+** (for backend development)
- **Node.js 18+** (for frontend development)
- **Docker & Docker Compose** (recommended for deployment)
- **Git** (for version control)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/IST-auth-system.git
cd IST-auth-system
```

### 2. Environment Configuration
```bash
# Backend configuration
cp ist-auth-system/.env.example ist-auth-system/.env

# Frontend configuration
cp "Frontend (FE)/.env.example" "Frontend (FE)/.env"
```

### 3. Docker Deployment (Recommended)
```bash
# Start all services
cd ist-auth-system
docker-compose up -d

# View logs
docker-compose logs -f backend frontend

# Access applications
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
# API Documentation: http://localhost:8080/swagger-ui.html
```

### 4. Local Development

#### Backend Development
```bash
cd ist-auth-system

# Start dependencies only
docker-compose up -d postgres redis

# Run backend
./gradlew bootRun

# Run tests
./gradlew test
```

#### Frontend Development
```bash
cd "Frontend (FE)"

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database Configuration
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/ist_auth_db
SPRING_DATASOURCE_USERNAME=ist_auth_user
SPRING_DATASOURCE_PASSWORD=ist_auth_password

# Redis Configuration
SPRING_REDIS_HOST=localhost
SPRING_REDIS_PORT=6379

# Email Service
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_HOST=smtp.gmail.com

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# JWT Configuration
JWT_EXPIRATION=900000
JWT_REFRESH_EXPIRATION=604800000

# Admin User
ADMIN_EMAIL=admin@ist-auth.com
ADMIN_PASSWORD=Admin123!
```

#### Frontend (.env)
```env
# Production Configuration
VITE_API_BASE_URL=https://ist-auth-system-sparkling-wind-9681.fly.dev/api
VITE_APP_TITLE=IST Authentication System
VITE_LINKEDIN_CLIENT_ID=your-linkedin-client-id
VITE_JWT_PUBLIC_KEY_URL=https://ist-auth-system-sparkling-wind-9681.fly.dev/.well-known/jwks.json

# Local Development
# VITE_API_BASE_URL=http://localhost:8080/api
```

## 📋 API Documentation

### Core Authentication Endpoints
```
POST   /api/auth/login              # User login
POST   /api/auth/register           # User registration
POST   /api/auth/refresh            # Token refresh
POST   /api/auth/logout             # User logout
POST   /api/auth/verify-email       # Email verification
POST   /api/auth/resend-verification # Resend verification email
```

### OAuth & JWKS Endpoints
```
GET    /.well-known/jwks.json       # Public keys for token verification
GET    /.well-known/openid_configuration # OpenID configuration
GET    /oauth2/login/linkedin       # LinkedIn OAuth login
```

### Budget Management Endpoints (+Bonus)
```
GET    /api/budget/categories       # List budget categories
POST   /api/budget/categories       # Create budget category
GET    /api/budget/expenses         # List expenses
POST   /api/budget/expenses         # Create expense
POST   /api/budget/expenses/{id}/approve # Approve expense
GET    /api/budget/summary          # Budget summary
```

### Interactive Documentation
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **OpenAPI Spec:** http://localhost:8080/v3/api-docs

## 🔒 Security Features

### Authentication Security
- **RSA-2048 Key Pairs** for JWT signing
- **Access Tokens:** 15 minutes expiration
- **Refresh Tokens:** 7 days expiration with rotation
- **Account Lockout:** After 5 failed attempts
- **Email Verification:** Required for new accounts
- **Password Hashing:** BCrypt with strength 12

### API Security
- **Role-based Endpoint Protection**
- **CORS Configuration** for allowed origins
- **Request Validation** with Bean Validation
- **SQL Injection Prevention** with JPA
- **XSS Protection** with proper encoding

### Infrastructure Security
- **Non-root Container Execution**
- **Secrets Management** via environment variables
- **Database Connection Pooling**
- **Redis Session Management**
- **Health Check Endpoints**

## 🧪 Testing

### Running Tests

#### Backend Tests
```bash
cd ist-auth-system

# Unit tests
./gradlew test

# Integration tests
./gradlew integrationTest

# Test coverage
./gradlew test jacocoTestReport
```

#### Frontend Tests
```bash
cd "Frontend (FE)"

# Unit tests
npm test

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 🚢 Production Deployment

### Docker Production Build
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

### Environment Setup
1. Configure production environment variables
2. Set up SSL certificates for HTTPS
3. Configure reverse proxy (Nginx recommended)
4. Set up monitoring and logging
5. Configure backup strategies for PostgreSQL

## 📊 Budget Management System

### Features Overview
The educational budget management system provides comprehensive financial tracking for educational institutions:

- **Multi-departmental Budgeting:** Separate budgets for different departments
- **Category-based Allocation:** Teaching materials, IT equipment, facilities, etc.
- **Expense Tracking:** Detailed expense recording with approval workflows
- **Financial Reporting:** Utilization metrics and spending analysis
- **Role-based Permissions:** Different access levels for admins, teachers, and students
- **Over-budget Alerts:** Automatic notifications when approaching limits

### Workflow
1. **Admin** creates budget categories with allocated amounts
2. **Teachers/Staff** submit expenses against categories
3. **Admin** reviews and approves/rejects expenses
4. **System** tracks spending and generates reports
5. **Alerts** notify stakeholders of budget status

## 🤝 Integration Guide

### Frontend Integration
The system provides a lightweight authentication widget that can be integrated into existing applications:

```javascript
// Initialize IST Auth
import { ISTAuth } from '@ist/auth-widget';

const auth = new ISTAuth({
  apiUrl: 'https://your-idp-server.com/api',
  clientId: 'your-client-id',
  redirectUri: 'https://your-app.com/callback'
});

// Login flow
auth.login().then(tokens => {
  // Handle successful authentication
  localStorage.setItem('accessToken', tokens.accessToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
});
```

### Backend Integration
For backend services that need to validate tokens:

```java
// Token validation example
@RestController
public class ProtectedController {
    
    @Autowired
    private JwtService jwtService;
    
    @GetMapping("/protected")
    public ResponseEntity<?> protectedEndpoint(
        @RequestHeader("Authorization") String authHeader) {
        
        String token = authHeader.replace("Bearer ", "");
        if (jwtService.validateToken(token)) {
            return ResponseEntity.ok("Access granted");
        }
        return ResponseEntity.status(401).body("Invalid token");
    }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check connection credentials in .env file
   - Ensure database exists and user has proper permissions

2. **Email Verification Not Working**
   - Check SMTP configuration in .env
   - Verify email credentials and app passwords
   - Check spam/junk folders

3. **LinkedIn OAuth Issues**
   - Verify LinkedIn app configuration
   - Check redirect URI matches exactly
   - Ensure client ID/secret are correct

4. **JWT Token Issues**
   - Check system clock synchronization
   - Verify RSA key generation
   - Check token expiration settings

5. **CORS Issues**
   - Verify frontend URL in backend CORS configuration
   - Check for trailing slashes in URLs
   - Ensure proper headers are included

### Debug Mode
```bash
# Backend debug logging
export LOGGING_LEVEL_ROOT=DEBUG
./gradlew bootRun

# Frontend debug mode
npm run dev -- --debug
```

## 📈 Monitoring & Health

### Health Endpoints
```
GET /actuator/health     # Application health status
GET /actuator/info       # Application information
GET /actuator/metrics    # Application metrics (Admin only)
```

### Logging
- **Structured JSON Logging** in production
- **Request/Response Logging** for debugging
- **Security Event Logging** for audit trails
- **Performance Metrics** collection

## 🎓 Educational Use Case

This system is specifically designed for educational institutions and includes:

- **Student Management:** Role-based access for students
- **Teacher Portal:** Dedicated interfaces for educators
- **Administrative Controls:** Comprehensive admin functionality
- **Budget Management:** Financial tracking for educational resources
- **Multi-departmental Support:** Separate access for different departments
- **Academic Year Organization:** Time-based data organization

## 📞 Support & Contact

For technical support and questions:
- **Developer:** Manzi Niyongira Osee
- **Project:** IST Authentication System Assessment
- **Year:** 2025
- **Documentation:** Comprehensive inline documentation and API specs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the powerful frontend library
- Educational institutions for inspiring the use case
- Open source community for the amazing tools and libraries

---

**Built with ❤️ for educational institutions**

*This project demonstrates modern authentication practices, secure coding principles, and comprehensive full-stack development for educational technology solutions.*
