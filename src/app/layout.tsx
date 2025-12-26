import type { Metadata } from 'next';
import '../index.css';

export const metadata: Metadata = {
  title: 'AttendEase - GPS-Based Attendance Tracking',
  description: 'Simple attendance tracking based on location. Automatically track student attendance when they arrive at class.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
