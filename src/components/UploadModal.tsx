import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
}

export default function UploadModal({ open, onClose }: UploadModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideo(file);
    }
  };

  const handleSubmit = () => {
    console.log({ title, description, thumbnail, video });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
            Загрузить видео
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="video">Видео файл</Label>
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <input
                type="file"
                id="video"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
              <label htmlFor="video" className="cursor-pointer">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center">
                    <Icon name="Upload" size={32} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">
                      {video ? video.name : 'Выберите видео для загрузки'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      MP4, MOV, AVI до 500MB
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Обложка видео</Label>
            <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
              <input
                type="file"
                id="thumbnail"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="hidden"
              />
              <label htmlFor="thumbnail" className="cursor-pointer">
                {thumbnail ? (
                  <div className="relative aspect-video overflow-hidden rounded-lg">
                    <img src={thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Icon name="Upload" size={32} className="text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                      <Icon name="Image" size={24} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Загрузите обложку</p>
                      <p className="text-sm text-muted-foreground">
                        JPG, PNG до 2MB (рекомендуется 1280x720)
                      </p>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Название</Label>
            <Input
              id="title"
              placeholder="Введите название видео"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-muted/50 border-muted focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              placeholder="Расскажите зрителям о вашем видео"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] bg-muted/50 border-muted focus:border-primary resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={onClose}>
              Отмена
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!title || !video}
              className="gradient-primary text-white"
            >
              <Icon name="Upload" size={20} className="mr-2" />
              Опубликовать
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
