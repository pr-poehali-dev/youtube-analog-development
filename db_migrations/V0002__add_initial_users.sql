-- Добавление начальных пользователей

INSERT INTO users (username, display_name, email, avatar_url, bio, subscriber_count, is_verified) VALUES
('alex_game', 'Алекс Геймер', 'alex@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', 'Стример игр и обзоров', 125000, true),
('maria_cook', 'Мария Кулинария', 'maria@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria', 'Готовлю вкусные блюда каждый день', 89000, true),
('tech_ivan', 'Иван Технологии', 'ivan@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ivan', 'Обзоры гаджетов и технологий', 210000, true),
('olga_art', 'Ольга Художник', 'olga@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=olga', 'Рисую портреты и пейзажи', 45000, false),
('denis_music', 'Денис Музыка', 'denis@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=denis', 'Музыкант и продюсер', 156000, true),
('anna_fitness', 'Анна Фитнес', 'anna@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=anna', 'Тренировки и здоровый образ жизни', 93000, true),
('sergey_code', 'Сергей Кодер', 'sergey@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sergey', 'Программирование и разработка', 178000, true),
('elena_travel', 'Елена Путешествия', 'elena@example.com', 'https://api.dicebear.com/7.x/avataaars/svg?seed=elena', 'Путешествую по миру', 67000, false);
