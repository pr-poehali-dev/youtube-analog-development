'''
Business: Create and manage live streaming sessions
Args: event with httpMethod, body with action (create_stream, start_stream, stop_stream), headers with X-User-Id
Returns: JSON with stream data including stream_key and status
'''

import json
import os
import uuid
from typing import Dict, Any
import psycopg2

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = event.get('headers', {})
    user_id = headers.get('X-User-Id') or headers.get('x-user-id')
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'User ID required'})
        }
    
    params = event.get('queryStringParameters', {}) or {}
    action = params.get('action', 'create_stream')
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    if action == 'create_stream':
        body_data = json.loads(event.get('body', '{}'))
        title = body_data.get('title', 'Untitled Stream')
        description = body_data.get('description', '')
        
        # Generate unique stream key
        stream_key = str(uuid.uuid4())
        
        cur.execute(
            "INSERT INTO t_p79487843_youtube_analog_devel.streams (title, user_id, description, is_live, stream_key, created_at) VALUES (%s, %s, %s, FALSE, %s, NOW()) RETURNING id",
            (title, int(user_id), description, stream_key)
        )
        stream_id = cur.fetchone()[0]
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'isBase64Encoded': False,
            'body': json.dumps({
                'stream_id': stream_id,
                'stream_key': stream_key,
                'stream_url': f'rtmp://stream.example.com/live/{stream_key}',
                'watch_url': f'/watch?v={stream_id}'
            })
        }
    
    elif action == 'start_stream':
        stream_id = params.get('stream_id')
        
        cur.execute(
            "UPDATE t_p79487843_youtube_analog_devel.streams SET is_live = TRUE WHERE id = %s AND user_id = %s",
            (int(stream_id), int(user_id))
        )
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'isBase64Encoded': False,
            'body': json.dumps({'message': 'Stream started', 'is_live': True})
        }
    
    elif action == 'stop_stream':
        stream_id = params.get('stream_id')
        
        cur.execute(
            "UPDATE t_p79487843_youtube_analog_devel.streams SET is_live = FALSE WHERE id = %s AND user_id = %s",
            (int(stream_id), int(user_id))
        )
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'isBase64Encoded': False,
            'body': json.dumps({'message': 'Stream stopped', 'is_live': False})
        }
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 400,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({'error': 'Invalid action'})
    }