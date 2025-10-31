import Icon from '@/components/ui/icon';

interface VerifiedBadgeProps {
  subscribers: number;
  size?: number;
}

export default function VerifiedBadge({ subscribers, size = 16 }: VerifiedBadgeProps) {
  if (subscribers < 1000) return null;

  const getBadgeColor = () => {
    if (subscribers >= 1000000) return 'text-yellow-400';
    if (subscribers >= 100000) return 'text-purple-500';
    if (subscribers >= 10000) return 'text-blue-500';
    return 'text-primary';
  };

  const getBadgeTooltip = () => {
    if (subscribers >= 1000000) return 'Бриллиантовый канал (1М+ подписчиков)';
    if (subscribers >= 100000) return 'Золотой канал (100К+ подписчиков)';
    if (subscribers >= 10000) return 'Серебряный канал (10К+ подписчиков)';
    return 'Проверенный канал (1К+ подписчиков)';
  };

  return (
    <div className="relative group">
      <Icon name="BadgeCheck" size={size} className={`${getBadgeColor()} flex-shrink-0`} />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/90 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        {getBadgeTooltip()}
      </div>
    </div>
  );
}
