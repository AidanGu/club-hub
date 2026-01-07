import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Save, Globe, Instagram, MessageCircle, Calendar, Link2, User, Mail, FileText, Image } from 'lucide-react';

const CATEGORIES = [
  "Academic",
  "Arts & Culture", 
  "Community Service",
  "Gaming & Esports",
  "Health & Wellness",
  "Political & Advocacy",
  "Professional",
  "Recreation & Sports",
  "Religious & Spiritual",
  "Social",
  "Other"
];

export default function ClubForm({ club, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: club?.name || '',
    description: club?.description || '',
    contact_name: club?.contact_name || '',
    contact_email: club?.contact_email || '',
    calendar_link: club?.calendar_link || '',
    discord_link: club?.discord_link || '',
    website_link: club?.website_link || '',
    instagram_link: club?.instagram_link || '',
    other_social_links: club?.other_social_links || '',
    category: club?.category || '',
    logo_url: club?.logo_url || '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="border-slate-200/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Basic Information
          </CardTitle>
          <CardDescription>Essential details about your club</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-700">Club Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., UCSC Robotics Club"
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-slate-700">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-700">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Tell people what your club is about, what you do, and why they should join..."
              rows={5}
              required
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo_url" className="text-slate-700 flex items-center gap-2">
              <Image className="w-4 h-4" />
              Logo URL
            </Label>
            <Input
              id="logo_url"
              value={formData.logo_url}
              onChange={(e) => handleChange('logo_url', e.target.value)}
              placeholder="https://example.com/logo.png"
              className="h-11"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Point of Contact
          </CardTitle>
          <CardDescription>Who should people reach out to?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="contact_name" className="text-slate-700">Contact Name</Label>
              <Input
                id="contact_name"
                value={formData.contact_name}
                onChange={(e) => handleChange('contact_name', e.target.value)}
                placeholder="John Doe"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_email" className="text-slate-700">Contact Email *</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                placeholder="club@ucsc.edu"
                required
                className="h-11"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Link2 className="w-5 h-5 text-blue-600" />
            Links & Social Media
          </CardTitle>
          <CardDescription>Help people find and connect with your club</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="website_link" className="text-slate-700 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Website
              </Label>
              <Input
                id="website_link"
                value={formData.website_link}
                onChange={(e) => handleChange('website_link', e.target.value)}
                placeholder="https://yourclub.com"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram_link" className="text-slate-700 flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                Instagram
              </Label>
              <Input
                id="instagram_link"
                value={formData.instagram_link}
                onChange={(e) => handleChange('instagram_link', e.target.value)}
                placeholder="https://instagram.com/yourclub"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discord_link" className="text-slate-700 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Discord
              </Label>
              <Input
                id="discord_link"
                value={formData.discord_link}
                onChange={(e) => handleChange('discord_link', e.target.value)}
                placeholder="https://discord.gg/yourserver"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="calendar_link" className="text-slate-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Calendar
              </Label>
              <Input
                id="calendar_link"
                value={formData.calendar_link}
                onChange={(e) => handleChange('calendar_link', e.target.value)}
                placeholder="https://calendar.google.com/..."
                className="h-11"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="other_social_links" className="text-slate-700">Other Links</Label>
            <Textarea
              id="other_social_links"
              value={formData.other_social_links}
              onChange={(e) => handleChange('other_social_links', e.target.value)}
              placeholder="Add any other relevant links (one per line)"
              rows={3}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 h-11 px-8"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {club ? 'Save Changes' : 'Create Club'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
