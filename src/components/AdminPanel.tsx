import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
}

interface Video {
  id: string;
  title: string;
  channel: string;
  views: string;
  time: string;
  thumbnail: string;
}

const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Как создать современный сайт за 10 минут',
    channel: 'WebDev Pro',
    views: '1.2М',
    time: '2 дня назад',
    thumbnail: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: '2',
    title: 'React в 2024: Полный гайд для начинающих',
    channel: 'Код Мастер',
    views: '850К',
    time: '1 неделю назад',
    thumbnail: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: '3',
    title: 'Топ 10 фишек CSS которые вы не знали',
    channel: 'Frontend Magic',
    views: '2.1М',
    time: '3 дня назад',
    thumbnail: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  }
];

export default function AdminPanel({ open, onClose }: AdminPanelProps) {
  const [secretCode, setSecretCode] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [videos, setVideos] = useState<Video[]>(mockVideos);

  const handleCodeSubmit = () => {
    if (secretCode === '/admin777') {
      setIsAdmin(true);
      setSecretCode('');
    } else {
      alert('Неверный код доступа!');
    }
  };

  const handleDeleteVideo = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить это видео?')) {
      setVideos(videos.filter(v => v.id !== id));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-primary bg-clip-text text-transparent flex items-center gap-2">
            <Icon name="Shield" size={28} />
            Секретная панель
          </DialogTitle>
        </DialogHeader>

        {!isAdmin ? (
          <div className="py-12 space-y-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Icon name="Lock" size={40} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold">Требуется авторизация</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Введите секретный код для доступа к панели администратора
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-4">
              <Input
                type="password"
                placeholder="Введите секретный код..."
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCodeSubmit()}
                className="text-center bg-muted/50 border-muted focus:border-primary"
              />
              <Button
                onClick={handleCodeSubmit}
                className="w-full gradient-primary text-white"
                disabled={!secretCode}
              >
                <Icon name="Unlock" size={20} className="mr-2" />
                Войти
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                💡 Подсказка: код начинается с "/"
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name="ShieldCheck" size={24} className="text-green-500" />
                <div>
                  <p className="font-semibold">Вы вошли как администратор</p>
                  <p className="text-sm text-muted-foreground">Доступны все функции управления</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAdmin(false)}
                className="text-muted-foreground"
              >
                Выйти
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Управление видео</h3>
                <span className="text-sm text-muted-foreground">{videos.length} видео</span>
              </div>

              <div className="space-y-2">
                {videos.map((video) => (
                  <Card key={video.id} className="p-4 bg-card border-muted hover:border-destructive transition-colors">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-32 h-20 rounded-lg flex-shrink-0"
                        style={{ background: video.thumbnail }}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-1 mb-1">
                          {video.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{video.channel}</span>
                          <span>•</span>
                          <span>{video.views} просмотров</span>
                          <span>•</span>
                          <span>{video.time}</span>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteVideo(video.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Icon name="Trash2" size={18} className="mr-2" />
                        Удалить
                      </Button>
                    </div>
                  </Card>
                ))}

                {videos.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="Inbox" size={48} className="mx-auto mb-3 opacity-50" />
                    <p>Все видео удалены</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
                <div className="flex items-center gap-3">
                  <Icon name="Video" size={24} className="text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{videos.length}</p>
                    <p className="text-xs text-muted-foreground">Всего видео</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
                <div className="flex items-center gap-3">
                  <Icon name="Users" size={24} className="text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">12.5K</p>
                    <p className="text-xs text-muted-foreground">Пользователей</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20">
                <div className="flex items-center gap-3">
                  <Icon name="Eye" size={24} className="text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">1.2M</p>
                    <p className="text-xs text-muted-foreground">Просмотров</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
