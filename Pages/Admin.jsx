import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Loader2, 
  Search, 
  Users, 
  Building2, 
  Trash2, 
  Eye,
  EyeOff,
  ExternalLink,
  Shield,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Link as LinkIcon
} from 'lucide-react';
import { format } from 'date-fns';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [clubToDelete, setClubToDelete] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setIsLoadingUser(false);
    };
    loadUser();
  }, []);

  const { data: clubs = [], isLoading: isLoadingClubs } = useQuery({
    queryKey: ['allClubs'],
    queryFn: () => base44.entities.Club.list('-updated_date'),
    enabled: user?.role === 'admin',
  });

  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list('-created_date'),
    enabled: user?.role === 'admin',
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }) => base44.entities.Club.update(id, { is_active: !isActive }),
    onSuccess: () => queryClient.invalidateQueries(['allClubs']),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Club.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['allClubs']);
      setClubToDelete(null);
    },
  });

  const toggleClubLeaderMutation = useMutation({
    mutationFn: ({ userId, isClubLeader }) => 
      base44.entities.User.update(userId, { is_club_leader: !isClubLeader }),
    onSuccess: () => queryClient.invalidateQueries(['allUsers']),
  });

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Access Denied</h2>
            <p className="text-slate-500 mt-2">You don't have permission to access this page.</p>
            <Link to={createPageUrl('Directory')}>
              <Button className="mt-6">Go to Directory</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredClubs = clubs.filter(club => 
    club.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.owner_email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">Admin Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Directory</h1>
          <p className="text-slate-500 mt-2">Oversee all clubs and users in the system</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-slate-200/60">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Clubs</p>
                  <p className="text-2xl font-bold text-slate-900">{clubs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200/60">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Active Clubs</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {clubs.filter(c => c.is_active).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200/60">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Users</p>
                  <p className="text-2xl font-bold text-slate-900">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200/60">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Admins</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="clubs">
          <TabsList className="mb-6">
            <TabsTrigger value="clubs">Clubs</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="clubs">
            <Card className="border-slate-200/60">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <CardTitle>All Clubs</CardTitle>
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Search clubs or owners..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingClubs ? (
                  <div className="py-8 flex justify-center">
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Club</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Updated</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredClubs.map(club => (
                          <TableRow key={club.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {club.logo_url ? (
                                  <img 
                                    src={club.logo_url}
                                    alt={club.name}
                                    className="w-10 h-10 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-amber-500 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                      {club.name?.charAt(0)?.toUpperCase()}
                                    </span>
                                  </div>
                                )}
                                <span className="font-medium text-slate-900">{club.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-600">{club.owner_email}</TableCell>
                            <TableCell>
                              {club.category && (
                                <Badge variant="secondary" className="bg-slate-100">
                                  {club.category}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={club.is_active ? "default" : "secondary"}
                                className={club.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}
                              >
                                {club.is_active ? 'Active' : 'Hidden'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-slate-500">
                              {format(new Date(club.updated_date), 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-2">
                                <Link to={createPageUrl(`ClubProfile?id=${club.id}`)}>
                                  <Button variant="ghost" size="sm">
                                    <ExternalLink className="w-4 h-4" />
                                  </Button>
                                </Link>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => toggleActiveMutation.mutate({ id: club.id, isActive: club.is_active })}
                                >
                                  {club.is_active ? (
                                    <EyeOff className="w-4 h-4 text-slate-500" />
                                  ) : (
                                    <Eye className="w-4 h-4 text-green-600" />
                                  )}
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setClubToDelete(club)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="border-slate-200/60">
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  Manage user permissions and approve club leaders
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingUsers ? (
                  <div className="py-8 flex justify-center">
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>System Role</TableHead>
                          <TableHead>Club Leader</TableHead>
                          <TableHead>Has Club</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map(u => {
                          const userClub = clubs.find(c => c.owner_email === u.email);
                          return (
                            <TableRow key={u.id}>
                              <TableCell className="font-medium text-slate-900">
                                {u.full_name || 'No name'}
                              </TableCell>
                              <TableCell className="text-slate-600">{u.email}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={u.role === 'admin' ? "default" : "secondary"}
                                  className={u.role === 'admin' ? "bg-amber-100 text-amber-700" : "bg-slate-100"}
                                >
                                  {u.role}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {u.role === 'admin' ? (
                                  <span className="text-slate-400 text-sm">N/A</span>
                                ) : u.is_club_leader ? (
                                  <Badge className="bg-green-100 text-green-700 flex items-center gap-1 w-fit">
                                    <CheckCircle className="w-3 h-3" />
                                    Approved
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="bg-slate-100 text-slate-500 flex items-center gap-1 w-fit">
                                    <XCircle className="w-3 h-3" />
                                    Not Approved
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {userClub ? (
                                  <Link 
                                    to={createPageUrl(`ClubProfile?id=${userClub.id}`)}
                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                                  >
                                    {userClub.name}
                                    <LinkIcon className="w-3 h-3" />
                                  </Link>
                                ) : (
                                  <span className="text-slate-400">None</span>
                                )}
                              </TableCell>
                              <TableCell className="text-slate-500 text-sm">
                                {format(new Date(u.created_date), 'MMM d, yyyy')}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center justify-end gap-2">
                                  {u.role !== 'admin' && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleClubLeaderMutation.mutate({ 
                                        userId: u.id, 
                                        isClubLeader: u.is_club_leader 
                                      })}
                                      className={u.is_club_leader ? "text-red-600 hover:text-red-700 hover:bg-red-50" : "text-green-600 hover:text-green-700 hover:bg-green-50"}
                                    >
                                      {u.is_club_leader ? (
                                        <>
                                          <XCircle className="w-4 h-4 mr-1" />
                                          Revoke
                                        </>
                                      ) : (
                                        <>
                                          <CheckCircle className="w-4 h-4 mr-1" />
                                          Approve
                                        </>
                                      )}
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!clubToDelete} onOpenChange={() => setClubToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Club</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{clubToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(clubToDelete?.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
