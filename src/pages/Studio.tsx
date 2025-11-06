import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';
import { toast } from '@/components/ui/use-toast';

const UPLOAD_API = 'https://functions.poehali.dev/57bb62f3-e128-42b9-b0de-f6c7593eb90c';
const STREAMING_API = 'https://functions.poehali.dev/af4093ad-3609-4ffe-98f6-0511a52bf036';

export default function Studio() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploading, setUploading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoPreview, setVideoPreview] = useState<string>('');
  
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  const [streamKey, setStreamKey] = useState('');
  const [streamCreated, setStreamCreated] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      if (!videoTitle) {
        setVideoTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    } else {
      alert('Пожалуйста, выберите видеофайл');
    }
  };

  const uploadVideo = async () => {
    if (!videoFile || !videoTitle.trim() || !user) {
      alert('Заполните все поля и войдите в систему');
      return;
    }

    setUploading(true);
    
    try {
      const response = await fetch(UPLOAD_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id.toString()
        },
        body: JSON.stringify({
          title: videoTitle,
          description: videoDescription,
          video_url: videoPreview,
          thumbnail_url: videoPreview,
          duration: 0
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Видео загружено на платформу'
        });
        
        const url = `${window.location.origin}/watch?v=${data.video_id}`;
        setShareUrl(url);
        
        setTimeout(() => navigate(`/watch?v=${data.video_id}`), 2000);
      } else {
        alert(`Ошибка: ${data.error}`);
      }
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      alert('Не удалось загрузить видео');
    } finally {
      setUploading(false);
    }
  };

  const createStream = async () => {
    if (!streamTitle.trim() || !user) {
      alert('Укажите название стрима и войдите в систему');
      return;
    }

    try {
      const response = await fetch(`${STREAMING_API}?action=create_stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id.toString()
        },
        body: JSON.stringify({
          title: streamTitle,
          description: streamDescription
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setStreamKey(data.stream_key);
        setStreamCreated(true);
        setShareUrl(`${window.location.origin}${data.watch_url}`);
        
        toast({
          title: 'Стрим создан!',
          description: 'Используйте stream key для подключения'
        });
      } else {
        alert(`Ошибка: ${data.error}`);
      }
    } catch (err) {
      console.error('Ошибка создания стрима:', err);
      alert('Не удалось создать стрим');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Скопировано!',
      description: 'Ссылка скопирована в буфер обмена'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <Icon name="ArrowLeft" size={24} />
            </Button>
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Icon name="Video" size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              Студия создателя
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">
              <Icon name="Upload" size={18} className="mr-2" />
              Загрузить видео
            </TabsTrigger>
            <TabsTrigger value="stream">
              <Icon name="Radio" size={18} className="mr-2" />
              Создать стрим
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Загрузить видео</h2>
                  <p className="text-muted-foreground">Поделитесь своим видео с миром</p>
                </div>

                {videoPreview ? (
                  <div className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <video src={videoPreview} controls className="w-full h-full" />
                    </div>
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                      <Icon name="RefreshCw" size={18} className="mr-2" />
                      Выбрать другое видео
                    </Button>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-video border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors bg-muted/30"
                  >
                    <div className="text-center space-y-3">
                      <Icon name="Upload" size={48} className="mx-auto text-muted-foreground" />
                      <div>
                        <p className="font-medium">Нажмите для выбора видео</p>
                        <p className="text-sm text-muted-foreground">MP4, WebM, MOV до 500MB</p>
                      </div>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoSelect}
                  className="hidden"
                />

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="video-title">Название</Label>
                    <Input
                      id="video-title"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="Как назовем видео?"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="video-desc">Описание</Label>
                    <Textarea
                      id="video-desc"
                      value={videoDescription}
                      onChange={(e) => setVideoDescription(e.target.value)}
                      placeholder="Расскажите о чем видео..."
                      className="mt-2 min-h-32"
                    />
                  </div>
                </div>

                {shareUrl && (
                  <Alert>
                    <Icon name="Link" size={18} />
                    <AlertDescription className="flex items-center justify-between">
                      <span className="text-sm truncate mr-2">{shareUrl}</span>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(shareUrl)}>
                        <Icon name="Copy" size={14} className="mr-1" />
                        Копировать
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  onClick={uploadVideo} 
                  disabled={!videoFile || !videoTitle || uploading}
                  className="w-full gradient-primary text-white"
                >
                  {uploading ? (
                    <>
                      <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                      Загрузка...
                    </>
                  ) : (
                    <>
                      <Icon name="Upload" size={18} className="mr-2" />
                      Опубликовать видео
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="stream" className="mt-6">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Создать стрим</h2>
                  <p className="text-muted-foreground">Транслируйте в прямом эфире</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="stream-title">Название стрима</Label>
                    <Input
                      id="stream-title"
                      value={streamTitle}
                      onChange={(e) => setStreamTitle(e.target.value)}
                      placeholder="О чем будет стрим?"
                      className="mt-2"
                      disabled={streamCreated}
                    />
                  </div>

                  <div>
                    <Label htmlFor="stream-desc">Описание</Label>
                    <Textarea
                      id="stream-desc"
                      value={streamDescription}
                      onChange={(e) => setStreamDescription(e.target.value)}
                      placeholder="Подробности о стриме..."
                      className="mt-2 min-h-32"
                      disabled={streamCreated}
                    />
                  </div>
                </div>

                {streamCreated && streamKey && (
                  <div className="space-y-4">
                    <Alert>
                      <Icon name="Key" size={18} />
                      <AlertDescription>
                        <div className="space-y-2">
                          <p className="font-medium">Stream Key (не показывайте никому!):</p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 p-2 bg-muted rounded text-sm truncate">{streamKey}</code>
                            <Button size="sm" variant="outline" onClick={() => copyToClipboard(streamKey)}>
                              <Icon name="Copy" size={14} />
                            </Button>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>

                    <Alert>
                      <Icon name="Link" size={18} />
                      <AlertDescription>
                        <div className="space-y-2">
                          <p className="font-medium">Ссылка для зрителей:</p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 p-2 bg-muted rounded text-sm truncate">{shareUrl}</code>
                            <Button size="sm" variant="outline" onClick={() => copyToClipboard(shareUrl)}>
                              <Icon name="Copy" size={14} />
                            </Button>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>

                    <div className="p-4 bg-muted rounded-lg space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Icon name="Info" size={18} />
                        Инструкция для OBS Studio
                      </h3>
                      <ol className="text-sm space-y-2 ml-6 list-decimal text-muted-foreground">
                        <li>Откройте OBS Studio</li>
                        <li>Настройки → Поток</li>
                        <li>Сервер: <code className="text-xs bg-background px-1 py-0.5 rounded">rtmp://stream.example.com/live</code></li>
                        <li>Ключ потока: используйте ваш Stream Key</li>
                        <li>Нажмите "Начать трансляцию"</li>
                      </ol>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={createStream}
                  disabled={!streamTitle || streamCreated}
                  className="w-full gradient-primary text-white"
                >
                  <Icon name="Radio" size={18} className="mr-2" />
                  {streamCreated ? 'Стрим создан' : 'Создать стрим'}
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
