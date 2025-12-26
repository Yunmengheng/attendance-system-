'use client';

import { X, Download, Users, CheckCircle, Clock, XCircle, Calendar } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AttendanceReportModalProps {
  classData: {
    id: string;
    name: string;
    code: string;
  };
  onClose: () => void;
}

interface AttendanceRecord {
  id: string;
  studentName: string;
  studentEmail: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'present' | 'late' | 'absent';
  duration?: string;
}

export function AttendanceReportModal({ classData, onClose }: AttendanceReportModalProps) {
  const [dateFilter, setDateFilter] = useState('all');

  // Mock attendance data
  const attendanceRecords: AttendanceRecord[] = [
    {
      id: '1',
      studentName: 'John Doe',
      studentEmail: 'john@example.com',
      date: '2024-12-17',
      checkInTime: '09:00 AM',
      checkOutTime: '10:30 AM',
      status: 'present',
      duration: '1h 30m'
    },
    {
      id: '2',
      studentName: 'Jane Smith',
      studentEmail: 'jane@example.com',
      date: '2024-12-17',
      checkInTime: '09:05 AM',
      checkOutTime: '10:35 AM',
      status: 'late',
      duration: '1h 30m'
    },
    {
      id: '3',
      studentName: 'Bob Johnson',
      studentEmail: 'bob@example.com',
      date: '2024-12-17',
      checkInTime: '-',
      status: 'absent'
    },
    {
      id: '4',
      studentName: 'Alice Williams',
      studentEmail: 'alice@example.com',
      date: '2024-12-17',
      checkInTime: '08:58 AM',
      checkOutTime: '10:28 AM',
      status: 'present',
      duration: '1h 30m'
    },
    {
      id: '5',
      studentName: 'John Doe',
      studentEmail: 'john@example.com',
      date: '2024-12-16',
      checkInTime: '09:02 AM',
      checkOutTime: '10:32 AM',
      status: 'present',
      duration: '1h 30m'
    },
    {
      id: '6',
      studentName: 'Jane Smith',
      studentEmail: 'jane@example.com',
      date: '2024-12-16',
      checkInTime: '09:00 AM',
      checkOutTime: '10:30 AM',
      status: 'present',
      duration: '1h 30m'
    }
  ];

  const handleExportCSV = () => {
    const headers = ['Student Name', 'Email', 'Date', 'Check In', 'Check Out', 'Duration', 'Status'];
    const rows = attendanceRecords.map(record => [
      record.studentName,
      record.studentEmail,
      record.date,
      record.checkInTime,
      record.checkOutTime || '-',
      record.duration || '-',
      record.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${classData.name}_attendance_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Attendance report exported successfully');
  };

  const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
  const lateCount = attendanceRecords.filter(r => r.status === 'late').length;
  const absentCount = attendanceRecords.filter(r => r.status === 'absent').length;
  const totalRecords = attendanceRecords.length;
  const attendanceRate = totalRecords > 0 ? Math.round(((presentCount + lateCount) / totalRecords) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-white dark:bg-card rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-card border-b border-border px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-2xl">{classData.name}</h2>
            <p className="text-sm text-muted-foreground">Attendance Report</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 py-5 border-b border-border">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">Present</span>
              </div>
              <div className="text-2xl">{presentCount}</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-700">Late</span>
              </div>
              <div className="text-2xl">{lateCount}</div>
            </div>
            <div className="bg-red-50 p-4 rounded-xl border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-700">Absent</span>
              </div>
              <div className="text-2xl">{absentCount}</div>
            </div>
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary">Rate</span>
              </div>
              <div className="text-2xl">{attendanceRate}%</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-6 py-4">
          <table className="w-full">
            <thead className="sticky top-0 bg-secondary border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-sm text-muted-foreground">Student</th>
                <th className="px-4 py-3 text-left text-sm text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-left text-sm text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left text-sm text-muted-foreground">Check In</th>
                <th className="px-4 py-3 text-left text-sm text-muted-foreground">Check Out</th>
                <th className="px-4 py-3 text-left text-sm text-muted-foreground">Duration</th>
                <th className="px-4 py-3 text-left text-sm text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {attendanceRecords.map((record) => (
                <tr key={record.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-4 py-4 text-sm">{record.studentName}</td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{record.studentEmail}</td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{record.date}</td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{record.checkInTime}</td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{record.checkOutTime || '-'}</td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{record.duration || '-'}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${
                        record.status === 'present'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : record.status === 'late'
                          ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {record.status === 'present' && <CheckCircle className="w-3 h-3" />}
                      {record.status === 'late' && <Clock className="w-3 h-3" />}
                      {record.status === 'absent' && <XCircle className="w-3 h-3" />}
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
