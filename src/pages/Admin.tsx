import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';

const API_URL = 'https://functions.poehali.dev/18a29ac1-33e9-4589-bad5-77fc1d3286a7';

interface User {
  id: number;
  username: string;
  display_name: string;
  email: string;
  subscriber_count: number;
  is_verified: boolean;
}

interface Video {
  stream_id: number;
  title: string;
  user_id: number;
  view_count: number;
  like_count: number;
}

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const loadData = async () => {
    try {
      const [usersRes, videosRes] = await Promise.all([
        fetch(`${API_URL}?action=get_users`),
        fetch(`${API_URL}?action=get_videos`)
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }

      if (videosRes.ok) {
        const videosData = await videosRes.json();
        setVideos(videosData.videos || []);
      }
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteUser = async (userId: number) => {
    if (!confirm('Удалить этого пользователя?')) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?action=delete_user&user_id=${userId}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Пользователь удален');
        setMessageType('success');
        loadData();
      } else {
        setMessage(data.error || 'Ошибка удаления');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Ошибка соединения');
      setMessageType('error');
    }
    setLoading(false);
  };

  const deleteVideo = async (videoId: number) => {
    if (!confirm('Удалить это видео?')) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?action=delete_video&video_id=${videoId}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Видео удалено');
        setMessageType('success');
        loadData();
      } else {
        setMessage(data.error || 'Ошибка удаления');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Ошибка соединения');
      setMessageType('error');
    }
    setLoading(false);
  };

  const clearAllUsers = async () => {
    if (!confirm('ВНИМАНИЕ! Удалить всех пользователей? Это действие необратимо!')) return;
    if (!confirm('Вы уверены? Все пользователи будут удалены навсегда!')) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?action=clear_users`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`Удалено пользователей: ${data.deleted_count}`);
        setMessageType('success');
        loadData();
      } else {
        setMessage(data.error || 'Ошибка очистки');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Ошибка соединения');
      setMessageType('error');
    }
    setLoading(false);
  };

  const clearAllVideos = async () => {
    if (!confirm('ВНИМАНИЕ! Удалить все видео? Это действие необратимо!')) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?action=clear_videos`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`Удалено видео: ${data.deleted_count}`);
        setMessageType('success');
        loadData();
      } else {
        setMessage(data.error || 'Ошибка очистки');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Ошибка соединения');
      setMessageType('error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
              Админ-панель
            </h1>
            <p className="text-muted-foreground mt-1">Управление пользователями и контентом</p>
          </div>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            <Icon name="Home" size={20} className="mr-2" />
            На главную
          </Button>
        </div>

        {message && (
          <Alert className={messageType === 'error' ? 'border-destructive' : 'border-green-500'}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Пользователи ({users.length})</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={clearAllUsers}
                  disabled={loading || users.length === 0}
                >
                  <Icon name="Trash2" size={16} className="mr-2" />
                  Очистить всех
                </Button>
              </CardTitle>
              <CardDescription>Управление аккаунтами пользователей</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {users.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Нет пользователей</p>
                ) : (
                  users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{user.display_name}</p>
                          {user.is_verified && (
                            <Icon name="BadgeCheck" size={16} className="text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {user.subscriber_count} подписчиков
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteUser(user.id)}
                        disabled={loading}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Icon name="Trash2" size={18} />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Видео ({videos.length})</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={clearAllVideos}
                  disabled={loading || videos.length === 0}
                >
                  <Icon name="Trash2" size={16} className="mr-2" />
                  Очистить все
                </Button>
              </CardTitle>
              <CardDescription>Управление видеоконтентом</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {videos.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Нет видео</p>
                ) : (
                  videos.map((video) => (
                    <div
                      key={video.stream_id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{video.title}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Icon name="Eye" size={14} />
                            {video.view_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="ThumbsUp" size={14} />
                            {video.like_count}
                          </span>
                          <span>User ID: {video.user_id}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteVideo(video.stream_id)}
                        disabled={loading}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Icon name="Trash2" size={18} />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
