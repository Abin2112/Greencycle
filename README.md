# GreenCycle - Smart E-waste Management Platform

A comprehensive full-stack web application for smart e-waste management and donation, featuring three specialized portals: User, NGO/Recycler, and Admin.

## 🌱 Project Overview

GreenCycle is designed to revolutionize e-waste management through:
- **AI-powered device recognition** using TensorFlow Lite/Teachable Machine
- **Smart valuation system** that suggests donate, recycle, or resell options
- **Interactive mapping** with Google Maps API for finding nearby NGOs
- **Environmental impact tracking** with detailed analytics
- **Gamification system** with badges, challenges, and leaderboards
- **QR code generation** for device tracking throughout the disposal process

## 🏗️ Architecture

### Frontend (React + TypeScript + TailwindCSS)
- **User Portal**: Device upload, NGO discovery, pickup scheduling, impact tracking
- **NGO Portal**: Request management, QR scanning, device processing, analytics
- **Admin Portal**: Global analytics, user management, heatmap visualization

### Backend (Node.js + Express)
- RESTful API with JWT authentication
- Firebase Auth integration
- PostgreSQL database with Neon hosting
- Image processing and AI integration
- PDF report generation

### Database (PostgreSQL on Neon)
- Comprehensive schema for users, devices, NGOs, pickups, and impact tracking
- Optimized indexes for performance
- Built-in eco-impact calculation formulas

## 🚀 Features

### User Portal
- ✅ **Device Upload**: AI-powered image recognition and OCR for device details
- ✅ **Smart Valuation**: AI suggestions for donate/recycle/resell decisions
- ✅ **NGO Discovery**: Interactive map with nearby recycling centers
- ✅ **Pickup Scheduling**: Easy appointment booking with QR code generation
- ✅ **Impact Dashboard**: Real-time environmental impact visualization
- ✅ **Gamification**: Badges, challenges, and community leaderboards

### NGO Portal
- 🔄 **Request Management**: Handle user device requests efficiently
- 🔄 **QR Scanner**: Quick device status updates via QR codes
- 🔄 **Analytics Dashboard**: Track processing metrics and impact
- 🔄 **Profile Management**: Update services and operational details

### Admin Portal
- 🔄 **Global Analytics**: Comprehensive platform-wide statistics
- 🔄 **User Management**: Monitor and manage user accounts
- 🔄 **NGO Management**: Verify and manage recycling organizations
- 🔄 **Heatmap Visualization**: E-waste hotspot mapping and analysis

## 🎨 Design System

### Color Palette
- **Primary Green**: Light, natural green theme (`#68bf68`)
- **Secondary**: Complementary light green variations
- **Accent**: Golden yellow for highlights (`#ffc300`)
- **Neutrals**: Professional gray scale

### Typography
- **Headers**: Poppins (Display font)
- **Body**: Inter (Clean, readable)

### Components
- Consistent design system with reusable components
- Smooth animations with Framer Motion
- Responsive design for all screen sizes
- Professional and elegant UI throughout

## 📁 Project Structure

```
greencycle/
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── user/       # User portal components
│   │   │   ├── ngo/        # NGO portal components
│   │   │   ├── admin/      # Admin portal components
│   │   │   └── common/     # Shared components
│   │   ├── pages/          # Page components
│   │   │   ├── auth/       # Login/Register pages
│   │   │   ├── user/       # User portal pages
│   │   │   ├── ngo/        # NGO portal pages
│   │   │   └── admin/      # Admin portal pages
│   │   ├── context/        # React Context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── App.tsx         # Main application component
│   ├── public/             # Static assets
│   └── package.json        # Dependencies and scripts
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── utils/          # Backend utilities
│   └── package.json        # Backend dependencies
└── database/               # Database schemas and migrations
    └── schema.sql          # PostgreSQL schema
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn
- PostgreSQL database (Neon account)
- Firebase project
- Google Maps API key

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Environment setup**:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your configuration:
   ```env
   REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-key
   ```

4. **Start development server**:
   ```bash
   npm start
   ```

### Backend Setup (Coming Soon)

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment setup**:
   ```bash
   cp .env.example .env
   ```

4. **Database setup**:
   - Create a Neon PostgreSQL database
   - Run the schema from `database/schema.sql`

5. **Start development server**:
   ```bash
   npm run dev
   ```

## 🧪 Development Status

### ✅ Completed
- [x] Project structure setup
- [x] React application with TypeScript
- [x] TailwindCSS design system
- [x] Authentication UI (Login/Register)
- [x] User portal components and pages
- [x] Responsive design implementation
- [x] Firebase Auth integration (UI)
- [x] Routing and navigation
- [x] Professional UI/UX design

### 🔄 In Progress
- [ ] Backend API development
- [ ] Database integration
- [ ] Firebase Auth backend integration
- [ ] NGO portal functionality
- [ ] Admin portal functionality

### 📋 Upcoming
- [ ] AI device recognition integration
- [ ] Google Maps API integration
- [ ] QR code generation and scanning
- [ ] Chart.js analytics integration
- [ ] Real-time notifications
- [ ] PDF report generation
- [ ] Deployment setup (Vercel + Render/Heroku)

## 🔧 Technology Stack

### Frontend
- **React 19** with TypeScript
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **React Query** for data fetching
- **React Hook Form** for form management
- **Lucide React** for icons

### Backend (Planned)
- **Node.js** with Express.js
- **PostgreSQL** with Sequelize ORM
- **Firebase Admin** for authentication
- **JWT** for API authentication
- **Multer** for file uploads
- **Sharp** for image processing

### External Services
- **Firebase Auth** for user authentication
- **Neon** for PostgreSQL hosting
- **Google Maps API** for location services
- **Google Vision API** for OCR
- **TensorFlow Lite** for AI device recognition

## 🎯 Key Features Implemented

### User Experience
- **Elegant Login/Register** with Google OAuth support
- **Responsive Dashboard** with environmental impact stats
- **Device Upload Flow** with drag-and-drop image uploads
- **Device Management** with QR code tracking
- **NGO Discovery** with interactive mapping (UI ready)
- **Gamification Hub** with badges and leaderboards
- **Impact Visualization** with detailed environmental metrics

### Design Excellence
- **Professional UI** with clean, natural green theme
- **Smooth Animations** using Framer Motion
- **Mobile-First Design** that works on all devices
- **Consistent Typography** with Poppins and Inter fonts
- **Intuitive Navigation** with role-based routing
- **Loading States** and error handling throughout

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with advanced layouts
- **Tablet**: Adapted UI with optimized touch interactions
- **Mobile**: Streamlined interface with mobile-first design

## 🔐 Security Features

- **Firebase Authentication** with email/password and Google OAuth
- **Protected Routes** based on user roles
- **JWT Token Management** for API security
- **Input Validation** with React Hook Form and Yup
- **XSS Protection** with proper data sanitization

## 🚀 Deployment Strategy

### Frontend (Vercel)
- Automatic deployments from Git
- Environment variable management
- CDN optimization for global performance

### Backend (Render/Heroku)
- Container-based deployment
- Automatic scaling
- Environment variable security

### Database (Neon)
- Managed PostgreSQL hosting
- Automatic backups
- Connection pooling

## 📈 Performance Optimizations

- **Code Splitting** with React lazy loading
- **Image Optimization** with proper formats and sizes
- **Bundle Analysis** for optimal chunk sizes
- **Caching Strategies** for API responses
- **Database Indexing** for fast queries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- Design inspiration from modern environmental platforms
- TailwindCSS for the excellent utility-first CSS framework
- React community for amazing ecosystem
- Firebase for seamless authentication
- Lucide for beautiful icons

---

**GreenCycle** - Making e-waste management smart, sustainable, and rewarding. 🌱♻️