'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, Clock, MapPin, AlertCircle, BookOpen, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ExamsPage() {
  const router = useRouter();
  
  const [upcomingExams] = useState([
    {
      id: 1,
      subject: 'Mathematics - Calculus I',
      examType: 'Midterm',
      date: '2025-11-15',
      time: '10:00 AM - 12:00 PM',
      duration: '2 hours',
      location: 'Main Hall A',
      instructor: 'Dr. Sarah Johnson',
      totalMarks: 100,
      syllabus: 'Chapters 1-5',
      status: 'upcoming'
    },
    {
      id: 2,
      subject: 'Physics - Quantum Mechanics',
      examType: 'Quiz',
      date: '2025-11-12',
      time: '2:00 PM - 3:00 PM',
      duration: '1 hour',
      location: 'Room 203',
      instructor: 'Prof. Michael Chen',
      totalMarks: 50,
      syllabus: 'Wave functions, Operators',
      status: 'upcoming'
    },
    {
      id: 3,
      subject: 'Computer Science - Data Structures',
      examType: 'Final',
      date: '2025-11-25',
      time: '9:00 AM - 12:00 PM',
      duration: '3 hours',
      location: 'Computer Lab',
      instructor: 'Dr. Emily Rodriguez',
      totalMarks: 150,
      syllabus: 'All chapters',
      status: 'upcoming'
    },
    {
      id: 4,
      subject: 'Chemistry - Organic Chemistry',
      examType: 'Midterm',
      date: '2025-11-18',
      time: '1:00 PM - 3:00 PM',
      duration: '2 hours',
      location: 'Science Block B',
      instructor: 'Dr. Robert Lee',
      totalMarks: 100,
      syllabus: 'Chapters 6-10',
      status: 'upcoming'
    }
  ]);

  const [pastExams] = useState([
    {
      id: 5,
      subject: 'English Literature',
      examType: 'Quiz',
      date: '2025-10-28',
      time: '11:00 AM - 12:00 PM',
      duration: '1 hour',
      location: 'Room 302',
      instructor: 'Prof. Amanda White',
      totalMarks: 50,
      averageScore: 42,
      status: 'completed'
    },
    {
      id: 6,
      subject: 'Biology - Genetics',
      examType: 'Midterm',
      date: '2025-10-20',
      time: '10:00 AM - 12:00 PM',
      duration: '2 hours',
      location: 'Lab 304',
      instructor: 'Prof. Lisa Anderson',
      totalMarks: 100,
      averageScore: 78,
      status: 'completed'
    }
  ]);

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case 'Quiz':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Midterm':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'Final':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getDaysUntil = (examDate: string) => {
    const today = new Date();
    const exam = new Date(examDate);
    const diffTime = exam.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 3) return 'text-red-600 font-semibold';
    if (days <= 7) return 'text-orange-600 font-medium';
    return 'text-green-600';
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
          <h1 className="text-3xl font-bold">Exams Schedule</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            View and manage exam schedules
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Upcoming Exams</p>
                <p className="text-2xl font-bold mt-1">{upcomingExams.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">This Week</p>
                <p className="text-2xl font-bold mt-1">
                  {upcomingExams.filter((e) => getDaysUntil(e.date) <= 7).length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Completed</p>
                <p className="text-2xl font-bold mt-1">{pastExams.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Next Exam In</p>
                <p className="text-2xl font-bold mt-1">
                  {Math.min(...upcomingExams.map((e) => getDaysUntil(e.date)))} days
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exams Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Exams</TabsTrigger>
          <TabsTrigger value="past">Past Exams</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingExams
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((exam) => {
              const daysUntil = getDaysUntil(exam.date);
              return (
                <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">{exam.subject}</CardTitle>
                          <Badge className={getExamTypeColor(exam.examType)} variant="secondary">
                            {exam.examType}
                          </Badge>
                        </div>
                        <CardDescription>
                          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Instructor: {exam.instructor}
                          </p>
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className={cn('text-sm', getUrgencyColor(daysUntil))}>
                          {daysUntil > 0
                            ? `${daysUntil} ${daysUntil === 1 ? 'day' : 'days'} left`
                            : daysUntil === 0
                            ? 'Today'
                            : 'Overdue'}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Date</p>
                          <p className="text-sm font-medium">
                            {new Date(exam.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Time</p>
                          <p className="text-sm font-medium">{exam.time}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Location</p>
                          <p className="text-sm font-medium">{exam.location}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Total Marks</p>
                          <p className="text-sm font-medium">{exam.totalMarks}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg mb-4">
                      <p className="text-sm font-medium mb-1">Syllabus Coverage:</p>
                      <p className="text-sm text-muted-foreground">{exam.syllabus}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        View Syllabus
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Study Materials
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastExams.map((exam) => (
            <Card key={exam.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{exam.subject}</CardTitle>
                      <Badge className={getExamTypeColor(exam.examType)} variant="secondary">
                        {exam.examType}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Completed
                      </Badge>
                    </div>
                    <CardDescription>
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Instructor: {exam.instructor}
                      </p>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="text-sm font-medium">
                        {new Date(exam.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="text-sm font-medium">{exam.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Total Marks</p>
                      <p className="text-sm font-medium">{exam.totalMarks}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Class Average</p>
                      <p className="text-sm font-medium">
                        {exam.averageScore}/{exam.totalMarks} (
                        {Math.round((exam.averageScore / exam.totalMarks) * 100)}%)
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Results
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
