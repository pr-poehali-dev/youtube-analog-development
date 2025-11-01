import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import CategoryFilter from '@/components/CategoryFilter';
import VideoGrid from '@/components/VideoGrid';
import EmptyState from '@/components/EmptyState';

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

const API_URL = 'https://functions.poehali.dev/18a29ac1-33e9-4589-bad5-77fc1d3286a7';

const categories = [
  'Все', 'Программирование', 'Дизайн', 'Музыка', 'Игры', 'Образование', 'Технологии', 'Lifestyle'
];

export default function Index() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [gridSize, setGridSize] = useState(4);
  const [streams, setStreams] = useState<Video[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStreams();
    loadUsers();
  }, [selectedCategory]);

  const loadStreams = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}?action=streams${selectedCategory !== 'Все' ? '&category=' + selectedCategory : ''}`);
      const data = await response.json();
      
      const formattedStreams = data.map((s: any) => ({
        id: s.id,
        title: s.title,
        channel: s.username,
        display_name: s.display_name,
        views: formatViews(s.view_count),
        time: formatTime(s.started_at || s.created_at),
        duration: s.duration ? formatDuration(s.duration) : 'LIVE',
        thumbnail: `https://api.dicebear.com/7.x/shapes/svg?seed=${s.id}`,
        verified: s.is_verified,
        like_count: s.like_count,
        is_live: s.is_live,
        avatar_url: s.avatar_url
      }));
      
      setStreams(formattedStreams);
    } catch (error) {
      console.error('Error loading streams:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch(`${API_URL}?action=users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const formatViews = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}М`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}К`;
    return count.toString();
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} дней назад`;
    return `${Math.floor(diff / 604800)} нед назад`;
  };

  const liveStreamsData = streams.filter(s => s.is_live);
  const videosData = streams.filter(s => !s.is_live);

  const handleStudioClick = () => {
    navigate('/studio');
  };

  const handleVideoClick = (videoId: number) => {
    navigate(`/watch?v=${videoId}`);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        users={users}
      />

      <div className={`flex-1 transition-all duration-300 ${
        sidebarOpen ? 'ml-64' : 'ml-20'
      }`}>
        <Header 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onStudioClick={handleStudioClick}
        />

        <main className="container mx-auto px-4 py-6 space-y-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            gridSize={gridSize}
            setGridSize={setGridSize}
          />

          {loading ? (
            <div className="mt-12 text-center py-12">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : liveStreamsData.length === 0 && videosData.length === 0 ? (
            <EmptyState onStudioClick={handleStudioClick} />
          ) : (
            <>
              <VideoGrid
                title="Прямые трансляции"
                videos={liveStreamsData}
                gridSize={gridSize}
                isLive={true}
                onVideoClick={handleVideoClick}
              />

              <VideoGrid
                title="Записи"
                videos={videosData}
                gridSize={gridSize}
                onVideoClick={handleVideoClick}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}