# Environment Configuration Guide

## Setup Instructions

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Configure required variables in `.env`:**

### Database Setup
- Set up PostgreSQL database
- Update `DATABASE_URL`, `DB_USERNAME`, `DB_PASSWORD`

### Email Configuration
- Use Gmail with App Password or other SMTP provider
- Update `MAIL_USERNAME` and `MAIL_PASSWORD`

### OAuth2 Setup
- Create LinkedIn Developer App at https://developer.linkedin.com/
- Get Client ID and Secret
- Update `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET`

### Security
- Generate a 32-character random secret for `ENCRYPTION_SECRET`
- Update `CORS_ALLOWED_ORIGINS` with your frontend URLs

## Required Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `DB_USERNAME` | Database username | Yes |
| `DB_PASSWORD` | Database password | Yes |
| `MAIL_USERNAME` | SMTP email username | Yes |
| `MAIL_PASSWORD` | SMTP email password | Yes |
| `LINKEDIN_CLIENT_ID` | LinkedIn OAuth client ID | Yes |
| `LINKEDIN_CLIENT_SECRET` | LinkedIn OAuth client secret | Yes |
| `ENCRYPTION_SECRET` | 32-character encryption key | Yes |

## Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REDIS_HOST` | Redis host for caching | localhost |
| `JWT_ACCESS_TOKEN_EXPIRATION` | Access token expiry (ms) | 900000 |
| `JWT_REFRESH_TOKEN_EXPIRATION` | Refresh token expiry (ms) | 604800000 |

## Security Notes

- Never commit `.env` file to version control
- Use strong, unique passwords
- Rotate secrets regularly in production
- Use environment-specific configurations