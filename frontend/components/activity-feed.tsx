'use client';

import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface Activity {
  id: string;
  agent: string;
  action: string;
  timestamp: Date;
  project: string;
  duration: string;
  status: 'success' | 'pending' | 'in-progress' | 'error';
}

const statusIcons = {
  success: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  pending: <Clock className="w-4 h-4 text-yellow-500" />,
  'in-progress': <Clock className="w-4 h-4 text-blue-500" />,
  error: <AlertCircle className="w-4 h-4 text-red-500" />,
};

export function ActivityFeed({ activities }: { activities: Activity[] }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold mb-4">Activity Feed</h2>
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
        >
          {statusIcons[activity.status]}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{activity.agent}</span>
              <span className="text-xs text-muted-foreground">
                {activity.project}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {activity.action}
            </p>
            <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
              <span>
                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
              </span>
              <span>•</span>
              <span>{activity.duration}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
