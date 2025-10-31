import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  users: any[];
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, users }: SidebarProps) {
  return (
    <aside className={`fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 z-40 ${
      sidebarOpen ? 'w-64' : 'w-20'
    } overflow-y-auto`}>
      <div className="p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 hover:bg-muted"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Icon name="Menu" size={24} />
          {sidebarOpen && <span>Свернуть</span>}
        </Button>

        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 bg-muted hover:bg-muted/80"
          >
            <Icon name="Home" size={24} />
            {sidebarOpen && <span>Главная</span>}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 hover:bg-muted"
          >
            <Icon name="TrendingUp" size={24} />
            {sidebarOpen && <span>В тренде</span>}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 hover:bg-muted"
          >
            <Icon name="Users" size={24} />
            {sidebarOpen && <span>Подписки</span>}
          </Button>
        </div>

        {sidebarOpen && (
          <>
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

            <div className="pt-4 border-t border-border">
              <h3 className="px-3 mb-2 text-sm font-semibold text-muted-foreground">Популярные каналы</h3>
              <div className="space-y-1">
                {users.slice(0, 8).map((user) => (
                  <Button
                    key={user.id}
                    variant="ghost"
                    className="w-full justify-start gap-3 hover:bg-muted"
                  >
                    <Avatar className="h-6 w-6">
                      <img src={user.avatar_url} alt={user.display_name} className="w-full h-full rounded-full" />
                    </Avatar>
                    <span className="truncate text-sm">{user.display_name}</span>
                    {user.is_verified && (
                      <Icon name="BadgeCheck" size={14} className="text-primary ml-auto" />
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
