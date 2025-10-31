import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface EmptyStateProps {
  onStudioClick: () => void;
}

export default function EmptyState({ onStudioClick }: EmptyStateProps) {
  return (
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
        onClick={onStudioClick}
      >
        <Icon name="Video" size={24} className="mr-2" />
        Открыть студию
      </Button>
    </div>
  );
}
