import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Slider } from '@/components/ui/slider';
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

const API_URL = 'https://functions.poehali.dev/18a29ac1-33e9-4589-bad5-77fc1d3286a7';

const mockVideos: Video[] = [];

const liveStreams: Video[] = [
  {
    id: '1',
    title: 'Как создать современный сайт за 10 минут',
    channel: 'WebDev Pro',
    views: '1.2М',
    time: '2 дня назад',
    duration: '12:34',
    thumbnail: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    verified: true,
    subscribers: 1500000
  },
  {
    id: '2',
    title: 'React в 2024: Полный гайд для начинающих',
    channel: 'Код Мастер',
    views: '850К',
    time: '1 неделю назад',
    duration: '45:12',
    thumbnail: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    verified: true,
    subscribers: 250000
  },
  {
    id: '3',
    title: 'Топ 10 фишек CSS которые вы не знали',
    channel: 'Frontend Magic',
    views: '2.1М',
    time: '3 дня назад',
    duration: '18:27',
    thumbnail: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    verified: true,
    subscribers: 50000
  },
  {
    id: '4',
    title: 'Создание игры на TypeScript с нуля',
    channel: 'GameDev School',
    views: '567К',
    time: '5 дней назад',
    duration: '1:23:45',
    thumbnail: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    verified: false,
    subscribers: 5000
  },
  {
    id: '5',
    title: 'Python для анализа данных: практика',
    channel: 'Data Science Hub',
    views: '1.5М',
    time: '1 день назад',
    duration: '32:18',
    thumbnail: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    verified: true,
    subscribers: 3000000
  },
  {
    id: '6',
    title: 'Дизайн мобильных приложений 2024',
    channel: 'UI/UX Today',
    views: '920К',
    time: '4 дня назад',
    duration: '25:56',
    thumbnail: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    verified: true,
    subscribers: 15000
  },
  {
    id: '7',
    title: 'Backend разработка: Node.js + Express',
    channel: 'FullStack Guide',
    views: '1.8М',
    time: '2 недели назад',
    duration: '52:30',
    thumbnail: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    verified: true,
    subscribers: 500000
  },
  {
    id: '8',
    title: 'Секреты продуктивности программиста',
    channel: 'Dev Life',
    views: '3.2М',
    time: '1 неделю назад',
    duration: '15:42',
    thumbnail: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    verified: false,
    subscribers: 800
  }
];

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

  return (
    <div className="min-h-screen bg-background flex">
      <aside className={`fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 z-40 ${
        sidebarOpen ? 'w-64' : 'w-20'
      } overflow-y-auto`}>
        <div className="p-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 hover:bg-muted"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Icon name="Menu" size={24} />
            {sidebarOpen && <span>Свернуть</span>}
          </Button>

          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 bg-muted hover:bg-muted/80"
            >
              <Icon name="Home" size={24} />
              {sidebarOpen && <span>Главная</span>}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 hover:bg-muted"
            >
              <Icon name="TrendingUp" size={24} />
              {sidebarOpen && <span>В тренде</span>}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 hover:bg-muted"
            >
              <Icon name="Users" size={24} />
              {sidebarOpen && <span>Подписки</span>}
            </Button>
          </div>

          {sidebarOpen && (
            <>
              <div className="pt-4 border-t border-border">
                <h3 className="px-3 mb-2 text-sm font-semibold text-muted-foreground">Вы</h3>
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-muted">
                    <Icon name="History" size={24} />
                    <span>История</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-muted">
                    <Icon name="Play" size={24} />
                    <span>Ваши видео</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-muted">
                    <Icon name="Clock" size={24} />
                    <span>Смотреть позже</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-muted">
                    <Icon name="ThumbsUp" size={24} />
                    <span>Понравилось</span>
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="px-3 mb-2 text-sm font-semibold text-muted-foreground">Популярные каналы</h3>
                <div className="space-y-1">
                  {users.slice(0, 8).map((user) => (
                    <Button
                      key={user.id}
                      variant="ghost"
                      className="w-full justify-start gap-3 hover:bg-muted"
                    >
                      <Avatar className="h-6 w-6">
                        <img src={user.avatar_url} alt={user.display_name} className="w-full h-full rounded-full" />
                      </Avatar>
                      <span className="truncate text-sm">{user.display_name}</span>
                      {user.is_verified && (
                        <Icon name="BadgeCheck" size={14} className="text-primary ml-auto" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </aside>

      <div className={`flex-1 transition-all duration-300 ${
        sidebarOpen ? 'ml-64' : 'ml-20'
      }`}>
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <Icon name="Play" size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                VideoHub
              </h1>
            </div>

            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Icon 
                  name="Search" 
                  size={20} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type="text"
                  placeholder="Поиск видео..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 h-12 bg-muted/50 border-muted focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="default"
                className="gradient-primary text-white hover-scale gap-2"
                onClick={() => navigate('/studio')}
              >
                <Icon name="Radio" size={20} />
                <span className="hidden sm:inline">Начать стрим</span>
              </Button>
              <Button variant="ghost" size="icon" className="hover-scale">
                <Icon name="Bell" size={24} />
              </Button>
              <Avatar className="h-10 w-10 cursor-pointer hover-scale" onClick={() => setAdminPanelOpen(true)}>
                <div className="gradient-accent w-full h-full flex items-center justify-center text-white font-bold">
                  А
                </div>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide flex-1">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className={`
                whitespace-nowrap transition-all duration-300
                ${selectedCategory === category 
                  ? 'gradient-primary text-white hover:opacity-90' 
                  : 'hover:border-primary'
                }
              `}
            >
              {category}
            </Button>
          ))}
          </div>
          <div className="flex items-center gap-3 ml-4">
            <Icon name="LayoutGrid" size={20} className="text-muted-foreground" />
            <Slider
              value={[gridSize]}
              onValueChange={(value) => setGridSize(value[0])}
              min={2}
              max={6}
              step={1}
              className="w-32"
            />
          </div>
        </div>

        {loading ? (
          <div className="mt-12 text-center py-12">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : liveStreamsData.length === 0 && videosData.length === 0 && (
          <div className="mt-12 text-center space-y-6 py-12">
            <div className="w-24 h-24 gradient-primary rounded-full flex items-center justify-center mx-auto">
              <Icon name="Radio" size={48} className="text-white" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Станьте первым стримером!</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Начните прямую трансляцию с захватом экрана и веб-камерой. Делитесь своими играми, творчеством или обучением.
              </p>
            </div>
            <Button 
              size="lg"
              className="gradient-primary text-white px-8"
              onClick={() => navigate('/studio')}
            >
              <Icon name="Video" size={24} className="mr-2" />
              Открыть студию
            </Button>
          </div>
        )}

        {liveStreamsData.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-destructive text-white">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2" />
                LIVE
              </Badge>
              <h2 className="text-xl font-bold">Прямые трансляции</h2>
            </div>
            <div className={`grid gap-6 ${
              gridSize === 2 ? 'grid-cols-1 sm:grid-cols-2' :
              gridSize === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
              gridSize === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
              gridSize === 5 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5' :
              'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6'
            }`}>
              {liveStreamsData.map((video) => (
                <Card 
              key={video.id}
              onClick={() => navigate('/watch')}
              className="group overflow-hidden border-muted hover:border-primary transition-all duration-300 cursor-pointer hover-scale animate-fade-in bg-card"
            >
              <div className="relative aspect-video overflow-hidden">
                <div 
                  className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                  style={{ background: video.thumbnail }}
                />
                <Badge className="absolute top-2 left-2 bg-destructive text-white">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1" />
                  LIVE
                </Badge>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-destructive/90 backdrop-blur-sm rounded text-xs font-medium text-white">
                  {video.views} зрителей
                </div>
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
              ))}
            </div>
          </div>
        )}

        {videosData.length > 0 && (
          <div className={`mt-8 space-y-4`}>
            <h2 className="text-xl font-bold">Записи</h2>
            <div className={`grid gap-6 ${
              gridSize === 2 ? 'grid-cols-1 sm:grid-cols-2' :
              gridSize === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
              gridSize === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
              gridSize === 5 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5' :
              'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6'
            }`}>
              {videosData.map((video) => (
                <Card 
                  key={video.id}
                  onClick={() => navigate('/watch')}
                  className="group overflow-hidden border-muted hover:border-primary transition-all duration-300 cursor-pointer hover-scale animate-fade-in bg-card"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <div 
                      className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                      style={{ background: video.thumbnail }}
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-xs font-medium text-white">
                      {video.duration}
                    </div>
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
              ))}
            </div>
          </div>
        )}


      </main>
      </div>
    </div>
  );
}