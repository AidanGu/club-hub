import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Globe, Instagram, MessageCircle, ArrowRight } from 'lucide-react';

export default function ClubCard({ club }) {
  const hasLinks = club.calendar_link || club.website_link || club.instagram_link || club.discord_link;
  
  return (
    <Link to={createPageUrl(`ClubProfile?id=${club.id}`)}>
      <Card className="group h-full bg-white border border-slate-200/60 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {club.logo_url ? (
              <img 
                src={club.logo_url} 
                alt={club.name}
                className="w-14 h-14 rounded-xl object-cover flex-shrink-0 ring-1 ring-slate-100"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-amber-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">
                  {club.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-slate-900 text-lg group-hover:text-blue-600 transition-colors truncate">
                  {club.name}
                </h3>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
              </div>
              {club.category && (
                <Badge variant="secondary" className="mt-1.5 bg-slate-100 text-slate-600 font-medium text-xs">
                  {club.category}
                </Badge>
              )}
            </div>
          </div>
          
          <p className="mt-4 text-slate-600 text-sm line-clamp-2 leading-relaxed">
            {club.description}
          </p>
          
          {hasLinks && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
              {club.website_link && (
                <Globe className="w-4 h-4 text-slate-400" />
              )}
              {club.instagram_link && (
                <Instagram className="w-4 h-4 text-slate-400" />
              )}
              {club.discord_link && (
                <MessageCircle className="w-4 h-4 text-slate-400" />
              )}
              {club.calendar_link && (
                <Calendar className="w-4 h-4 text-slate-400" />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
