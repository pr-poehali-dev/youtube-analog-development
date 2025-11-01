import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onStudioClick: () => void;
}

const API_URL = 'https://functions.poehali.dev/18a29ac1-33e9-4589-bad5-77fc1d3286a7';

export default function Header({ searchQuery, setSearchQuery, onStudioClick }: HeaderProps) {
  const userString = localStorage.getItem('user');
  const [user, setUser] = useState(userString ? JSON.parse(userString) : null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    display_name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setError('');
    setLoading(true);

    try {
      const action = isLogin ? 'login' : 'register';
      const response = await fetch(`${API_URL}?action=${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Произошла ошибка');
        setLoading(false);
        return;
      }

      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      setShowAuthDialog(false);
      setFormData({ username: '', email: '', password: '', display_name: '' });
      window.location.reload();
    } catch (err) {
      setError('Ошибка соединения');
    }
    
    setLoading(false);
  };
  return (
    <>
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
                  onClick={() => setShowAuthDialog(true)}
                >
                  <Icon name="LogIn" size={20} className="mr-2" />
                  Войти
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isLogin ? 'Вход в аккаунт' : 'Создать аккаунт'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="display_name">Отображаемое имя</Label>
                  <Input
                    id="display_name"
                    placeholder="Ваше имя"
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Имя пользователя</Label>
                  <Input
                    id="username"
                    placeholder="@username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
              </>
            )}

            {isLogin && (
              <div className="space-y-2">
                <Label htmlFor="login-username">Имя пользователя или Email</Label>
                <Input
                  id="login-username"
                  placeholder="username или email"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            )}

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <Button
              className="w-full gradient-primary text-white"
              onClick={handleAuth}
              disabled={loading}
            >
              {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
            </Button>

            <div className="text-center text-sm">
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
              >
                {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}