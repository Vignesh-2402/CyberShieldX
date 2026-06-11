from flask import Blueprint, request, jsonify

chatbot_bp = Blueprint("chatbot", __name__)

@chatbot_bp.route("/chat", methods=["POST"])
def chat():

    data = request.get_json(force=True)

    question = data.get("question", "").lower()

    if "phishing" in question:

        answer = """
Phishing is a cyber attack that tricks users into revealing
passwords, banking information, or personal data.
"""

    elif "malware" in question:

        answer = """
Malware is malicious software that damages systems,
steals information, or disrupts operations.
"""

    elif "ransomware" in question:

        answer = """
Ransomware encrypts files and demands money
to restore access.
"""

    elif "password" in question:

        answer = """
Use passwords with at least 12 characters,
uppercase letters, numbers, and symbols.
"""

    else:

        answer = """
I am CyberShield AI.
Ask me about phishing, malware,
ransomware, or password security.
"""

    return jsonify({
        "answer": answer
    })