'use client';

import { MapPin, Users, Calendar, BarChart3, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface ClassCardProps {
  classData: {
    id: string;
    name: string;
    code: string;
    location: {
      latitude: number;
      longitude: number;
      radius: number;
      address: string;
    };
    studentCount: number;
  };
  onViewReport: () => void;
}

export function ClassCard({ classData, onViewReport }: ClassCardProps) {
  const handleCopyCode = () => {
    navigator.clipboard.writeText(classData.code);
    toast.success('Class code copied to clipboard');
  };

  return (
    <div className="bg-white dark:bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-primary/30 transition-all">
      <div className="mb-4">
        <h3 className="text-xl mb-2">{classData.name}</h3>
        <button
          onClick={handleCopyCode}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 text-primary rounded-lg text-sm hover:bg-primary/10 transition-colors border border-primary/20"
        >
          <span>{classData.code}</span>
          <Copy className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3 mb-5">
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <span className="text-muted-foreground">{classData.location.address}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">{classData.studentCount} students</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">{classData.location.radius}m radius</span>
        </div>
      </div>

      <button
        onClick={onViewReport}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/5 text-primary rounded-lg hover:bg-primary hover:text-white border border-primary/20 transition-all"
      >
        <BarChart3 className="w-4 h-4" />
        View Report
      </button>
    </div>
  );
}
