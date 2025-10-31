import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

export default function Studio() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const [isRecording, setIsRecording] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [screenEnabled, setScreenEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [viewers, setViewers] = useState(0);

  const [streamTitle, setStreamTitle] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  const [streamCategory, setStreamCategory] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording || isLive) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
        if (isLive) {
          setViewers(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isLive]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 }, 
        audio: micEnabled 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraEnabled(true);
      }
    } catch (err) {
      console.error('Ошибка доступа к камере:', err);
      alert('Не удалось получить доступ к камере. Проверьте разрешения браузера.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraEnabled(false);
    }
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { width: 1920, height: 1080 },
        audio: true
      });
      if (screenRef.current) {
        screenRef.current.srcObject = stream;
        setScreenEnabled(true);
      }
    } catch (err) {
      console.error('Ошибка захвата экрана:', err);
      alert('Не удалось захватить экран.');
    }
  };

  const stopScreenShare = () => {
    if (screenRef.current?.srcObject) {
      const stream = screenRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      screenRef.current.srcObject = null;
      setScreenEnabled(false);
    }
  };

  const startRecording = async () => {
    const streams: MediaStream[] = [];
    
    if (screenRef.current?.srcObject) {
      streams.push(screenRef.current.srcObject as MediaStream);
    }
    if (videoRef.current?.srcObject) {
      streams.push(videoRef.current.srcObject as MediaStream);
    }

    if (streams.length === 0) {
      alert('Включите хотя бы один источник (камеру или экран)');
      return;
    }

    const combinedStream = new MediaStream();
    streams.forEach(stream => {
      stream.getTracks().forEach(track => combinedStream.addTrack(track));
    });

    mediaRecorderRef.current = new MediaRecorder(combinedStream, {
      mimeType: 'video/webm;codecs=vp9'
    });

    recordedChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording-${Date.now()}.webm`;
      a.click();
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
    setRecordingTime(0);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const startLiveStream = () => {
    if (!streamTitle.trim()) {
      alert('Укажите название стрима');
      return;
    }
    if (!screenEnabled && !cameraEnabled) {
      alert('Включите хотя бы один источник (камеру или экран)');
      return;
    }
    setIsLive(true);
    setViewers(1);
    setRecordingTime(0);
  };

  const stopLiveStream = () => {
    setIsLive(false);
    setViewers(0);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <Icon name="ArrowLeft" size={24} />
              </Button>
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <Icon name="Video" size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                Студия
              </h1>
            </div>
            
            {(isRecording || isLive) && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-destructive/20 rounded-full">
                  <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                  <span className="font-mono font-semibold">{formatTime(recordingTime)}</span>
                </div>
                {isLive && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full">
                    <Icon name="Users" size={16} />
                    <span className="font-semibold">{viewers}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6 bg-card">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                {screenEnabled && (
                  <video
                    ref={screenRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                )}
                {cameraEnabled && (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`${screenEnabled ? 'absolute bottom-4 right-4 w-64 h-36' : 'w-full h-full'} rounded-lg border-2 border-primary object-cover`}
                  />
                )}
                {!screenEnabled && !cameraEnabled && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Icon name="VideoOff" size={48} className="mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground">Включите камеру или захват экрана</p>
                    </div>
                  </div>
                )}
                
                {isLive && (
                  <Badge className="absolute top-4 left-4 bg-destructive text-white">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2" />
                    LIVE
                  </Badge>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  variant={cameraEnabled ? 'default' : 'outline'}
                  onClick={cameraEnabled ? stopCamera : startCamera}
                  disabled={isRecording || isLive}
                  className={cameraEnabled ? 'bg-primary' : ''}
                >
                  <Icon name={cameraEnabled ? 'Video' : 'VideoOff'} size={20} className="mr-2" />
                  Камера
                </Button>

                <Button
                  variant={screenEnabled ? 'default' : 'outline'}
                  onClick={screenEnabled ? stopScreenShare : startScreenShare}
                  disabled={isRecording || isLive}
                  className={screenEnabled ? 'bg-primary' : ''}
                >
                  <Icon name={screenEnabled ? 'Monitor' : 'MonitorOff'} size={20} className="mr-2" />
                  Экран
                </Button>

                <Button
                  variant={micEnabled ? 'default' : 'outline'}
                  onClick={() => setMicEnabled(!micEnabled)}
                  disabled={isRecording || isLive}
                  className={micEnabled ? 'bg-primary' : ''}
                >
                  <Icon name={micEnabled ? 'Mic' : 'MicOff'} size={20} className="mr-2" />
                  Микрофон
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-card">
              <Tabs defaultValue="record">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="record">Запись</TabsTrigger>
                  <TabsTrigger value="stream">Стрим</TabsTrigger>
                </TabsList>

                <TabsContent value="record" className="space-y-4">
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      className="w-full gradient-primary text-white h-14 text-lg"
                      disabled={isLive}
                    >
                      <Icon name="Circle" size={24} className="mr-2" />
                      Начать запись
                    </Button>
                  ) : (
                    <Button
                      onClick={stopRecording}
                      variant="destructive"
                      className="w-full h-14 text-lg"
                    >
                      <Icon name="Square" size={24} className="mr-2" />
                      Остановить запись
                    </Button>
                  )}
                </TabsContent>

                <TabsContent value="stream" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="stream-title">Название стрима</Label>
                      <Input
                        id="stream-title"
                        value={streamTitle}
                        onChange={(e) => setStreamTitle(e.target.value)}
                        placeholder="Играю в игры / Изучаю программирование"
                        disabled={isLive}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="stream-category">Категория</Label>
                      <Input
                        id="stream-category"
                        value={streamCategory}
                        onChange={(e) => setStreamCategory(e.target.value)}
                        placeholder="Игры, Программирование, Музыка..."
                        disabled={isLive}
                        className="mt-2"
                      />
                    </div>

                    {!isLive ? (
                      <Button
                        onClick={startLiveStream}
                        className="w-full gradient-primary text-white h-14 text-lg"
                        disabled={isRecording}
                      >
                        <Icon name="Radio" size={24} className="mr-2" />
                        Начать трансляцию
                      </Button>
                    ) : (
                      <Button
                        onClick={stopLiveStream}
                        variant="destructive"
                        className="w-full h-14 text-lg"
                      >
                        <Icon name="Square" size={24} className="mr-2" />
                        Завершить трансляцию
                      </Button>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-6 bg-card">
              <h3 className="font-semibold text-lg mb-4">Ваш уровень</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">12</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Стример</span>
                      <span className="text-sm text-muted-foreground">1240 / 2000 XP</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full gradient-primary" style={{ width: '62%' }} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">Достижения</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: 'Trophy', name: 'Первый стрим', unlocked: true },
                      { icon: 'Users', name: '100 зрителей', unlocked: true },
                      { icon: 'Clock', name: '10 часов', unlocked: false },
                      { icon: 'Star', name: 'VIP статус', unlocked: false },
                      { icon: 'Heart', name: '1000 лайков', unlocked: false },
                      { icon: 'Zap', name: 'Стример года', unlocked: false }
                    ].map((achievement, i) => (
                      <div
                        key={i}
                        className={`aspect-square rounded-lg flex items-center justify-center ${
                          achievement.unlocked
                            ? 'gradient-primary'
                            : 'bg-muted'
                        }`}
                        title={achievement.name}
                      >
                        <Icon
                          name={achievement.icon as any}
                          size={24}
                          className={achievement.unlocked ? 'text-white' : 'text-muted-foreground'}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card">
              <h3 className="font-semibold text-lg mb-4">Статистика</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Всего стримов</span>
                  <span className="font-semibold">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Часов в эфире</span>
                  <span className="font-semibold">87.5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Подписчики</span>
                  <span className="font-semibold">1,240</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Средний онлайн</span>
                  <span className="font-semibold">142</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
