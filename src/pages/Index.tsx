import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface Video {
  id: string;
  title: string;
  channel: string;
  views: string;
  time: string;
  duration: string;
  thumbnail: string;
  verified: boolean;
}

const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Как создать современный сайт за 10 минут',
    channel: 'WebDev Pro',
    views: '1.2М',
    time: '2 дня назад',
    duration: '12:34',
    thumbnail: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    verified: true
  },
  {
    id: '2',
    title: 'React в 2024: Полный гайд для начинающих',
    channel: 'Код Мастер',
    views: '850К',
    time: '1 неделю назад',
    duration: '45:12',
    thumbnail: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    verified: true
  },
  {
    id: '3',
    title: 'Топ 10 фишек CSS которые вы не знали',
    channel: 'Frontend Magic',
    views: '2.1М',
    time: '3 дня назад',
    duration: '18:27',
    thumbnail: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    verified: true
  },
  {
    id: '4',
    title: 'Создание игры на TypeScript с нуля',
    channel: 'GameDev School',
    views: '567К',
    time: '5 дней назад',
    duration: '1:23:45',
    thumbnail: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    verified: false
  },
  {
    id: '5',
    title: 'Python для анализа данных: практика',
    channel: 'Data Science Hub',
    views: '1.5М',
    time: '1 день назад',
    duration: '32:18',
    thumbnail: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    verified: true
  },
  {
    id: '6',
    title: 'Дизайн мобильных приложений 2024',
    channel: 'UI/UX Today',
    views: '920К',
    time: '4 дня назад',
    duration: '25:56',
    thumbnail: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    verified: true
  },
  {
    id: '7',
    title: 'Backend разработка: Node.js + Express',
    channel: 'FullStack Guide',
    views: '1.8М',
    time: '2 недели назад',
    duration: '52:30',
    thumbnail: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    verified: true
  },
  {
    id: '8',
    title: 'Секреты продуктивности программиста',
    channel: 'Dev Life',
    views: '3.2М',
    time: '1 неделю назад',
    duration: '15:42',
    thumbnail: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    verified: false
  }
];

const categories = [
  'Все', 'Программирование', 'Дизайн', 'Музыка', 'Игры', 'Образование', 'Технологии', 'Lifestyle'
];

export default function Index() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
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
              <Button variant="ghost" size="icon" className="hover-scale">
                <Icon name="Upload" size={24} />
              </Button>
              <Button variant="ghost" size="icon" className="hover-scale">
                <Icon name="Bell" size={24} />
              </Button>
              <Avatar className="h-10 w-10 cursor-pointer hover-scale">
                <div className="gradient-accent w-full h-full flex items-center justify-center text-white font-bold">
                  А
                </div>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
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

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockVideos.map((video) => (
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
                    <div className="gradient-primary w-full h-full flex items-center justify-center text-white font-bold text-sm">
                      {video.channel.charAt(0)}
                    </div>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <span className="truncate">{video.channel}</span>
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

        <div className="mt-12 p-8 gradient-primary rounded-2xl text-center animate-fade-in">
          <h2 className="text-3xl font-bold text-white mb-4">
            Начни делиться своими видео сегодня
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Присоединяйся к миллионам креаторов и делись своим контентом с миром
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90 font-semibold px-8"
          >
            <Icon name="Upload" size={20} className="mr-2" />
            Загрузить видео
          </Button>
        </div>
      </div>
    </div>
  );
}