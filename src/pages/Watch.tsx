import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface Comment {
  id: string;
  author: string;
  text: string;
  likes: number;
  time: string;
  verified: boolean;
}

interface RecommendedVideo {
  id: string;
  title: string;
  channel: string;
  views: string;
  time: string;
  duration: string;
  thumbnail: string;
}

const mockComments: Comment[] = [
  {
    id: '1',
    author: 'Александр Петров',
    text: 'Отличное видео! Очень помогло разобраться в теме. Спасибо за качественный контент! 🔥',
    likes: 234,
    time: '2 дня назад',
    verified: true
  },
  {
    id: '2',
    author: 'Мария Иванова',
    text: 'Можете сделать продолжение этой темы? Было бы интересно узнать больше',
    likes: 89,
    time: '1 день назад',
    verified: false
  },
  {
    id: '3',
    author: 'Дмитрий Сидоров',
    text: 'Топ объяснение, все понятно даже новичку',
    likes: 156,
    time: '3 часа назад',
    verified: false
  }
];

const recommendedVideos: RecommendedVideo[] = [
  {
    id: '2',
    title: 'React в 2024: Полный гайд для начинающих',
    channel: 'Код Мастер',
    views: '850К',
    time: '1 неделю назад',
    duration: '45:12',
    thumbnail: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: '3',
    title: 'Топ 10 фишек CSS которые вы не знали',
    channel: 'Frontend Magic',
    views: '2.1М',
    time: '3 дня назад',
    duration: '18:27',
    thumbnail: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: '4',
    title: 'Создание игры на TypeScript с нуля',
    channel: 'GameDev School',
    views: '567К',
    time: '5 дней назад',
    duration: '1:23:45',
    thumbnail: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  }
];

export default function Watch() {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [comment, setComment] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <aside className={`fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 z-40 ${
        sidebarOpen ? 'w-64' : 'w-0'
      } overflow-y-auto overflow-x-hidden`}>
        <div className="p-4 space-y-2 w-64">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 hover:bg-muted"
              onClick={() => navigate('/')}
            >
              <Icon name="Home" size={24} />
              <span>Главная</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 hover:bg-muted"
            >
              <Icon name="TrendingUp" size={24} />
              <span>В тренде</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 hover:bg-muted"
            >
              <Icon name="Users" size={24} />
              <span>Подписки</span>
            </Button>
          </div>

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
        </div>
      </aside>

      <div className="flex-1">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hover-scale"
              >
                <Icon name="Menu" size={24} />
              </Button>
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center cursor-pointer" onClick={() => navigate('/')}>
                <Icon name="Play" size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent cursor-pointer" onClick={() => navigate('/')}>
                VideoHub
              </h1>
            </div>

            <div className="flex items-center gap-3">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="relative aspect-video bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl overflow-hidden mb-4 animate-fade-in">
              <div className="absolute inset-0 flex items-center justify-center">
                <Button 
                  size="lg"
                  className="w-20 h-20 rounded-full gradient-primary hover:opacity-90 transition-all"
                >
                  <Icon name="Play" size={40} className="text-white" />
                </Button>
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-4 animate-fade-in">
              Как создать современный сайт за 10 минут
            </h1>

            <div className="flex items-center justify-between gap-4 mb-4 animate-fade-in">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <div className="gradient-primary w-full h-full flex items-center justify-center text-white font-bold">
                    W
                  </div>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">WebDev Pro</span>
                    <Icon name="BadgeCheck" size={16} className="text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">1.2M подписчиков</p>
                </div>
                <Button
                  onClick={() => setSubscribed(!subscribed)}
                  className={`ml-4 ${
                    subscribed 
                      ? 'bg-muted text-foreground hover:bg-muted/80' 
                      : 'gradient-primary text-white hover:opacity-90'
                  }`}
                >
                  {subscribed ? 'Вы подписаны' : 'Подписаться'}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-muted rounded-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setLiked(!liked);
                      if (disliked) setDisliked(false);
                    }}
                    className={`rounded-l-full ${liked ? 'text-primary' : ''}`}
                  >
                    <Icon name="ThumbsUp" size={20} className="mr-2" />
                    12K
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setDisliked(!disliked);
                      if (liked) setLiked(false);
                    }}
                    className={`rounded-r-full ${disliked ? 'text-destructive' : ''}`}
                  >
                    <Icon name="ThumbsDown" size={20} />
                  </Button>
                </div>

                <Button variant="ghost" size="sm" className="rounded-full bg-muted hover:bg-muted/80">
                  <Icon name="Share2" size={20} className="mr-2" />
                  Поделиться
                </Button>
              </div>
            </div>

            <Card className="p-4 bg-muted/50 border-none mb-6 animate-fade-in">
              <div className="flex items-center gap-4 text-sm mb-2">
                <span className="font-semibold">1.2М просмотров</span>
                <span className="text-muted-foreground">2 дня назад</span>
              </div>
              <div className={`text-sm ${showDescription ? '' : 'line-clamp-2'}`}>
                В этом видео я покажу как создать современный сайт всего за 10 минут используя последние технологии.
                Разберем React, TypeScript и Tailwind CSS. Подходит для начинающих разработчиков.
                
                {showDescription && (
                  <>
                    <br /><br />
                    📌 Таймкоды:<br />
                    0:00 - Введение<br />
                    1:30 - Настройка проекта<br />
                    3:45 - Создание компонентов<br />
                    7:20 - Стилизация<br />
                    10:15 - Публикация<br />
                    <br />
                    🔗 Полезные ссылки в описании<br />
                    💬 Пишите вопросы в комментариях!
                  </>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDescription(!showDescription)}
                className="mt-2 text-muted-foreground hover:text-foreground"
              >
                {showDescription ? 'Свернуть' : 'Показать еще'}
              </Button>
            </Card>

            <div className="animate-fade-in">
              <h3 className="text-xl font-semibold mb-4">
                {mockComments.length} комментариев
              </h3>

              <div className="flex gap-4 mb-6">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <div className="gradient-accent w-full h-full flex items-center justify-center text-white font-bold">
                    А
                  </div>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Оставьте комментарий..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[80px] bg-muted/50 border-muted focus:border-primary resize-none"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="ghost" size="sm" onClick={() => setComment('')}>
                      Отмена
                    </Button>
                    <Button 
                      size="sm" 
                      disabled={!comment.trim()}
                      className="gradient-primary text-white"
                    >
                      Отправить
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {mockComments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <div className="gradient-primary w-full h-full flex items-center justify-center text-white font-bold text-sm">
                        {comment.author.charAt(0)}
                      </div>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{comment.author}</span>
                        {comment.verified && (
                          <Icon name="BadgeCheck" size={14} className="text-primary" />
                        )}
                        <span className="text-xs text-muted-foreground">{comment.time}</span>
                      </div>
                      <p className="text-sm mb-2">{comment.text}</p>
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <Icon name="ThumbsUp" size={16} className="mr-1" />
                          <span className="text-xs">{comment.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <Icon name="ThumbsDown" size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                          Ответить
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Рекомендации</h3>
            <div className="space-y-4">
              {recommendedVideos.map((video) => (
                <Card
                  key={video.id}
                  className="group overflow-hidden border-muted hover:border-primary transition-all duration-300 cursor-pointer hover-scale animate-fade-in bg-card"
                >
                  <div className="flex gap-3 p-2">
                    <div className="relative w-40 aspect-video flex-shrink-0 overflow-hidden rounded">
                      <div
                        className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                        style={{ background: video.thumbnail }}
                      />
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 backdrop-blur-sm rounded text-xs font-medium text-white">
                        {video.duration}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                        {video.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-1">{video.channel}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>{video.views}</span>
                        <span>•</span>
                        <span>{video.time}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}