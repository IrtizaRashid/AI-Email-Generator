from flask import Flask, render_template, request, jsonify
import requests
import os

app = Flask(__name__)

OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_email():
    try:
        data = request.json
        recipient = data.get('recipient', '').strip()
        sender = data.get('sender', '').strip()
        subject = data.get('subject', '').strip()
        purpose = data.get('purpose', '').strip()
        points = data.get('points', '').strip()
        tone = data.get('tone', 'Professional').strip()
        length = data.get('length', 'Medium').strip()
        language = data.get('language', 'English').strip()
        instructions = data.get('instructions', '').strip()

        if not recipient:
            return jsonify({'error': 'Recipient name is required'}), 400
        if not sender:
            return jsonify({'error': 'Sender name is required'}), 400
        if not subject:
            return jsonify({'error': 'Subject is required'}), 400
        if not purpose:
            return jsonify({'error': 'Email purpose is required'}), 400

        system_prompt = f"""You are an expert email writer. Write ONLY the email text. Do not include any explanations or additional text outside the email.

Requirements:
- Use proper greeting
- Use proper closing
- Match the requested tone ({tone})
- Match the requested length ({length})
- Be grammatically correct
- Write in {language}
- Include all key points naturally in the email"""

        user_prompt = f"""Recipient: {recipient}
Sender: {sender}
Subject: {subject}
Purpose: {purpose}
Key Points: {points}
Additional Instructions: {instructions}

Write the email now:"""

        models_to_try = [
            "meta-llama/llama-3.1-8b-instruct",
            "google/gemma-2-9b-it",
            "meta-llama/llama-3-8b-instruct",
            "mistralai/mistral-nemo"
        ]

        email_text = None

        for model in models_to_try:
            try:
                headers = {
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "HTTP-Referer": "http://localhost:5000",
                    "X-Title": "AI Email Generator"
                }

                or_request = {
                    "model": model,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    "max_tokens": 1000,
                    "temperature": 0.7
                }

                response = requests.post(
                    OPENROUTER_API_URL,
                    json=or_request,
                    headers=headers,
                    timeout=60
                )

                if response.status_code == 200:
                    or_data = response.json()
                    email_text = or_data.get('choices', [{}])[0].get('message', {}).get('content', '').strip()
                    if email_text:
                        break
            except:
                continue

        if not email_text:
            return jsonify({'error': 'Failed to generate email. All models are currently unavailable.'}), 500

        return jsonify({
            'email': email_text,
            'error': None
        })

    except requests.exceptions.Timeout:
        return jsonify({'error': 'Request to OpenRouter API timed out. Please try again.'}), 504
    except requests.exceptions.ConnectionError:
        return jsonify({'error': 'Could not connect to OpenRouter API. Please check your internet connection.'}), 503
    except Exception as e:
        return jsonify({'error': f'An unexpected error occurred: {str(e)}'}), 500

if __name__ == '__main__':
    print("Starting AI Email Generator...")
    print("Using OpenRouter API with open source models")
    app.run(debug=True, host='0.0.0.0', port=5000)
