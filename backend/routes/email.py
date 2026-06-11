from flask import Blueprint, request, jsonify

email_bp = Blueprint("email", __name__)

@email_bp.route("/analyze-email", methods=["POST"])
def analyze_email():

    data = request.get_json(force=True)

    email_text = data.get("email", "").lower()

    keywords = [
        "urgent",
        "verify",
        "password",
        "bank",
        "click here",
        "login now",
        "account suspended"
    ]

    matches = []

    for keyword in keywords:

        if keyword in email_text:
            matches.append(keyword)

    risk = "Low"

    if len(matches) >= 2:
        risk = "High"

    return jsonify({
        "risk": risk,
        "matches": matches,
        "count": len(matches)
    })