from flask import Flask
from models import db
from routes.user_routes import user_bp
from routes.story_routes import story_bp
from routes.chapter_routes import chapter_bp
from routes.donation_routes import donation_bp
from routes.donation_pot_routes import pot_bp
from routes.subscription_routes import sub_bp
from routes.donation_goal_routes import goal_bp
from routes.dashboard_routes import dashboard_bp

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:1234@localhost/athena_hackathon"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

app.register_blueprint(user_bp)
app.register_blueprint(story_bp)
app.register_blueprint(chapter_bp)
app.register_blueprint(donation_bp)
app.register_blueprint(pot_bp)
app.register_blueprint(sub_bp)
app.register_blueprint(goal_bp)
app.register_blueprint(dashboard_bp)

@app.route("/")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    app.run(debug=True)
