import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Globe, 
  Instagram, 
  MessageCircle, 
  Calendar,
  Mail,
  User,
  ExternalLink,
  Link2,
  Clock,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';

export default function ClubProfile() {
  const urlParams = new URLSearchParams(window.location.search);
  const clubId = urlParams.get('id');

  const { data: club, isLoading } = useQuery({
    queryKey: ['club', clubId],
    queryFn: async () => {
      const clubs = await base44.entities.Club.filter({ id: clubId });
      return clubs[0];
    },
    enabled: !!clubId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900">Club not found</h2>
          <Link to={createPageUrl('Directory')}>
            <Button variant="link" className="mt-2 text-blue-600">
              Back to Directory
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const socialLinks = [
    { icon: Globe, label: 'Website', url: club.website_link },
    { icon: Instagram, label: 'Instagram', url: club.instagram_link },
    { icon: MessageCircle, label: 'Discord', url: club.discord_link },
    { icon: Calendar, label: 'Calendar', url: club.calendar_link },
  ].filter(link => link.url);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link to={createPageUrl('Directory')}>
            <Button variant="ghost" className="text-white hover:bg-white/10 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Directory
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Card */}
      <div className="max-w-4xl mx-auto px-4 -mt-4 pb-12">
        <Card className="border-slate-200/60 shadow-xl shadow-slate-200/50 overflow-hidden">
          <CardContent className="p-0">
            {/* Club Header */}
            <div className="p-8 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row gap-6">
                {club.logo_url ? (
                  <img 
                    src={club.logo_url} 
                    alt={club.name}
                    className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-amber-500 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-3xl">
                      {club.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-slate-900">{club.name}</h1>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    {club.category && (
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                        {club.category}
                      </Badge>
                    )}
                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <Clock className="w-4 h-4" />
                      Updated {format(new Date(club.updated_date), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-8 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">About</h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {club.description}
              </p>
            </div>

            {/* Contact & Links */}
            <div className="p-8 grid md:grid-cols-2 gap-8">
              {/* Contact */}
              <div>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Contact</h2>
                <div className="space-y-4">
                  {club.contact_name && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Contact Person</p>
                        <p className="font-medium text-slate-900">{club.contact_name}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <a 
                        href={`mailto:${club.contact_email}`}
                        className="font-medium text-blue-600 hover:text-blue-700"
                      >
                        {club.contact_email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Links</h2>
                  <div className="space-y-3">
                    {socialLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group"
                      >
                        <link.icon className="w-5 h-5 text-slate-500" />
                        <span className="flex-1 font-medium text-slate-700">{link.label}</span>
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Other Links */}
            {club.other_social_links && (
              <div className="px-8 pb-8">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  Other Links
                </h2>
                <p className="text-slate-600 whitespace-pre-wrap">{club.other_social_links}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
