'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, MapPin, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TimetablePage() {
  const router = useRouter();
  
  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];
  
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  const timetableData = {
    Monday: [
      { time: '9:00 AM', subject: 'Mathematics', instructor: 'Dr. Sarah Johnson', room: 'Room 101', duration: 1.5 },
      { time: '11:00 AM', subject: 'Physics', instructor: 'Prof. Michael Chen', room: 'Lab 203', duration: 2 },
      { time: '2:00 PM', subject: 'Computer Science', instructor: 'Dr. Emily Rodriguez', room: 'Computer Lab', duration: 1.5 }
    ],
    Tuesday: [
      { time: '8:00 AM', subject: 'Chemistry', instructor: 'Dr. Robert Lee', room: 'Lab 105', duration: 2 },
      { time: '10:00 AM', subject: 'English Literature', instructor: 'Prof. Amanda White', room: 'Room 302', duration: 1 },
      { time: '1:00 PM', subject: 'History', instructor: 'Dr. James Miller', room: 'Room 201', duration: 1.5 }
    ],
    Wednesday: [
      { time: '9:00 AM', subject: 'Mathematics', instructor: 'Dr. Sarah Johnson', room: 'Room 101', duration: 1.5 },
      { time: '12:00 PM', subject: 'Biology', instructor: 'Prof. Lisa Anderson', room: 'Lab 304', duration: 2 },
      { time: '3:00 PM', subject: 'Physical Education', instructor: 'Coach David Brown', room: 'Sports Complex', duration: 1.5 }
    ],
    Thursday: [
      { time: '8:00 AM', subject: 'Computer Science', instructor: 'Dr. Emily Rodriguez', room: 'Computer Lab', duration: 2 },
      { time: '11:00 AM', subject: 'Physics', instructor: 'Prof. Michael Chen', room: 'Lab 203', duration: 1.5 },
      { time: '2:00 PM', subject: 'Art & Design', instructor: 'Ms. Rachel Green', room: 'Art Studio', duration: 2 }
    ],
    Friday: [
      { time: '9:00 AM', subject: 'Chemistry', instructor: 'Dr. Robert Lee', room: 'Lab 105', duration: 1.5 },
      { time: '11:00 AM', subject: 'Mathematics', instructor: 'Dr. Sarah Johnson', room: 'Room 101', duration: 1.5 },
      { time: '1:00 PM', subject: 'English Literature', instructor: 'Prof. Amanda White', room: 'Room 302', duration: 1.5 }
    ]
  };

  const subjectColors: { [key: string]: string } = {
    'Mathematics': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300',
    'Physics': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-300',
    'Computer Science': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-300',
    'Chemistry': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-300',
    'English Literature': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 border-pink-300',
    'History': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-300',
    'Biology': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 border-teal-300',
    'Physical Education': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-300',
    'Art & Design': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-300'
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
          <h1 className="text-3xl font-bold">Class Timetable</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Weekly schedule for all classes
          </p>
        </div>
        <Button variant="outline">Download PDF</Button>
      </div>

      {/* Timetable Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header Row */}
              <div className="grid grid-cols-6 gap-2 mb-2">
                <div className="font-semibold text-sm text-center p-2">Time</div>
                {weekDays.map((day) => (
                  <div key={day} className="font-semibold text-sm text-center p-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-6 gap-2 mb-2">
                  <div className="text-sm text-muted-foreground text-center p-2 font-medium">
                    {time}
                  </div>
                  {weekDays.map((day) => {
                    const classItem = timetableData[day as keyof typeof timetableData]?.find(
                      (item) => item.time === time
                    );

                    return (
                      <div key={`${day}-${time}`} className="min-h-[60px]">
                        {classItem && (
                          <div
                            className={cn(
                              'p-3 rounded-lg border-l-4 h-full',
                              subjectColors[classItem.subject] || 'bg-gray-100 text-gray-800 border-gray-300'
                            )}
                          >
                            <p className="font-semibold text-xs mb-1">{classItem.subject}</p>
                            <p className="text-xs flex items-center gap-1 mb-1">
                              <User className="h-3 w-3" />
                              {classItem.instructor}
                            </p>
                            <p className="text-xs flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {classItem.room}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Subject Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(subjectColors).map(([subject, colorClass]) => (
              <div key={subject} className="flex items-center gap-2">
                <div className={cn('w-4 h-4 rounded border-l-4', colorClass)} />
                <span className="text-sm">{subject}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Today's Classes */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timetableData.Monday.map((classItem, index) => (
              <div
                key={index}
                className={cn(
                  'p-4 rounded-lg border-l-4',
                  subjectColors[classItem.subject]
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{classItem.subject}</h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {classItem.time} ({classItem.duration}h)
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {classItem.instructor}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {classItem.room}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Join Class
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
