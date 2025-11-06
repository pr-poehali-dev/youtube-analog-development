'''
Business: Upload video files and create video records
Args: event with httpMethod, body (multipart/form-data), headers with X-User-Id
Returns: JSON with video_id and upload status
'''

import json
import base64
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
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    headers = event.get('headers', {})
    user_id = headers.get('X-User-Id') or headers.get('x-user-id')
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'User ID required'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    title = body_data.get('title', 'Untitled Video')
    description = body_data.get('description', '')
    video_url = body_data.get('video_url', '')
    thumbnail_url = body_data.get('thumbnail_url', '')
    duration = body_data.get('duration', 0)
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Create video record
    cur.execute(
        "INSERT INTO t_p79487843_youtube_analog_devel.streams (title, user_id, video_url, thumbnail_url, duration, description, is_live, created_at) VALUES (%s, %s, %s, %s, %s, %s, FALSE, NOW()) RETURNING id",
        (title, int(user_id), video_url, thumbnail_url, int(duration), description)
    )
    video_id = cur.fetchone()[0]
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'video_id': video_id,
            'message': 'Video uploaded successfully'
        })
    }