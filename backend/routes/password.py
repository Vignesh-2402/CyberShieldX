from flask import Blueprint, request, jsonify
import re

password_bp = Blueprint("password", __name__)

@password_bp.route("/check-password", methods=["POST"])
def check_password():

    data = request.get_json(force=True)

    password = data.get("password", "")

    score = 0

    if len(password) >= 8:
        score += 1

    if re.search(r"[A-Z]", password):
        score += 1

    if re.search(r"[a-z]", password):
        score += 1

    if re.search(r"\d", password):
        score += 1

    if re.search(r"[!@#$%^&*()]", password):
        score += 1

    if score <= 2:
        strength = "Weak"

    elif score <= 4:
        strength = "Medium"

    else:
        strength = "Strong"

    return jsonify({
        "strength": strength,
        "score": score
    })