"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, BookOpen, FileText, Clock, ClipboardCheck, ArrowLeft, Plus, QrCode } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function CoachingManagementPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "teacher";
  
  const [sessions] = useState([
    {
      id: 1,
      name: "Mathematics - Calculus I",
      date: "2025-11-10",
      time: "10:00 AM - 11:30 AM",
      students: 28,
      maxStudents: 30,
      status: "upcoming",
      instructor: "Dr. Sarah Johnson"
    },
    {
      id: 2,
      name: "Physics - Quantum Mechanics",
      date: "2025-11-08",
      time: "2:00 PM - 3:30 PM",
      students: 25,
      maxStudents: 30,
      status: "ongoing",
      instructor: "Prof. Michael Chen"
    },
    {
      id: 3,
      name: "Computer Science - Data Structures",
      date: "2025-11-05",
      time: "9:00 AM - 10:30 AM",
      students: 30,
      maxStudents: 30,
      status: "completed",
      instructor: "Dr. Emily Rodriguez"
    }
  ]);

  const stats = [
    { label: "Total Students", value: "83", icon: Users, color: "text-blue-600" },
    { label: "Active Sessions", value: "12", icon: Calendar, color: "text-green-600" },
    { label: "Assignments", value: "8", icon: FileText, color: "text-purple-600" },
    { label: "Upcoming Exams", value: "3", icon: BookOpen, color: "text-orange-600" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'ongoing': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold">Class Management</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Manage classes, assignments, attendance, and student progress
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => router.push('/coaching/sessions/create')}>
            <Plus className="h-4 w-4 mr-2" />
            New Session
          </Button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sessions List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Class Sessions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((session) => (
            <Card key={session.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg line-clamp-1">{session.name}</CardTitle>
                  <Badge className={getStatusColor(session.status)} variant="secondary">
                    {session.status}
                  </Badge>
                </div>
                <CardDescription>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      {session.instructor}
                    </p>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-3 w-3 mr-2" />
                      {new Date(session.date).toLocaleDateString()} 
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-3 w-3 mr-2" />
                      {session.time}
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="h-3 w-3 mr-2" />
                      {session.students}/{session.maxStudents} Students
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" size="sm">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {isAdmin && (
              <Button 
                variant="outline" 
                className="justify-start h-auto py-4"
                onClick={() => router.push('/coaching/assignments')}
              >
                <div className="flex flex-col items-start w-full">
                  <div className="flex items-center mb-1">
                    <FileText className="h-4 w-4 mr-2" />
                    <span className="font-semibold">Assignments</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Upload & manage assignments</span>
                </div>
              </Button>
            )}
            {!isAdmin && (
              <Button 
                variant="outline" 
                className="justify-start h-auto py-4"
                onClick={() => router.push('/coaching/assignments')}
              >
                <div className="flex flex-col items-start w-full">
                  <div className="flex items-center mb-1">
                    <FileText className="h-4 w-4 mr-2" />
                    <span className="font-semibold">My Assignments</span>
                  </div>
                  <span className="text-xs text-muted-foreground">View & submit assignments</span>
                </div>
              </Button>
            )}
            {isAdmin && (
              <Button 
                variant="outline" 
                className="justify-start h-auto py-4"
                onClick={() => router.push('/coaching/attendance')}
              >
                <div className="flex flex-col items-start w-full">
                  <div className="flex items-center mb-1">
                    <QrCode className="h-4 w-4 mr-2" />
                    <span className="font-semibold">Attendance</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Mark attendance with QR</span>
                </div>
              </Button>
            )}
            {!isAdmin && (
              <Button 
                variant="outline" 
                className="justify-start h-auto py-4"
                onClick={() => router.push('/student/dashboard')}
              >
                <div className="flex flex-col items-start w-full">
                  <div className="flex items-center mb-1">
                    <QrCode className="h-4 w-4 mr-2" />
                    <span className="font-semibold">My Attendance</span>
                  </div>
                  <span className="text-xs text-muted-foreground">View attendance records</span>
                </div>
              </Button>
            )}
            <Button 
              variant="outline" 
              className="justify-start h-auto py-4"
              onClick={() => router.push('/coaching/timetable')}
            >
              <div className="flex flex-col items-start w-full">
                <div className="flex items-center mb-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="font-semibold">Timetable</span>
                </div>
                <span className="text-xs text-muted-foreground">View class schedule</span>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="justify-start h-auto py-4"
              onClick={() => router.push('/coaching/exams')}
            >
              <div className="flex flex-col items-start w-full">
                <div className="flex items-center mb-1">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span className="font-semibold">Exams</span>
                </div>
                <span className="text-xs text-muted-foreground">Upcoming exam schedule</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
