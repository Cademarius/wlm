'use client';

import { useEffect, useState } from 'react';
import { Clock, Heart, Sparkles, UserPlus } from 'lucide-react';

interface Activity {
  id: string;
  type: 'user' | 'crush' | 'match';
  user: {
    name: string;
    image?: string;
  };
  action: string;
  time: string;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler des activités récentes (à remplacer par de vraies données)
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'user',
        user: { name: 'Sophie Martin' },
        action: 's\'est inscrit(e)',
        time: 'Il y a 2 minutes',
      },
      {
        id: '2',
        type: 'crush',
        user: { name: 'Lucas Dubois' },
        action: 'a créé un crush',
        time: 'Il y a 5 minutes',
      },
      {
        id: '3',
        type: 'match',
        user: { name: 'Emma Bernard' },
        action: 'a obtenu un match 💕',
        time: 'Il y a 12 minutes',
      },
      {
        id: '4',
        type: 'crush',
        user: { name: 'Thomas Petit' },
        action: 'a créé un crush',
        time: 'Il y a 18 minutes',
      },
      {
        id: '5',
        type: 'user',
        user: { name: 'Marie Laurent' },
        action: 's\'est inscrit(e)',
        time: 'Il y a 25 minutes',
      },
      {
        id: '6',
        type: 'match',
        user: { name: 'Alexandre Simon' },
        action: 'a obtenu un match 💕',
        time: 'Il y a 32 minutes',
      },
    ];

    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 500);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <UserPlus className="w-4 h-4 text-yellow-500" />;
      case 'crush':
        return <Heart className="w-4 h-4 text-yellow-500" />;
      case 'match':
        return <Sparkles className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'user':
        return 'bg-yellow-500/10';
      case 'crush':
        return 'bg-yellow-500/10';
      case 'match':
        return 'bg-yellow-500/10';
      default:
        return 'bg-gray-700';
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-yellow-500/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-100">Activité Récente</h3>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className={`p-2 rounded-lg ${getBgColor(activity.type)}`}>
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-100 truncate">
                  {activity.user.name}
                </p>
                <p className="text-sm text-gray-400">{activity.action}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-700">
        <button className="w-full text-sm font-medium text-yellow-500 hover:text-yellow-400 transition-colors">
          Voir toute l&apos;activité →
        </button>
      </div>
    </div>
  );
}
