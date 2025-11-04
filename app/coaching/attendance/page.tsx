'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeft, QrCode, Users, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function AttendancePage() {
  const router = useRouter();
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string>('');
  
  const sessions = [
    { id: '1', name: 'Mathematics - Calculus I', date: '2025-11-08', time: '10:00 AM' },
    { id: '2', name: 'Physics - Quantum Mechanics', date: '2025-11-08', time: '2:00 PM' },
    { id: '3', name: 'Computer Science - Data Structures', date: '2025-11-08', time: '4:00 PM' }
  ];

  const [attendanceRecords] = useState([
    {
      id: 1,
      sessionName: 'Mathematics - Calculus I',
      date: '2025-11-08',
      time: '10:00 AM',
      totalStudents: 30,
      present: 28,
      absent: 2,
      late: 0,
      percentage: 93
    },
    {
      id: 2,
      sessionName: 'Physics - Quantum Mechanics',
      date: '2025-11-07',
      time: '2:00 PM',
      totalStudents: 25,
      present: 23,
      absent: 1,
      late: 1,
      percentage: 92
    },
    {
      id: 3,
      sessionName: 'Computer Science - Data Structures',
      date: '2025-11-06',
      time: '9:00 AM',
      totalStudents: 30,
      present: 30,
      absent: 0,
      late: 0,
      percentage: 100
    }
  ]);

  const [students] = useState([
    { id: 1, name: 'John Smith', rollNo: 'CS001', status: 'present', qrCode: 'QR-CS001-2025', time: '9:58 AM' },
    { id: 2, name: 'Emma Johnson', rollNo: 'CS002', status: 'present', qrCode: 'QR-CS002-2025', time: '9:59 AM' },
    { id: 3, name: 'Michael Brown', rollNo: 'CS003', status: 'late', qrCode: 'QR-CS003-2025', time: '10:15 AM' },
    { id: 4, name: 'Sarah Davis', rollNo: 'CS004', status: 'present', qrCode: 'QR-CS004-2025', time: '9:55 AM' },
    { id: 5, name: 'James Wilson', rollNo: 'CS005', status: 'absent', qrCode: 'QR-CS005-2025', time: '-' },
    { id: 6, name: 'Emily Taylor', rollNo: 'CS006', status: 'present', qrCode: 'QR-CS006-2025', time: '9:57 AM' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'absent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'late':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const generateQRCode = () => {
    setQrDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button variant="ghost" size="sm" onClick={() => router.push('/coaching')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Attendance Management</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Mark and track student attendance using QR codes
          </p>
        </div>
        <Button onClick={generateQRCode}>
          <QrCode className="h-4 w-4 mr-2" />
          Generate QR Code
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Students</p>
                <p className="text-2xl font-bold mt-1">30</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Present Today</p>
                <p className="text-2xl font-bold mt-1">28</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Absent Today</p>
                <p className="text-2xl font-bold mt-1">2</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Avg. Attendance</p>
                <p className="text-2xl font-bold mt-1">95%</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Scan */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Attendance Scan</CardTitle>
          <CardDescription>Scan student QR codes to mark attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="session">Select Session</Label>
                <Select value={selectedSession} onValueChange={setSelectedSession}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a session" />
                  </SelectTrigger>
                  <SelectContent>
                    {sessions.map((session) => (
                      <SelectItem key={session.id} value={session.id}>
                        {session.name} - {session.date} at {session.time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="qrInput">Scan QR Code</Label>
                <Input
                  id="qrInput"
                  placeholder="Click here and scan student QR code"
                  className="font-mono"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">Start Camera Scan</Button>
              <Button variant="outline" className="flex-1">Manual Entry</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Attendance - Mathematics Class</CardTitle>
          <CardDescription>Real-time attendance tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-1">
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">Roll No: {student.rollNo}</p>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    {student.time}
                  </div>
                  <Badge className={getStatusColor(student.status)} variant="secondary">
                    {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          <CardDescription>Past attendance records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {attendanceRecords.map((record) => (
              <div
                key={record.id}
                className="p-4 rounded-lg border hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{record.sessionName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(record.date).toLocaleDateString()} at {record.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{record.percentage}%</p>
                    <p className="text-xs text-muted-foreground">Attendance</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="text-center p-2 rounded bg-green-50 dark:bg-green-950/20">
                    <p className="text-2xl font-bold text-green-600">{record.present}</p>
                    <p className="text-xs text-muted-foreground">Present</p>
                  </div>
                  <div className="text-center p-2 rounded bg-red-50 dark:bg-red-950/20">
                    <p className="text-2xl font-bold text-red-600">{record.absent}</p>
                    <p className="text-xs text-muted-foreground">Absent</p>
                  </div>
                  <div className="text-center p-2 rounded bg-yellow-50 dark:bg-yellow-950/20">
                    <p className="text-2xl font-bold text-yellow-600">{record.late}</p>
                    <p className="text-xs text-muted-foreground">Late</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Session QR Code</DialogTitle>
            <DialogDescription>
              Students can scan this code to mark their attendance
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center p-8 bg-muted rounded-lg">
              <div className="w-64 h-64 bg-white flex items-center justify-center border-4 border-primary rounded-lg">
                <div className="text-center">
                  <QrCode className="h-48 w-48 mx-auto text-primary" />
                  <p className="text-xs text-muted-foreground mt-2">QR Code Placeholder</p>
                </div>
              </div>
              <p className="text-sm font-medium mt-4">Session: Mathematics - Nov 8, 2025</p>
              <p className="text-xs text-muted-foreground">Valid for 15 minutes</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setQrDialogOpen(false)}>
                Close
              </Button>
              <Button className="flex-1">Download QR</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
