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
            
            username = body_data.get('username')
            email = body_data.get('email')
            password = body_data.get('password')
            display_name = body_data.get('display_name')
            
            if not all([username, email, password, display_name]):
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Заполните все поля'}),
                    'isBase64Encoded': False
                }
            
            conn = get_db_connection()
            cur = conn.cursor(cursor_factory=RealDictCursor)
            
            cur.execute("SELECT id FROM users WHERE email = %s OR username = %s", (email, username))
            existing = cur.fetchone()
            
            if existing:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Email или username уже используется'}),
                    'isBase64Encoded': False
                }
            
            avatar_url = f"https://api.dicebear.com/7.x/avataaars/svg?seed={username}"
            
            cur.execute("""
                INSERT INTO users (username, email, display_name, avatar_url, bio, subscriber_count, is_verified)
                VALUES (%s, %s, %s, %s, %s, 0, false)
                RETURNING id, username, email, display_name, avatar_url, is_verified, subscriber_count
            """, (username, email, display_name, avatar_url, 'Новый стример'))
            
            user = cur.fetchone()
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps({'user': dict(user)}, default=str),
                'isBase64Encoded': False
            }
        
        # POST /?action=login - вход пользователя
        if method == 'POST' and action == 'login':
            body_data = json.loads(event.get('body', '{}'))
            
            email = body_data.get('email')
            password = body_data.get('password')
            
            if not email or not password:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Email и пароль обязательны'}),
                    'isBase64Encoded': False
                }
            
            conn = get_db_connection()
            cur = conn.cursor(cursor_factory=RealDictCursor)
            
            cur.execute("""
                SELECT id, username, email, display_name, avatar_url, is_verified, subscriber_count
                FROM users WHERE email = %s
            """, (email,))
            
            user = cur.fetchone()
            cur.close()
            conn.close()
            
            if not user:
                return {
                    'statusCode': 401,
                    'headers': headers,
                    'body': json.dumps({'error': 'Неверный email или пароль'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'user': dict(user)}, default=str),
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