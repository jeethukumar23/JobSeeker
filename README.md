# Job Seeker App

A modern job seeker platform built with React, Vite, TypeScript, Tailwind CSS, and Firebase.

## Features

- User Authentication (Firebase Auth)
- User Profile Management
- Job Posting for Employers
- Location-based Job Search
- Job Applications
- Mobile-responsive Design

## Tech Stack

- **Frontend Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v4
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase account and project

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Set up Firebase:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Enable **Authentication** > Email/Password
   - Enable **Firestore Database**
   - Create a web app and copy the config values

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   └── ui/          # Reusable UI components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and Firebase config
├── pages/           # Route pages
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── DashboardPage.tsx
│   ├── ProfilePage.tsx
│   ├── PostJobPage.tsx
│   └── SearchJobsPage.tsx
├── App.tsx          # Main app component with routes
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the browser:

- `VITE_FIREBASE_API_KEY` - Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID` - Firebase app ID

## License

MIT
```

```tsx file="app/page.tsx" isDeleted="true"
...deleted...
