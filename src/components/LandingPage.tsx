'use client';

import { MapPin, CheckCircle, Clock, Shield, Moon, Sun } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export function LandingPage({ onLogin, onSignup, isDarkMode, toggleDarkMode }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-white dark:bg-card/80 backdrop-blur-sm fixed w-full top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl text-foreground">AttendEase</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
              title={isDarkMode ? 'Light mode' : 'Dark mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={onLogin}
              className="px-5 py-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
            >
              Log In
            </button>
            <button
              onClick={onSignup}
              className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 text-primary rounded-full mb-6 border border-primary/10">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span className="text-sm">GPS-Based Attendance</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl text-foreground mb-6 tracking-tight">
                Simple attendance tracking
                <br />
                <span className="text-primary">based on location</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                Automatically track student attendance when they arrive at class. No manual check-ins required.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onSignup}
                  className="px-8 py-3.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Get Started
                </button>
                <button
                  onClick={onLogin}
                  className="px-8 py-3.5 border border-border text-foreground rounded-lg hover:bg-secondary transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-border shadow-lg">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1654366698665-e6d611a9aaa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGNsYXNzcm9vbSUyMGxlYXJuaW5nfGVufDF8fHx8MTc2NjM4NjQ3M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Students in classroom"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-card p-8 rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl mb-3">Location-Based</h3>
              <p className="text-muted-foreground leading-relaxed">
                Students check in automatically when they enter the class boundary
              </p>
            </div>

            <div className="bg-white dark:bg-card p-8 rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl mb-3">Real-Time Tracking</h3>
              <p className="text-muted-foreground leading-relaxed">
                View attendance records in real-time with precise timestamps
              </p>
            </div>

            <div className="bg-white dark:bg-card p-8 rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl mb-3">Easy Reports</h3>
              <p className="text-muted-foreground leading-relaxed">
                Export attendance data to CSV for record-keeping and analysis
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">How it works</h2>
            <p className="text-xl text-muted-foreground">Three simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl mb-2">Create Class</h3>
              <p className="text-muted-foreground">Set location boundaries and share the class code</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl mb-2">Students Join</h3>
              <p className="text-muted-foreground">Students enter the code to join your class</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl mb-2">Auto Check-In</h3>
              <p className="text-muted-foreground">Attendance marked when students arrive at location</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-4xl mb-6">Ready to get started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join teachers and students using smart attendance tracking
          </p>
          <button
            onClick={onSignup}
            className="px-8 py-3.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Create Your Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="text-muted-foreground">AttendEase</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 AttendEase</p>
        </div>
      </footer>
    </div>
  );
}