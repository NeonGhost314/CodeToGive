from flask import Blueprint, request, jsonify, make_response
import requests
import os

translate_bp = Blueprint('translate', __name__, url_prefix='/api/translate')

DEEPL_API_KEY = 'c0d81916-89ba-4308-a3c3-a75663697d1f:fx'

@translate_bp.route('/', methods=['POST', 'OPTIONS'])
@translate_bp.route('', methods=['POST', 'OPTIONS'])
def translate_text():

    if request.method == 'OPTIONS':
        response = make_response('', 204)
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:4200'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        response.headers['Access-Control-Max-Age'] = '3600'
        return response

    data = request.json
    text = data.get('text')
    target_lang = data.get('target_lang', 'EN-US')

    if not text:
        return jsonify({"error": "No text provided"}), 400

    if not DEEPL_API_KEY:
        return jsonify({"error": "DEEPL_API_KEY not configured"}), 500

    try:
        print(f"Traduction de: {text} vers {target_lang}")

        response = requests.post(
            "https://api-free.deepl.com/v2/translate",
            data={
                "text": text,
                "target_lang": target_lang
            },
            headers={
                "Authorization": f"DeepL-Auth-Key {DEEPL_API_KEY}"
            }
        )

        print(f"Status DeepL: {response.status_code}")

        if response.status_code != 200:
            return jsonify({
                "error": f"DeepL API error: {response.status_code}",
                "details": response.text
            }), response.status_code

        result = response.json()

        flask_response = jsonify(result)
        flask_response.headers['Access-Control-Allow-Origin'] = 'http://localhost:4200'
        return flask_response

    except Exception as e:
        error_response = jsonify({"error": str(e)})
        error_response.headers['Access-Control-Allow-Origin'] = 'http://localhost:4200'
        return error_response, 500
