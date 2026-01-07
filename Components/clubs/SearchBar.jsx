import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  "All Categories",
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

export default function SearchBar({ searchQuery, setSearchQuery, categoryFilter, setCategoryFilter }) {
  const hasFilters = searchQuery || (categoryFilter && categoryFilter !== 'All Categories');
  
  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('All Categories');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search clubs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11 bg-white border-slate-200 focus:border-blue-300 focus:ring-blue-200"
        />
      </div>
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className="w-full sm:w-52 h-11 bg-white border-slate-200">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map(cat => (
            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasFilters && (
        <Button
          variant="ghost"
          onClick={clearFilters}
          className="h-11 text-slate-500 hover:text-slate-700"
        >
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
