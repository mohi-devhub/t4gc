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
import { ArrowLeft, Plus, FileText, Calendar, Clock, Upload, Users } from 'lucide-react';

export default function AssignmentsPage() {
  const router = useRouter();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
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
          <h1 className="text-3xl font-bold">Assignments</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Create and manage student assignments
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Assignment
        </Button>
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

                  <Button variant="outline" className="w-full" size="sm">
                    View Submissions
                  </Button>
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
    </div>
  );
}
