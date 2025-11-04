'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Plus, FileText, Calendar, Clock, Upload, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function AssignmentsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  
  // Track student submissions (in real app, this would come from backend)
  const [studentSubmissions, setStudentSubmissions] = useState<{[key: number]: boolean}>({
    3: true, // Assignment 3 already submitted
    4: true  // Assignment 4 already submitted
  });
  
  const [assignments] = useState([
    {
      id: 1,
      title: 'Calculus Assignment - Chapter 5',
      subject: 'Mathematics',
      dueDate: '2025-11-15',
      assignedDate: '2025-11-01',
      totalStudents: 30,
      submitted: 18,
      status: 'active',
      description: 'Complete exercises 1-20 from Chapter 5'
    },
    {
      id: 2,
      title: 'Quantum Physics Lab Report',
      subject: 'Physics',
      dueDate: '2025-11-20',
      assignedDate: '2025-11-03',
      totalStudents: 25,
      submitted: 5,
      status: 'active',
      description: 'Submit lab report on quantum entanglement experiment'
    },
    {
      id: 3,
      title: 'Data Structures - Binary Trees',
      subject: 'Computer Science',
      dueDate: '2025-11-12',
      assignedDate: '2025-10-29',
      totalStudents: 30,
      submitted: 30,
      status: 'completed',
      description: 'Implement binary search tree with all operations'
    },
    {
      id: 4,
      title: 'Linear Algebra - Matrix Operations',
      subject: 'Mathematics',
      dueDate: '2025-11-08',
      assignedDate: '2025-10-25',
      totalStudents: 28,
      submitted: 28,
      status: 'completed',
      description: 'Solve matrix problems from worksheet'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    }
  };

  const calculateProgress = (submitted: number, total: number) => {
    return Math.round((submitted / total) * 100);
  };

  const handleOpenSubmitDialog = (assignment: any) => {
    setSelectedAssignment(assignment);
    setSubmitDialogOpen(true);
  };

  const handleSubmitAssignment = () => {
    if (!selectedAssignment) return;
    
    // In real app, upload file and notes to backend
    setStudentSubmissions({
      ...studentSubmissions,
      [selectedAssignment.id]: true
    });
    
    setSubmitDialogOpen(false);
    setSubmissionFile(null);
    setSubmissionNotes('');
    setSelectedAssignment(null);
    
    // Show success message (you can use toast here)
    alert('Assignment submitted successfully!');
  };

  const isSubmitted = (assignmentId: number) => {
    return studentSubmissions[assignmentId] === true;
  };

  // Admin view - view-only overview by teacher and subject
  if (user?.role === 'admin') {
    const teacherAssignmentData = [
      {
        id: 1,
        teacherName: 'Dr. Sarah Johnson',
        subject: 'Mathematics - Calculus I',
        totalAssignments: 12,
        activeAssignments: 3,
        completedAssignments: 9,
        totalStudents: 30,
        avgSubmissionRate: 92,
        pendingSubmissions: 24
      },
      {
        id: 2,
        teacherName: 'Prof. Michael Chen',
        subject: 'Physics - Quantum Mechanics',
        totalAssignments: 10,
        activeAssignments: 2,
        completedAssignments: 8,
        totalStudents: 25,
        avgSubmissionRate: 88,
        pendingSubmissions: 12
      },
      {
        id: 3,
        teacherName: 'Dr. Emily Rodriguez',
        subject: 'Computer Science - Data Structures',
        totalAssignments: 15,
        activeAssignments: 4,
        completedAssignments: 11,
        totalStudents: 30,
        avgSubmissionRate: 95,
        pendingSubmissions: 32
      },
      {
        id: 4,
        teacherName: 'Dr. James Wilson',
        subject: 'Chemistry - Organic Chemistry',
        totalAssignments: 8,
        activeAssignments: 1,
        completedAssignments: 7,
        totalStudents: 28,
        avgSubmissionRate: 85,
        pendingSubmissions: 8
      }
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Assignments Overview</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              View assignment statistics for all subjects and teachers
            </p>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Assignments</p>
                  <p className="text-2xl font-bold mt-1">
                    {teacherAssignmentData.reduce((acc, t) => acc + t.totalAssignments, 0)}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Active Assignments</p>
                  <p className="text-2xl font-bold mt-1">
                    {teacherAssignmentData.reduce((acc, t) => acc + t.activeAssignments, 0)}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Pending Submissions</p>
                  <p className="text-2xl font-bold mt-1">
                    {teacherAssignmentData.reduce((acc, t) => acc + t.pendingSubmissions, 0)}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Avg. Submission Rate</p>
                  <p className="text-2xl font-bold mt-1">
                    {Math.round(teacherAssignmentData.reduce((acc, t) => acc + t.avgSubmissionRate, 0) / teacherAssignmentData.length)}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Teacher-wise Assignment Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Assignment Overview</CardTitle>
            <CardDescription>View assignment statistics for each subject and teacher</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teacherAssignmentData.map((teacher) => (
                <div
                  key={teacher.id}
                  className="p-4 rounded-lg border hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{teacher.subject}</h3>
                      <p className="text-sm text-muted-foreground">{teacher.teacherName}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${
                        teacher.avgSubmissionRate >= 90 ? 'text-green-600' : 
                        teacher.avgSubmissionRate >= 75 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {teacher.avgSubmissionRate}%
                      </p>
                      <p className="text-xs text-muted-foreground">Avg. Submission Rate</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="text-center p-3 rounded bg-blue-50 dark:bg-blue-950/20">
                      <p className="text-lg font-bold text-blue-600">{teacher.totalAssignments}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div className="text-center p-3 rounded bg-green-50 dark:bg-green-950/20">
                      <p className="text-lg font-bold text-green-600">{teacher.activeAssignments}</p>
                      <p className="text-xs text-muted-foreground">Active</p>
                    </div>
                    <div className="text-center p-3 rounded bg-gray-50 dark:bg-gray-950/20">
                      <p className="text-lg font-bold text-gray-600 dark:text-gray-400">{teacher.completedAssignments}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                    <div className="text-center p-3 rounded bg-orange-50 dark:bg-orange-950/20">
                      <p className="text-lg font-bold text-orange-600">{teacher.pendingSubmissions}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                    <div className="text-center p-3 rounded bg-purple-50 dark:bg-purple-950/20">
                      <p className="text-lg font-bold text-purple-600">{teacher.totalStudents}</p>
                      <p className="text-xs text-muted-foreground">Students</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Overall Submission Rate</span>
                      <span className="font-medium">{teacher.avgSubmissionRate}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          teacher.avgSubmissionRate >= 90 ? 'bg-green-600' : 
                          teacher.avgSubmissionRate >= 75 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${teacher.avgSubmissionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Teacher/Student view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Assignments</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            {user?.role === 'teacher' ? 'Create and manage student assignments' : 'View and submit your assignments'}
          </p>
        </div>
        {user?.role === 'teacher' && (
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Assignment
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Active Assignments</p>
                <p className="text-2xl font-bold mt-1">
                  {assignments.filter((a) => a.status === 'active').length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Completed</p>
                <p className="text-2xl font-bold mt-1">
                  {assignments.filter((a) => a.status === 'completed').length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Submissions</p>
                <p className="text-2xl font-bold mt-1">
                  {assignments.reduce((acc, a) => acc + a.submitted, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments List */}
      <div className="grid grid-cols-1 gap-4">
        {assignments.map((assignment) => {
          const progress = calculateProgress(assignment.submitted, assignment.totalStudents);
          const daysLeft = Math.ceil(
            (new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );

          return (
            <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <Badge className={getStatusColor(assignment.status)} variant="secondary">
                        {assignment.status}
                      </Badge>
                    </div>
                    <CardDescription className="space-y-1">
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {assignment.subject}
                      </p>
                      <p className="text-sm">{assignment.description}</p>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Assigned</p>
                        <p className="font-medium">
                          {new Date(assignment.assignedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Due Date</p>
                        <p className="font-medium">
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Submissions</p>
                        <p className="font-medium">
                          {assignment.submitted}/{assignment.totalStudents}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {assignment.status === 'active' && daysLeft > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {daysLeft} {daysLeft === 1 ? 'day' : 'days'} remaining
                    </p>
                  )}

                  {user?.role === 'teacher' ? (
                    <Button variant="outline" className="w-full" size="sm">
                      View Submissions
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      {isSubmitted(assignment.id) ? (
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full" size="sm" disabled>
                            <FileText className="h-4 w-4 mr-2" />
                            Submitted
                          </Button>
                          <p className="text-xs text-center text-green-600 dark:text-green-400">
                            ✓ Your assignment has been submitted
                          </p>
                        </div>
                      ) : assignment.status === 'active' ? (
                        <Button 
                          className="w-full" 
                          size="sm"
                          onClick={() => handleOpenSubmitDialog(assignment)}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Submit Assignment
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full" size="sm" disabled>
                          Assignment Closed
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Assignment Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
            <DialogDescription>
              Upload and assign work to students with a deadline
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Assignment Title *</Label>
              <Input id="title" placeholder="e.g., Chapter 5 Exercises" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input id="subject" placeholder="e.g., Mathematics" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Assignment instructions and requirements"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignedDate">Assigned Date *</Label>
                <Input id="assignedDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input id="dueDate" type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">Upload File (Optional)</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX (MAX. 10MB)</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setCreateDialogOpen(false)}>Create Assignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Assignment Dialog - For Students */}
      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent className="sm:max-w-[500px] dark:bg-neutral-900 dark:border-neutral-700">
          <DialogHeader>
            <DialogTitle className="dark:text-neutral-100">Submit Assignment</DialogTitle>
            <DialogDescription className="dark:text-neutral-400">
              {selectedAssignment?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="submission-file" className="dark:text-neutral-200">Upload Your Work *</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition dark:border-neutral-700 dark:hover:border-primary">
                <input
                  id="submission-file"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.zip"
                  onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="submission-file" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  {submissionFile ? (
                    <div>
                      <p className="text-sm font-medium text-primary">{submissionFile.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(submissionFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, DOC, DOCX, TXT, ZIP (MAX. 10MB)
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="submission-notes" className="dark:text-neutral-200">Notes (Optional)</Label>
              <Textarea
                id="submission-notes"
                placeholder="Add any comments or notes about your submission..."
                rows={4}
                value={submissionNotes}
                onChange={(e) => setSubmissionNotes(e.target.value)}
                className="dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-100"
              />
            </div>

            {selectedAssignment && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-300">Due Date</p>
                    <p className="text-blue-700 dark:text-blue-400">
                      {new Date(selectedAssignment.dueDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setSubmitDialogOpen(false);
                setSubmissionFile(null);
                setSubmissionNotes('');
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitAssignment}
              disabled={!submissionFile}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
            >
              <Upload className="h-4 w-4 mr-2" />
              Submit Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
