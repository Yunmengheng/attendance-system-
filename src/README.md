# AttendEase - GPS-Based Attendance Tracking System

A Next.js application for tracking student attendance using GPS location boundaries.

## Features

- 🌍 **GPS-Based Check-in**: Students can only check in when physically within class location boundaries
- 👨‍🏫 **Teacher Dashboard**: Create classes, set location boundaries, view attendance reports, export CSV data
- 👨‍🎓 **Student Dashboard**: Join classes, check in/out based on GPS, view attendance history
- 🌙 **Dark Mode**: Full dark mode support with persistent theme preference
- 📱 **Responsive Design**: Clean, minimal design that works on all devices

## Getting Started

### Installation

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build for Production

```bash
npm run build
npm run start
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4.0
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Geolocation**: Browser Geolocation API

## Project Structure

```
/app
  /page.tsx          # Main application page
  /layout.tsx        # Root layout with metadata
/components
  /TeacherDashboard.tsx
  /StudentDashboard.tsx
  /LandingPage.tsx
  /LoginPage.tsx
  /SignupPage.tsx
  /CreateClassModal.tsx
  /AttendanceReportModal.tsx
  /ClassCard.tsx
  /JoinClassModal.tsx
  /figma
    /ImageWithFallback.tsx
  /ui                # Reusable UI components
/styles
  /globals.css       # Global styles and CSS variables
```

## Key Features Explained

### GPS-Based Attendance

- Teachers set a specific location (latitude, longitude) and radius for each class
- Students must be physically within the radius to check in
- Real-time location verification using the Haversine formula
- Comprehensive error handling for location permission issues

### Teacher Features

- Create unlimited classes with custom location boundaries
- View live student counts and attendance rates
- Generate detailed attendance reports
- Export attendance data to CSV format
- Share unique class codes with students

### Student Features

- Join classes using invite codes
- Check in/out when within location range
- View personal attendance history
- Track attendance rate and statistics
- See location status (within range/out of range)

### Dark Mode

- Toggle between light and dark themes
- Preference saved to localStorage
- Smooth transitions between themes
- All components optimized for both modes

## Environment Setup

The app uses mock data by default. To connect to a real backend:

1. Set up a Supabase project
2. Configure authentication
3. Create tables for users, classes, and attendance records
4. Update API calls to use real endpoints

## Browser Compatibility

Requires a browser that supports:
- Geolocation API
- localStorage
- Modern JavaScript (ES2017+)

## License

MIT

## Author

Built with Next.js and ❤️
