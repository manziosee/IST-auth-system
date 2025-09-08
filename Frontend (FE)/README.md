# IST Authentication System - Frontend

A modern React TypeScript frontend providing authentication interfaces and budget management dashboards for educational institutions.

**Developer:** Manzi Niyongira Osee  
**Year:** 2025  
**Framework:** React 18.3.1 + TypeScript  

## 🎯 Overview

This frontend application provides a complete user interface for the IST Authentication System, featuring role-based dashboards, budget management tools, and seamless authentication flows.

## 🚀 Features

### Authentication System
- **Login/Register Forms** with validation
- **Email Verification** workflow
- **LinkedIn OAuth** integration
- **JWT Token Management** with auto-refresh
- **Protected Routes** with authentication guards
- **Error Boundaries** for crash prevention

### Budget Management UI
- **Budget Categories** overview with utilization tracking
- **Expense Submission** forms for teachers
- **Approval Interface** for administrators
- **Financial Reporting** with charts and analytics
- **Real-time Updates** from backend APIs

### Role-based Dashboards
- **Admin Dashboard:** System management and budget oversight
- **Teacher Dashboard:** Course management and expense tracking
- **Student Dashboard:** Academic progress and budget information

### User Experience
- **Responsive Design** for all devices
- **Loading States** and error handling
- **Form Validation** with real-time feedback
- **Toast Notifications** for user feedback
- **Modern UI** with TailwindCSS styling

## 🛠️ Technology Stack

- **Framework:** React 18.3.1
- **Language:** TypeScript
- **Build Tool:** Vite 5.4.2
- **Styling:** TailwindCSS 3.4.1
- **Routing:** React Router DOM 7.8.2
- **Icons:** Lucide React 0.344.0
- **State Management:** React Context API

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication components
│   ├── budget/            # Budget management UI
│   ├── dashboard/         # Role-based dashboards
│   ├── layout/            # Layout components
│   └── ui/                # Reusable UI components
├── contexts/              # React Context providers
├── pages/                 # Application pages
├── services/              # API service layer
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── widget/                # Embeddable auth widget
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Development Setup
```bash
# Clone repository
git clone <repository-url>
cd "Frontend (FE)"

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker Deployment
```bash
# Build image
docker build -t ist-auth-frontend .

# Run container
docker run -p 3000:80 ist-auth-frontend
```

## 🔧 Configuration

### Environment Variables
```env
# API Configuration
VITE_API_BASE_URL=https://ist-auth-system-sparkling-wind-9681.fly.dev/api
VITE_APP_TITLE=IST Authentication System

# OAuth Configuration
VITE_CLIENT_ID=default-client
VITE_LINKEDIN_CLIENT_ID=your-linkedin-client-id

# JWT Configuration
VITE_JWT_PUBLIC_KEY_URL=https://ist-auth-system-sparkling-wind-9681.fly.dev/.well-known/jwks.json
```

## 📱 Components

### Authentication Components
- **AuthWidget:** Complete authentication interface
- **LoginForm:** User login with validation
- **RegisterForm:** User registration with role selection
- **EmailVerification:** Email verification flow
- **OAuthProviders:** Social login integration

### Budget Components
- **BudgetPage:** Complete budget management interface
- **ExpenseForm:** Expense submission form
- **BudgetCategories:** Category management
- **FinancialSummary:** Budget analytics and reporting

### Dashboard Components
- **AdminDashboard:** System administration interface
- **TeacherDashboard:** Teaching and budget tools
- **StudentDashboard:** Student information and budget view

### UI Components
- **Button:** Reusable button component
- **Input:** Form input with validation
- **Card:** Content container
- **LoadingSpinner:** Loading state indicator
- **Toaster:** Notification system

## 🔗 API Integration

### Authentication Service
```typescript
// Login user
authService.login(email, password)

// Register user
authService.register(email, password, role, username, firstName, lastName)

// Refresh tokens
authService.refreshToken(refreshToken)

// Verify email
authService.verifyEmail(token)
```

### Budget Service
```typescript
// Get budget categories
budgetService.getCategories()

// Submit expense
budgetService.createExpense(expenseData)

// Approve expense
budgetService.approveExpense(expenseId)

// Get budget summary
budgetService.getBudgetSummary()
```

## 🎨 Styling

### TailwindCSS Configuration
- **Responsive Design:** Mobile-first approach
- **Color Palette:** Professional blue/purple theme
- **Typography:** Clean and readable fonts
- **Components:** Consistent design system
- **Animations:** Smooth transitions and interactions

### Design System
- **Primary Colors:** Blue (#3B82F6) and Purple (#8B5CF6)
- **Success:** Green (#10B981)
- **Warning:** Yellow (#F59E0B)
- **Error:** Red (#EF4444)
- **Neutral:** Gray scale for text and backgrounds

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 🚢 Deployment

### Production Deployment
- **Platform:** Vercel
- **URL:** https://ist-auth-system.vercel.app
- **Build:** Optimized production bundle
- **CDN:** Global content delivery

### Build Optimization
- **Code Splitting:** Automatic route-based splitting
- **Tree Shaking:** Remove unused code
- **Minification:** Compressed JavaScript and CSS
- **Caching:** Optimized asset caching

## 🔒 Security

### Authentication Security
- **JWT Token Storage:** Secure localStorage management
- **Token Refresh:** Automatic token renewal
- **Route Protection:** Authentication guards
- **CORS Handling:** Proper cross-origin requests

### Input Security
- **Form Validation:** Client-side validation
- **XSS Prevention:** Input sanitization
- **CSRF Protection:** Token-based requests
- **Error Handling:** Secure error messages

## 📊 Performance

### Metrics
- **Bundle Size:** ~312KB (gzipped: ~85KB)
- **Load Time:** < 2 seconds
- **Lighthouse Score:** 95+ (Performance, Accessibility, SEO)
- **Mobile Responsive:** 100% compatible

### Optimization
- **Lazy Loading:** Route-based code splitting
- **Image Optimization:** Responsive images
- **Caching Strategy:** Efficient asset caching
- **Bundle Analysis:** Optimized dependencies

## 🤝 Integration

### Widget System
```javascript
// Embeddable authentication widget
import { ISTAuth } from '@ist/auth-widget';

const auth = new ISTAuth({
  apiUrl: 'https://your-backend.com/api',
  clientId: 'your-client-id',
  redirectUri: 'https://your-app.com/callback'
});

auth.login().then(tokens => {
  // Handle authentication success
});
```

### Third-party Integration
- **Easy Integration:** Drop-in authentication widget
- **Flexible Configuration:** Customizable options
- **Theme Support:** Light/dark mode support
- **Event Callbacks:** Success/error handling

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Follow coding standards
4. Add tests for new features
5. Submit pull request

---

**Modern React frontend for educational institution authentication and budget management.**