from flask import Blueprint, request, jsonify

url_bp = Blueprint("url", __name__)

@url_bp.route("/analyze-url", methods=["POST"])
def analyze_url():

    data = request.get_json(force=True)

    url = data.get("url", "")

    score = 0
    reasons = []

    if url.startswith("https"):
        score += 1
    else:
        reasons.append("No HTTPS")

    if "@" not in url:
        score += 1
    else:
        reasons.append("Contains @ symbol")

    if url.count(".") <= 3:
        score += 1
    else:
        reasons.append("Too many subdomains")

    if "-" not in url:
        score += 1
    else:
        reasons.append("Contains suspicious hyphen")

    risk = "Safe"

    if score <= 2:
        risk = "Suspicious"

    return jsonify({
        "risk": risk,
        "score": score,
        "reasons": reasons
    })