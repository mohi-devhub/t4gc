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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Shield, UserPlus, Search } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface UserAccess {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  permissions: string[];
  status: 'active' | 'inactive';
}

export default function AccessControlPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAccess | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto py-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const permissions: Permission[] = [
    { id: 'tournaments', name: 'Tournament Management', description: 'Create and manage tournaments' },
    { id: 'fixtures', name: 'Fixtures Management', description: 'Generate and manage fixtures' },
    { id: 'participants', name: 'Participant Management', description: 'Manage tournament participants' },
    { id: 'assignments', name: 'Assignment Management', description: 'Create and manage assignments' },
    { id: 'attendance', name: 'Attendance Management', description: 'Mark and track attendance' },
    { id: 'exams', name: 'Exam Management', description: 'Create and schedule exams' },
    { id: 'timetable', name: 'Timetable Management', description: 'Manage class timetables' },
    { id: 'forms', name: 'Form Management', description: 'Create and manage forms' },
    { id: 'sponsorship', name: 'Sponsorship Management', description: 'Manage sponsorships' },
    { id: 'gallery', name: 'Gallery Management', description: 'Manage gallery content' },
  ];

  const [users, setUsers] = useState<UserAccess[]>([
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@school.edu',
      role: 'teacher',
      permissions: ['assignments', 'attendance', 'exams', 'timetable'],
      status: 'active'
    },
    {
      id: 2,
      name: 'Prof. Michael Chen',
      email: 'michael.chen@school.edu',
      role: 'teacher',
      permissions: ['assignments', 'attendance', 'exams', 'timetable', 'tournaments'],
      status: 'active'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@school.edu',
      role: 'teacher',
      permissions: ['assignments', 'attendance', 'timetable'],
      status: 'active'
    },
    {
      id: 4,
      name: 'John Smith',
      email: 'john.smith@student.edu',
      role: 'student',
      permissions: [],
      status: 'active'
    },
    {
      id: 5,
      name: 'Emma Johnson',
      email: 'emma.johnson@student.edu',
      role: 'student',
      permissions: [],
      status: 'active'
    },
  ]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'teacher':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'student':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const handleEditAccess = (user: UserAccess) => {
    setSelectedUser({ ...user });
    setEditDialogOpen(true);
  };

  const handlePermissionToggle = (permissionId: string) => {
    if (!selectedUser) return;
    
    const newPermissions = selectedUser.permissions.includes(permissionId)
      ? selectedUser.permissions.filter(p => p !== permissionId)
      : [...selectedUser.permissions, permissionId];
    
    setSelectedUser({ ...selectedUser, permissions: newPermissions });
  };

  const handleSaveAccess = () => {
    if (!selectedUser) return;
    
    setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  const handleQuickAccessPreset = (preset: 'full' | 'academic' | 'minimal') => {
    if (!selectedUser) return;

    let newPermissions: string[] = [];
    
    switch (preset) {
      case 'full':
        newPermissions = permissions.map(p => p.id);
        break;
      case 'academic':
        newPermissions = ['assignments', 'attendance', 'exams', 'timetable'];
        break;
      case 'minimal':
        newPermissions = ['attendance', 'timetable'];
        break;
    }
    
    setSelectedUser({ ...selectedUser, permissions: newPermissions });
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Access Control</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Manage user permissions and access levels
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Users</p>
                <p className="text-2xl font-bold mt-1">{users.length}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Teachers</p>
                <p className="text-2xl font-bold mt-1">
                  {users.filter(u => u.role === 'teacher').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Students</p>
                <p className="text-2xl font-bold mt-1">
                  {users.filter(u => u.role === 'student').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Active</p>
                <p className="text-2xl font-bold mt-1">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Access Management</CardTitle>
          <CardDescription>Manage permissions for all users</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)} variant="secondary">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.length > 0 ? (
                        user.permissions.slice(0, 3).map((perm) => (
                          <Badge key={perm} variant="outline" className="text-xs">
                            {permissions.find(p => p.id === perm)?.name.split(' ')[0]}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No permissions</span>
                      )}
                      {user.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.permissions.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                      }
                      variant="secondary"
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditAccess(user)}
                    >
                      Edit Access
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Access Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Access - {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              Manage permissions for this user
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Quick Access Presets</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAccessPreset('full')}
                >
                  Full Access
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAccessPreset('academic')}
                >
                  Academic Only
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAccessPreset('minimal')}
                >
                  Minimal Access
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="border rounded-lg p-4 max-h-96 overflow-y-auto space-y-3">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={permission.id}
                      checked={selectedUser?.permissions.includes(permission.id)}
                      onCheckedChange={() => handlePermissionToggle(permission.id)}
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={permission.id}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        {permission.name}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm font-medium mb-1">Selected Permissions:</p>
              <p className="text-sm text-muted-foreground">
                {selectedUser?.permissions.length || 0} of {permissions.length} permissions granted
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAccess}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
