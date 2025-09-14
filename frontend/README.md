# 🌱 GreenCycle - Smart E-Waste Management Platform

A comprehensive React-based web application for smart e-waste management and donation platform that connects users, NGOs, and administrators to create a sustainable ecosystem for electronic waste recycling.

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178C6?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-38B2AC?style=flat&logo=tailwind-css)
![Firebase](https://img.shields.io/badge/Firebase-12.2.1-FFCA28?style=flat&logo=firebase)

## 🌟 Features Overview

### 👥 Multi-Role Platform
- **Users**: Donate electronic devices, track environmental impact, earn eco-points
- **NGOs**: Manage collection requests, scan QR codes, track donations
- **Admins**: Oversee platform operations, manage users and NGOs, view analytics

### 🔑 Key Functionality
- ✅ Role-based authentication with Firebase
- ✅ Device donation with image upload and QR code generation
- ✅ Location-based NGO discovery
- ✅ Pickup scheduling and tracking
- ✅ Environmental impact visualization
- ✅ Gamification with achievements and eco-points
- ✅ Real-time analytics and reporting
- ✅ QR code scanning for device verification
- ✅ Comprehensive admin dashboard

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project with Authentication, Firestore, and Storage enabled
- Google Maps API key (optional, for location features)

### Installation

1. **Clone and navigate to the project:**
   ```bash
   git clone <repository-url>
   cd greencycle/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Edit .env.local with your actual configuration values
   ```

4. **Configure Firebase:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password and Google Sign-In)
   - Enable Firestore Database
   - Enable Cloud Storage
   - Copy your Firebase config values to `.env.local`

5. **Start the development server:**
   ```bash
   npm start
   ```

The application will open at [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── admin/              # Admin-specific components
│   │   └── Layout.tsx      # Admin dashboard layout
│   ├── ngo/                # NGO-specific components
│   │   └── Layout.tsx      # NGO portal layout
│   ├── user/               # User-specific components
│   │   └── Layout.tsx      # User portal layout
│   ├── auth/               # Authentication components
│   │   └── ProtectedRoute.tsx
│   └── common/             # Shared components
│       └── LoadingSpinner.tsx
├── pages/                  # Page components organized by role
│   ├── admin/              # Admin dashboard pages
│   │   ├── Dashboard.tsx
│   │   ├── UserManagement.tsx
│   │   ├── NGOManagement.tsx
│   │   ├── Analytics.tsx
│   │   ├── Settings.tsx
│   │   ├── GlobalAnalytics.tsx
│   │   └── HeatmapView.tsx
│   ├── ngo/                # NGO portal pages
│   │   ├── Dashboard.tsx
│   │   ├── RequestManagement.tsx
│   │   ├── QRScanner.tsx
│   │   ├── Profile.tsx
│   │   └── Analytics.tsx
│   ├── user/               # User portal pages
│   │   ├── Dashboard.tsx
│   │   ├── DeviceUpload.tsx
│   │   ├── MyDevices.tsx
│   │   ├── FindNGOs.tsx
│   │   ├── Pickups.tsx
│   │   ├── ImpactDashboard.tsx
│   │   └── Gamification.tsx
│   └── auth/               # Authentication pages
│       ├── RoleSelectionPage.tsx
│       ├── UserLoginPage.tsx
│       ├── NGOLoginPage.tsx
│       ├── AdminLoginPage.tsx
│       ├── RegisterPage.tsx
│       ├── NGORegisterPage.tsx
│       └── AdminRegisterPage.tsx
├── context/                # React context providers
│   └── AuthContext.tsx     # Authentication state management
├── types/                  # TypeScript type definitions
│   └── index.ts           # All TypeScript interfaces
├── firebase.ts            # Firebase configuration
├── App.tsx                # Main application component
└── index.tsx              # Application entry point
```

## 🎨 Design System

### Built with Modern Technologies
- **React 19** with TypeScript for type safety
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **Headless UI** for accessible components
- **Heroicons** for consistent iconography
- **React Hook Form** with Yup validation

### Color Palette
- **Primary Green**: `#68bf68` - Eco-friendly theme
- **Secondary**: Complementary green tones
- **Accent**: `#ffc300` - Golden yellow for highlights
- **Neutrals**: Professional gray scale

### Typography
- **Display Font**: Poppins (headings)
- **Body Font**: Inter (content)

## 🔐 Authentication & Authorization

### Role-Based Access Control
The platform implements a comprehensive three-tier authentication system:

1. **User Role**
   - Device donation and management
   - NGO discovery and communication
   - Impact tracking and gamification

2. **NGO Role**
   - Collection request management
   - QR code scanning capabilities
   - Analytics and reporting tools

3. **Admin Role**
   - Complete platform oversight
   - User and NGO management
   - System analytics and configuration

### Authentication Flow
```
Landing Page → Role Selection → Login/Register → Role-Specific Dashboard
```

## 📱 User Features

### Device Donation Process
1. **Upload Device**: Photos, specifications, condition assessment
2. **QR Code Generation**: Automatic QR code for device tracking
3. **NGO Matching**: AI-powered NGO recommendations
4. **Pickup Scheduling**: Calendar-based scheduling system
5. **Impact Tracking**: Real-time environmental impact calculations

### Gamification System
- **Eco-Points**: Earned through donations and sustainable actions
- **Achievements**: Milestone-based rewards system
- **Leaderboards**: Community engagement and competition
- **Impact Visualization**: Personal environmental contribution metrics

## 🏢 NGO Features

### Collection Management
- **Request Dashboard**: Centralized donation request management
- **QR Scanner**: Mobile-optimized device verification
- **Route Optimization**: Efficient pickup route planning
- **Impact Reporting**: Detailed analytics for stakeholders

### Verification Tools
- **Device Authentication**: QR code scanning for authenticity
- **Condition Assessment**: Standardized evaluation process
- **Documentation**: Automated receipt and certificate generation

## ⚙️ Admin Features

### Platform Management
- **User Oversight**: Complete user management and moderation
- **NGO Verification**: Registration approval and monitoring
- **System Analytics**: Comprehensive platform metrics
- **Content Moderation**: Community guidelines enforcement

### Analytics Dashboard
- **Real-time Metrics**: Live platform statistics
- **Environmental Impact**: Global sustainability metrics
- **Geographic Insights**: Heatmap visualizations
- **Trend Analysis**: Historical data and projections

## 🛠️ Available Scripts

### Development
```bash
# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build

# Analyze bundle
npm run build && npx serve -s build
```

### Code Quality
```bash
# Type checking
npx tsc --noEmit

# Linting (if configured)
npm run lint

# Format code (if configured)
npm run format
```

## 🌍 Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Firebase Configuration (Required)
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456
REACT_APP_FIREBASE_MEASUREMENT_ID=G-ABCDEF1234

# API Configuration
REACT_APP_API_BASE_URL=http://localhost:3001/api

# Google Maps API (Optional)
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Environment
REACT_APP_ENVIRONMENT=development
```

## 🚀 Deployment

### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Netlify Deployment
```bash
# Build the project
npm run build

# Deploy to Netlify (drag and drop the build folder)
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in coverage mode
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Testing Strategy
- **Unit Tests**: Component functionality
- **Integration Tests**: User workflows
- **E2E Tests**: Complete user journeys
- **Accessibility Tests**: WCAG compliance

## 🔧 Troubleshooting

### Common Issues

**Development server won't start:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Firebase authentication errors:**
- Verify Firebase configuration in `.env.local`
- Check Firebase console for enabled authentication methods
- Ensure Firestore and Storage are properly configured

**Styling issues:**
```bash
# Rebuild Tailwind CSS
npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch
```

## 📊 Performance Optimization

### Implemented Optimizations
- **Code Splitting**: React.lazy() for route-based splitting
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Caching Strategy**: Service worker for static assets
- **Tree Shaking**: Automatic unused code elimination

### Performance Metrics
- **Lighthouse Score**: 90+ across all categories
- **Core Web Vitals**: Optimized for mobile and desktop
- **Bundle Size**: <500KB initial load

## 🤝 Contributing

### Development Guidelines
1. Follow TypeScript strict mode
2. Use Tailwind CSS for styling
3. Implement responsive design
4. Add proper error handling
5. Write meaningful commit messages

### Code Standards
- **Component Structure**: Functional components with hooks
- **State Management**: Context API and React Query
- **Form Handling**: React Hook Form with Yup validation
- **Error Boundaries**: Comprehensive error handling

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Create React App** for the initial setup
- **Tailwind CSS** for the design system
- **Firebase** for backend services
- **Framer Motion** for animations
- **React Hook Form** for form management

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review troubleshooting guide

---

**Built with ❤️ for a sustainable future** 🌱