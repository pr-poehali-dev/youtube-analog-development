import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface CreateVideoModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateVideoModal({ open, onClose }: CreateVideoModalProps) {
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('30');
  const [style, setStyle] = useState('realistic');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      onClose();
    }, 3000);
  };

  const styles = [
    { id: 'realistic', name: 'Реалистичный', icon: 'Camera' },
    { id: 'anime', name: 'Аниме', icon: 'Sparkles' },
    { id: 'cartoon', name: 'Мультфильм', icon: 'Smile' },
    { id: '3d', name: '3D', icon: 'Box' }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
            Создать видео с помощью ИИ
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="generate">Генерация видео</TabsTrigger>
            <TabsTrigger value="edit">Редактирование</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prompt">Опишите ваше видео</Label>
              <Textarea
                id="prompt"
                placeholder="Например: Закат на океанском берегу, волны разбиваются о скалы, чайки летают в небе..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] bg-muted/50 border-muted focus:border-primary resize-none"
              />
              <p className="text-xs text-muted-foreground">
                💡 Будьте максимально детальны в описании для лучшего результата
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Название видео</Label>
              <Input
                id="title"
                placeholder="Красивый закат"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-muted/50 border-muted focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Длительность (сек)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="5"
                  max="60"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="bg-muted/50 border-muted focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label>Качество</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="border-muted">720p</Button>
                  <Button variant="outline" className="border-primary bg-primary/10">1080p</Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Стиль видео</Label>
              <div className="grid grid-cols-4 gap-3">
                {styles.map((s) => (
                  <Button
                    key={s.id}
                    variant="outline"
                    onClick={() => setStyle(s.id)}
                    className={`flex flex-col gap-2 h-auto py-4 ${
                      style === s.id ? 'border-primary bg-primary/10' : 'border-muted'
                    }`}
                  >
                    <Icon name={s.icon as any} size={24} />
                    <span className="text-xs">{s.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="border border-muted rounded-lg p-4 bg-muted/30">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={20} className="text-primary mt-0.5" />
                <div className="text-sm space-y-1">
                  <p className="font-semibold">Генерация займет 2-5 минут</p>
                  <p className="text-muted-foreground">
                    Вы получите уведомление когда видео будет готово. Можете продолжить работу в другой вкладке.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={onClose}>
                Отмена
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={!prompt || !title || generating}
                className="gradient-primary text-white"
              >
                {generating ? (
                  <>
                    <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                    Генерация...
                  </>
                ) : (
                  <>
                    <Icon name="Sparkles" size={20} className="mr-2" />
                    Создать видео
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="edit" className="space-y-6">
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Icon name="Wand2" size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold">Редактирование видео с ИИ</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Загрузите существующее видео и используйте ИИ для добавления эффектов, изменения стиля или улучшения качества
              </p>
              <Button className="gradient-primary text-white">
                <Icon name="Upload" size={20} className="mr-2" />
                Загрузить видео
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
