import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import VerifiedBadge from '@/components/VerifiedBadge';
import { toast } from '@/components/ui/use-toast';

const API_URL = 'https://functions.poehali.dev/18a29ac1-33e9-4589-bad5-77fc1d3286a7';

export default function Watch() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('v');
  
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [comment, setComment] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (videoId) {
      loadVideo();
    }
  }, [videoId]);

  const loadVideo = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}?action=streams`);
      const data = await response.json();
      const foundVideo = data.find((s: any) => s.id.toString() === videoId);
      setVideo(foundVideo);
    } catch (error) {
      console.error('Error loading video:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      alert('Войдите, чтобы ставить лайки');
      return;
    }
    
    const user = JSON.parse(userString);
    
    try {
      await fetch(`${API_URL}?action=like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          stream_id: parseInt(videoId || '0')
        })
      });
      setLiked(!liked);
      if (disliked) setDisliked(false);
      if (video) {
        setVideo({...video, like_count: video.like_count + (liked ? -1 : 1)});
      }
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Видео не найдено</h2>
          <Button onClick={() => navigate('/')}>Вернуться на главную</Button>
        </div>
      </div>
    );
  }

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
              {video.title}
            </h1>

            <div className="flex items-center justify-between gap-4 mb-4 animate-fade-in flex-wrap">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <img src={video.avatar_url} alt={video.display_name} className="w-full h-full rounded-full" />
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{video.display_name}</h3>
                    {video.is_verified && <VerifiedBadge />}
                  </div>
                  <p className="text-sm text-muted-foreground">{video.subscriber_count} подписчиков</p>
                </div>
                <Button 
                  variant={subscribed ? "outline" : "default"}
                  className={subscribed ? "" : "gradient-primary text-white hover:opacity-90"}
                  onClick={() => setSubscribed(!subscribed)}
                >
                  {subscribed ? "Вы подписаны" : "Подписаться"}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-full bg-muted">
                  <Button 
                    variant="ghost" 
                    className={`rounded-l-full hover-scale ${liked ? 'text-primary' : ''}`}
                    onClick={handleLike}
                  >
                    <Icon name="ThumbsUp" size={20} className={liked ? 'fill-current' : ''} />
                    <span className="ml-2">{video.like_count || 0}</span>
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button 
                    variant="ghost" 
                    className={`rounded-r-full hover-scale ${disliked ? 'text-primary' : ''}`}
                    onClick={() => {
                      setDisliked(!disliked);
                      if (liked) setLiked(false);
                    }}
                  >
                    <Icon name="ThumbsDown" size={20} className={disliked ? 'fill-current' : ''} />
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  className="rounded-full hover-scale gap-2"
                  onClick={() => {
                    const url = window.location.href;
                    navigator.clipboard.writeText(url);
                    toast({
                      title: 'Ссылка скопирована!',
                      description: 'Поделитесь видео с друзьями'
                    });
                  }}
                >
                  <Icon name="Share2" size={20} />
                  <span>Поделиться</span>
                </Button>
              </div>
            </div>

            <Card className="p-4 mb-6 animate-fade-in">
              <div className="flex gap-4 text-sm mb-2">
                <span className="font-semibold">{video.view_count || 0} просмотров</span>
                <span className="text-muted-foreground">
                  {new Date(video.created_at).toLocaleDateString('ru-RU')}
                </span>
              </div>
              {showDescription && (
                <div className="space-y-2 animate-fade-in">
                  <p className="text-sm">{video.description || 'Нет описания'}</p>
                </div>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowDescription(!showDescription)}
                className="mt-2"
              >
                {showDescription ? "Скрыть" : "Показать еще"}
              </Button>
            </Card>

            <div className="animate-fade-in">
              <h2 className="text-xl font-bold mb-4">Комментарии пока недоступны</h2>
              <div className="flex gap-4 mb-6">
                <Avatar className="h-10 w-10">
                  <div className="gradient-primary w-full h-full flex items-center justify-center text-white font-bold">
                    В
                  </div>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Добавьте комментарий..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="ghost" onClick={() => setComment('')}>Отмена</Button>
                    <Button disabled={!comment.trim()}>Отправить</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold mb-4">Рекомендуем</h2>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Рекомендации пока недоступны</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}