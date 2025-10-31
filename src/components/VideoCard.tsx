import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

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

interface VideoCardProps {
  video: Video;
  onClick: () => void;
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  return (
    <Card 
      onClick={onClick}
      className="group overflow-hidden border-muted hover:border-primary transition-all duration-300 cursor-pointer hover-scale animate-fade-in bg-card"
    >
      <div className="relative aspect-video overflow-hidden">
        <div 
          className="w-full h-full transition-transform duration-500 group-hover:scale-110"
          style={{ background: video.thumbnail }}
        />
        {video.is_live ? (
          <>
            <Badge className="absolute top-2 left-2 bg-destructive text-white">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1" />
              LIVE
            </Badge>
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-destructive/90 backdrop-blur-sm rounded text-xs font-medium text-white">
              {video.views} зрителей
            </div>
          </>
        ) : (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-xs font-medium text-white">
            {video.duration}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <img src={video.avatar_url} alt={video.display_name} className="w-full h-full rounded-full" />
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {video.title}
            </h3>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <span className="truncate">{video.display_name}</span>
              {video.verified && (
                <Icon name="BadgeCheck" size={14} className="text-primary flex-shrink-0" />
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{video.views} просмотров</span>
              <span>•</span>
              <span>{video.time}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
