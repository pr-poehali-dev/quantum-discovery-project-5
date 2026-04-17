import os
import json
import base64
from openai import OpenAI

def handler(event: dict, context) -> dict:
    """Чат с ИИ Павлюк AI — принимает текст и опционально фото (base64), возвращает ответ GPT-4o."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')
    message = body.get('message', '').strip()
    image_base64 = body.get('image')

    if not message and not image_base64:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Сообщение не может быть пустым'})
        }

    client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])

    content = []

    if message:
        content.append({'type': 'text', 'text': message})

    if image_base64:
        image_url = f"data:image/jpeg;base64,{image_base64}"
        content.append({
            'type': 'image_url',
            'image_url': {'url': image_url, 'detail': 'high'}
        })

    response = client.chat.completions.create(
        model='gpt-4o',
        messages=[
            {
                'role': 'system',
                'content': 'Ты — Павлюк AI, умный и дружелюбный ИИ-ассистент. Отвечай на русском языке, кратко и по существу. Если пользователь прислал фото — внимательно его проанализируй и ответь на вопрос.'
            },
            {
                'role': 'user',
                'content': content
            }
        ],
        max_tokens=1000
    )

    reply = response.choices[0].message.content

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'reply': reply}, ensure_ascii=False)
    }
