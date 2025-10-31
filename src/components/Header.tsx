import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onStudioClick: () => void;
}

export default function Header({ searchQuery, setSearchQuery, onStudioClick }: HeaderProps) {
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Icon name="Play" size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              VideoHub
            </h1>
          </div>

          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Icon 
                name="Search" 
                size={20} 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="text"
                placeholder="Поиск видео..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 h-11 rounded-full border-muted focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button
                  variant="default"
                  className="gradient-primary text-white hover:opacity-90 transition-opacity"
                  onClick={onStudioClick}
                >
                  <Icon name="Video" size={20} className="mr-2" />
                  Создать
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Icon name="Bell" size={24} />
                </Button>
                <Avatar className="h-10 w-10 cursor-pointer">
                  <img src={user.avatar_url} alt={user.display_name} className="w-full h-full rounded-full" />
                </Avatar>
              </>
            ) : (
              <Button
                variant="default"
                className="gradient-primary text-white hover:opacity-90 transition-opacity"
                onClick={() => navigate('/auth')}
              >
                <Icon name="LogIn" size={20} className="mr-2" />
                Войти
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}