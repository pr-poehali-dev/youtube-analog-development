import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  users: any[];
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, users }: SidebarProps) {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    display_name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      setCurrentUser(JSON.parse(userString));
    }
  }, []);

  const handleAuth = async () => {
    setError('');
    setLoading(true);

    try {
      const action = isLogin ? 'login' : 'register';
      const response = await fetch(`https://functions.poehali.dev/18a29ac1-33e9-4589-bad5-77fc1d3286a7/?action=${action}`, {
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
      setCurrentUser(data);
      setShowAuthDialog(false);
      setFormData({ username: '', email: '', password: '', display_name: '' });
      window.location.reload();
    } catch (err) {
      setError('Ошибка соединения');
    }
    
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    window.location.reload();
  };
  return (
    <>
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
              {currentUser ? (
                <>
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center gap-3 px-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <img src={currentUser.avatar_url} alt={currentUser.display_name} className="w-full h-full rounded-full" />
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{currentUser.display_name}</p>
                        <p className="text-xs text-muted-foreground truncate">@{currentUser.username}</p>
                      </div>
                    </div>
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
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-3 hover:bg-destructive/10 text-destructive"
                        onClick={handleLogout}
                      >
                        <Icon name="LogOut" size={24} />
                        <span>Выйти</span>
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="pt-4 border-t border-border px-3">
                  <Button
                    className="w-full gradient-primary text-white hover:opacity-90"
                    onClick={() => setShowAuthDialog(true)}
                  >
                    <Icon name="UserPlus" size={20} className="mr-2" />
                    Создать аккаунт
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    Войдите, чтобы ставить лайки, комментировать и подписываться
                  </p>
                </div>
              )}

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