import { Badge } from '@/components/ui/badge';
import VideoCard from './VideoCard';

interface Video {
  id: number;
  title: string;
  channel: string;
  display_name: string;
  views: string;
  time: string;
  duration: string;
  thumbnail: string;
  verified: boolean;
  like_count: number;
  is_live: boolean;
  avatar_url?: string;
}

interface VideoGridProps {
  title?: string;
  videos: Video[];
  gridSize: number;
  isLive?: boolean;
  onVideoClick: (videoId: number) => void;
}

export default function VideoGrid({ title, videos, gridSize, isLive, onVideoClick }: VideoGridProps) {
  if (videos.length === 0) return null;

  const gridClass = 
    gridSize === 2 ? 'grid-cols-1 sm:grid-cols-2' :
    gridSize === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
    gridSize === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
    gridSize === 5 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5' :
    'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6';

  return (
    <div className={title ? 'space-y-4' : ''}>
      {title && (
        <div className="flex items-center gap-3">
          {isLive && (
            <Badge className="bg-destructive text-white">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2" />
              LIVE
            </Badge>
          )}
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
      )}
      <div className={`grid gap-6 ${gridClass}`}>
        {videos.map((video) => (
          <VideoCard 
            key={video.id} 
            video={video} 
            onClick={() => onVideoClick(video.id)} 
          />
        ))}
      </div>
    </div>
  );
}
