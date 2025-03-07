from flask import Flask
from routes import routes
import os

app = Flask(__name__)
app.register_blueprint(routes)

if __name__ == "__main__":
    from waitress import serve
    port = int(os.environ.get("PORT", os.environ.get("WEBSITES_PORT", 8000)))  # Check PORT, then WEBSITES_PORT, then default to 8000
    serve(app, host="0.0.0.0", port=port)
