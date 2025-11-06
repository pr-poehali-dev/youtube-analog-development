"""
Business: API для работы со стримами, пользователями, подписками и лайками
Args: event - dict с httpMethod, body, queryStringParameters
Returns: HTTP response dict
"""

import json
import os
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    try:
        query_params = event.get('queryStringParameters') or {}
        action = query_params.get('action', '')
        
        # GET /?action=streams - получить все стримы и видео
        if method == 'GET' and action == 'streams':
            conn = get_db_connection()
            cur = conn.cursor(cursor_factory=RealDictCursor)
            
            category = query_params.get('category')
            is_live = query_params.get('is_live')
            
            query = """
                SELECT s.*, u.username, u.display_name, u.avatar_url, u.is_verified, u.subscriber_count
                FROM streams s
                JOIN users u ON s.user_id = u.id
                WHERE 1=1
            """
            
            if category and category != 'Все':
                query += f" AND s.category = '{category}'"
            if is_live == 'true':
                query += " AND s.is_live = true"
            elif is_live == 'false':
                query += " AND s.is_live = false"
                
            query += " ORDER BY s.created_at DESC LIMIT 100"
            
            cur.execute(query)
            streams = cur.fetchall()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps([dict(s) for s in streams], default=str),
                'isBase64Encoded': False
            }
        
        # GET /?action=users - получить всех пользователей
        if method == 'GET' and action == 'users':
            conn = get_db_connection()
            cur = conn.cursor(cursor_factory=RealDictCursor)
            cur.execute("SELECT * FROM users ORDER BY subscriber_count DESC LIMIT 100")
            users = cur.fetchall()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps([dict(u) for u in users], default=str),
                'isBase64Encoded': False
            }
        
        # POST /?action=subscribe - подписаться на канал
        if method == 'POST' and action == 'subscribe':
            body_data = json.loads(event.get('body', '{}'))
            subscriber_id = body_data.get('subscriber_id')
            channel_id = body_data.get('channel_id')
            
            if not subscriber_id or not channel_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'subscriber_id and channel_id required'}),
                    'isBase64Encoded': False
                }
            
            conn = get_db_connection()
            cur = conn.cursor()
            
            cur.execute("""
                INSERT INTO subscriptions (subscriber_id, channel_id)
                VALUES (%s, %s)
                ON CONFLICT (subscriber_id, channel_id) DO NOTHING
            """, (subscriber_id, channel_id))
            
            cur.execute("""
                UPDATE users SET subscriber_count = subscriber_count + 1
                WHERE id = %s
            """, (channel_id,))
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        # POST /?action=like - поставить лайк
        if method == 'POST' and action == 'like':
            body_data = json.loads(event.get('body', '{}'))
            user_id = body_data.get('user_id')
            stream_id = body_data.get('stream_id')
            
            if not user_id or not stream_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'user_id and stream_id required'}),
                    'isBase64Encoded': False
                }
            
            conn = get_db_connection()
            cur = conn.cursor()
            
            cur.execute("""
                INSERT INTO likes (user_id, stream_id)
                VALUES (%s, %s)
                ON CONFLICT (user_id, stream_id) DO NOTHING
            """, (user_id, stream_id))
            
            cur.execute("""
                UPDATE streams SET like_count = like_count + 1
                WHERE id = %s
            """, (stream_id,))
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        # POST /?action=create_stream - создать новый стрим
        if method == 'POST' and action == 'create_stream':
            body_data = json.loads(event.get('body', '{}'))
            
            conn = get_db_connection()
            cur = conn.cursor(cursor_factory=RealDictCursor)
            
            cur.execute("""
                INSERT INTO streams (user_id, title, description, category, is_live, started_at)
                VALUES (%s, %s, %s, %s, %s, CURRENT_TIMESTAMP)
                RETURNING id, title, is_live
            """, (
                body_data.get('user_id'),
                body_data.get('title'),
                body_data.get('description'),
                body_data.get('category'),
                body_data.get('is_live', True)
            ))
            
            stream = cur.fetchone()
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps(dict(stream), default=str),
                'isBase64Encoded': False
            }
        
        # POST /?action=register - регистрация нового пользователя
        if method == 'POST' and action == 'register':
            body_data = json.loads(event.get('body', '{}'))
            
            username = body_data.get('username', '').strip()
            email = body_data.get('email', '').strip()
            password = body_data.get('password', '').strip()
            display_name = body_data.get('display_name', '').strip()
            
            if not all([username, email, password, display_name]):
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Заполните все поля'}),
                    'isBase64Encoded': False
                }
            
            if len(username) < 3:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Имя пользователя должно быть не менее 3 символов'}),
                    'isBase64Encoded': False
                }
            
            if len(password) < 6:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Пароль должен быть не менее 6 символов'}),
                    'isBase64Encoded': False
                }
            
            conn = get_db_connection()
            cur = conn.cursor(cursor_factory=RealDictCursor)
            
            cur.execute("SELECT id FROM users WHERE email = %s", (email,))
            if cur.fetchone():
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Email уже используется'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("SELECT id FROM users WHERE username = %s", (username,))
            if cur.fetchone():
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Имя пользователя уже занято'}),
                    'isBase64Encoded': False
                }
            
            avatar_url = f"https://api.dicebear.com/7.x/avataaars/svg?seed={username}"
            
            cur.execute("""
                INSERT INTO users (username, email, password, display_name, avatar_url, bio, subscriber_count, is_verified)
                VALUES (%s, %s, %s, %s, %s, %s, 0, false)
                RETURNING id, username, email, display_name, avatar_url, is_verified, subscriber_count
            """, (username, email, password, display_name, avatar_url, 'Новый стример'))
            
            user = cur.fetchone()
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps(dict(user), default=str),
                'isBase64Encoded': False
            }
        
        # POST /?action=login - вход пользователя
        if method == 'POST' and action == 'login':
            body_data = json.loads(event.get('body', '{}'))
            
            username = body_data.get('username', '').strip()
            password = body_data.get('password', '').strip()
            
            if not all([username, password]):
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Заполните все поля'}),
                    'isBase64Encoded': False
                }
            
            conn = get_db_connection()
            cur = conn.cursor(cursor_factory=RealDictCursor)
            
            cur.execute("""
                SELECT id, username, email, display_name, avatar_url, is_verified, subscriber_count
                FROM users 
                WHERE (username = %s OR email = %s) AND password = %s
            """, (username, username, password))
            
            user = cur.fetchone()
            cur.close()
            conn.close()
            
            if not user:
                return {
                    'statusCode': 401,
                    'headers': headers,
                    'body': json.dumps({'error': 'Неверные данные для входа'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(dict(user), default=str),
                'isBase64Encoded': False
            }
        
        # GET /?action=get_users - admin: получить всех пользователей
        if method == 'GET' and action == 'get_users':
            conn = get_db_connection()
            cur = conn.cursor(cursor_factory=RealDictCursor)
            cur.execute("SELECT id, username, display_name, email, subscriber_count, is_verified FROM users ORDER BY id ASC")
            users = cur.fetchall()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'users': [dict(u) for u in users]}, default=str),
                'isBase64Encoded': False
            }
        
        # GET /?action=get_videos - admin: получить все видео
        if method == 'GET' and action == 'get_videos':
            conn = get_db_connection()
            cur = conn.cursor(cursor_factory=RealDictCursor)
            cur.execute("SELECT id as stream_id, title, user_id, view_count, like_count FROM streams ORDER BY id ASC")
            videos = cur.fetchall()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'videos': [dict(v) for v in videos]}, default=str),
                'isBase64Encoded': False
            }
        
        # DELETE /?action=delete_user&user_id=X - admin: удалить пользователя
        if method == 'DELETE' and action == 'delete_user':
            user_id = query_params.get('user_id')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'user_id required'}),
                    'isBase64Encoded': False
                }
            
            conn = get_db_connection()
            cur = conn.cursor()
            
            cur.execute("DELETE FROM subscriptions WHERE subscriber_id = %s OR channel_id = %s", (user_id, user_id))
            cur.execute("DELETE FROM likes WHERE user_id = %s", (user_id,))
            cur.execute("DELETE FROM streams WHERE user_id = %s", (user_id,))
            cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        # DELETE /?action=delete_video&video_id=X - admin: удалить видео
        if method == 'DELETE' and action == 'delete_video':
            video_id = query_params.get('video_id')
            
            if not video_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'video_id required'}),
                    'isBase64Encoded': False
                }
            
            conn = get_db_connection()
            cur = conn.cursor()
            
            cur.execute("DELETE FROM likes WHERE stream_id = %s", (video_id,))
            cur.execute("DELETE FROM streams WHERE id = %s", (video_id,))
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        # DELETE /?action=clear_users - admin: удалить всех пользователей
        if method == 'DELETE' and action == 'clear_users':
            conn = get_db_connection()
            cur = conn.cursor()
            
            cur.execute("SELECT COUNT(*) FROM users")
            count = cur.fetchone()[0]
            
            cur.execute("DELETE FROM subscriptions")
            cur.execute("DELETE FROM likes")
            cur.execute("DELETE FROM streams")
            cur.execute("DELETE FROM users")
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'success': True, 'deleted_count': count}),
                'isBase64Encoded': False
            }
        
        # DELETE /?action=clear_videos - admin: удалить все видео
        if method == 'DELETE' and action == 'clear_videos':
            conn = get_db_connection()
            cur = conn.cursor()
            
            cur.execute("SELECT COUNT(*) FROM streams")
            count = cur.fetchone()[0]
            
            cur.execute("DELETE FROM likes")
            cur.execute("DELETE FROM streams")
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'success': True, 'deleted_count': count}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 404,
            'headers': headers,
            'body': json.dumps({'error': 'Not found'}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }