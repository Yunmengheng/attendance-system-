# Attendance System with Supabase Integration

A modern, location-based attendance tracking system built with React, TypeScript, and Supabase.

## Features

- 🔐 **Full Authentication** - Secure sign up, login, and logout with Supabase Auth
- 👥 **Role-Based Access** - Separate interfaces for teachers and students
- 📍 **Location-Based Attendance** - Check in/out based on geographical location
- 📊 **Real-time Data** - Powered by Supabase real-time database
- 🎨 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Next.js (App Router)
- **Backend**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Context API
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 16+ installed
- A Supabase account ([sign up here](https://supabase.com))

### 1. Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd "Attendance System Website Design"
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned (takes ~2 minutes)

#### Run the Database Schema

1. In your Supabase project dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql` from this repository
3. Paste it into the SQL Editor and click **Run**

This will create:
- `profiles` table - User profiles with role information
- `classes` table - Class information and location data
- `class_enrollments` table - Student-class relationships
- `attendance_records` table - Check-in/check-out records
- Row Level Security (RLS) policies - Secure data access
- Database functions and triggers

#### Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Project Settings** → **API**
2. Copy your **Project URL** (looks like: `https://xxxxx.supabase.co`)
3. Copy your **anon/public key** (starts with `eyJ...`)

### 4. Configure Environment Variables

1. Your `.env.local` file has already been created with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://hqsibgdidjpckyuzfmwg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

**Important**: Make sure you're using the **anon/public key**, not the publishable key. You can find it in:
- Supabase Dashboard → Project Settings → API → Project API keys → "anon public"

### 5. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Usage

### For Teachers

1. **Sign Up** as a teacher
2. **Create Classes** with location-based attendance zones
3. **View Attendance Reports** for your classes
4. **Manage Class Codes** - Share codes with students to join

### For Students

1. **Sign Up** as a student
2. **Join Classes** using class codes provided by teachers
3. **Check In/Out** when within the class location radius
4. **View Attendance History** for all your classes

## Database Schema

### Tables

- **profiles**: User information and roles
- **classes**: Class details and location boundaries
- **class_enrollments**: Student enrollment in classes
- **attendance_records**: Check-in/check-out logs with location data

### Security

- Row Level Security (RLS) enabled on all tables
- Teachers can only access their own classes
- Students can only access classes they're enrolled in
- All data operations are validated server-side

## API Reference

### Authentication

The app uses Supabase Auth with the following methods:

\`\`\`typescript
import { useAuth } from './contexts/AuthContext';

const { signIn, signUp, signOut, user, profile } = useAuth();

// Sign in
await signIn(email, password);

// Sign up
await signUp(email, password, name, role);

// Sign out
await signOut();
\`\`\`

### Database Operations

Example queries using Supabase:

\`\`\`typescript
import { supabase } from './lib/supabase';

// Get user's classes (teacher)
const { data: classes } = await supabase
  .from('classes')
  .select('*')
  .eq('teacher_id', userId);

// Get enrolled classes (student)
const { data: enrollments } = await supabase
  .from('class_enrollments')
  .select('*, classes(*)')
  .eq('student_id', userId);

// Record attendance
const { data } = await supabase
  .from('attendance_records')
  .insert({
    class_id: classId,
    student_id: studentId,
    check_in_time: new Date().toISOString(),
    check_in_latitude: latitude,
    check_in_longitude: longitude
  });
\`\`\`

## Project Structure

\`\`\`
├── src/
│   ├── components/          # React components
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── TeacherDashboard.tsx
│   │   ├── StudentDashboard.tsx
│   │   └── ui/              # Reusable UI components
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication context
│   ├── lib/                 # Utilities and configurations
│   │   └── supabase.ts      # Supabase client setup
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── supabase-schema.sql      # Database schema
├── .env.example             # Environment variables template
└── package.json
\`\`\`

## Troubleshooting

### Authentication Issues

- Verify your Supabase URL and anon key are correct in `.env`
- Check that email confirmation is disabled in Supabase Auth settings (for development)
- Clear browser cache and try again

### Database Errors

- Ensure the schema was run successfully in Supabase SQL Editor
- Check RLS policies are enabled
- Verify your user has the correct role in the `profiles` table

### Location Access

- Make sure your browser has permission to access location
- HTTPS is required for geolocation in production
- Test on a device with GPS for best results

## Deployment

### Build for Production

\`\`\`bash
npm run build
\`\`\`

The production-ready files will be in the `dist/` directory.

### Deploy to Vercel/Netlify

1. Push your code to GitHub
2. Connect your repository to Vercel or Netlify
3. Add environment variables in the hosting platform:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues and questions:
- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the [React Documentation](https://react.dev)
- Open an issue in this repository
