import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ClubForm from '@/components/clubs/ClubForm';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Loader2, 
  Plus, 
  PenSquare, 
  CheckCircle,
  Clock,
  ExternalLink,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';

export default function Portal() {
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setIsLoadingUser(false);
    };
    loadUser();
  }, []);

  const { data: userClub, isLoading: isLoadingClub } = useQuery({
    queryKey: ['userClub', user?.email],
    queryFn: async () => {
      const clubs = await base44.entities.Club.filter({ owner_email: user.email });
      return clubs[0] || null;
    },
    enabled: !!user?.email,
  });

  const canManageClub = user?.role === 'admin' || user?.is_club_leader || !!userClub;

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Club.create({
      ...data,
      owner_email: user.email,
      is_active: true,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['userClub']);
      setShowForm(false);
      setSuccessMessage('Club profile created successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Club.update(userClub.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['userClub']);
      setShowForm(false);
      setSuccessMessage('Club profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    },
  });

  if (isLoadingUser || isLoadingClub) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">Club Leader Portal</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            {userClub ? 'Manage Your Club' : 'Create Your Club Profile'}
          </h1>
          <p className="text-slate-500 mt-2">
            {userClub 
              ? 'Update your club information and keep your profile fresh'
              : 'Set up your club profile to be listed in the UCSC Club Directory'}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {successMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {!canManageClub ? (
          // User not approved yet
          <Card className="border-slate-200/60 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldAlert className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                Approval Required
              </h2>
              <p className="text-slate-500 max-w-md mx-auto mb-4">
                To create a club profile, you need to be approved by an administrator.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto text-left">
                <h3 className="font-semibold text-blue-900 text-sm mb-2">How to get approved:</h3>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Contact a UCSC Club Directory administrator</li>
                  <li>Schedule a meeting with your club representative</li>
                  <li>Once approved, you can create your club profile</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        ) : !userClub ? (
          // No club yet - show create option
          showForm ? (
            <div>
              <Button
                variant="ghost"
                onClick={() => setShowForm(false)}
                className="mb-6 text-slate-600"
              >
                ← Cancel
              </Button>
              <ClubForm 
                onSubmit={(data) => createMutation.mutate(data)}
                isLoading={createMutation.isPending}
              />
            </div>
          ) : (
            <Card className="border-slate-200/60 shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Plus className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                  No Club Profile Yet
                </h2>
                <p className="text-slate-500 max-w-md mx-auto mb-8">
                  Create your club's profile to appear in the directory and help students discover your organization.
                </p>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 h-11 px-8"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Club Profile
                </Button>
              </CardContent>
            </Card>
          )
        ) : (
          // Has club - show edit option
          showForm ? (
            <div>
              <Button
                variant="ghost"
                onClick={() => setShowForm(false)}
                className="mb-6 text-slate-600"
              >
                ← Cancel
              </Button>
              <ClubForm 
                club={userClub}
                onSubmit={(data) => updateMutation.mutate(data)}
                isLoading={updateMutation.isPending}
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Club Summary Card */}
              <Card className="border-slate-200/60 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      {userClub.logo_url ? (
                        <img 
                          src={userClub.logo_url}
                          alt={userClub.name}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-amber-500 flex items-center justify-center">
                          <span className="text-white font-bold text-2xl">
                            {userClub.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-xl">{userClub.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4" />
                          Last updated {format(new Date(userClub.updated_date), 'MMM d, yyyy')}
                        </CardDescription>
                      </div>
                    </div>
                    <Link to={createPageUrl(`ClubProfile?id=${userClub.id}`)}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 line-clamp-3">{userClub.description}</p>
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="mt-6 bg-blue-600 hover:bg-blue-700"
                  >
                    <PenSquare className="w-4 h-4 mr-2" />
                    Edit Club Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          )
        )}
      </div>
    </div>
  );
}
