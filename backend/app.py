import os
import secrets
import datetime
import logging
from functools import wraps
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
from sqlalchemy.dialects.postgresql import JSON

# --- Logging Setup ---
LOG_FORMAT = "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
logging.basicConfig(level=logging.INFO, format=LOG_FORMAT)
logger = logging.getLogger("protein_store")

# --- Configuration ---
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "gif"}
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "protein123"
TOKEN_TTL_SECONDS = 60 * 60 * 8  # 8 hours

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
CORS(
    app,
    # resources={r"/api/*": {"origins": ["http://localhost:5173"]}},
    resources={r"/api/*": {"origins": [frontend_url]}},
    supports_credentials=True,
    expose_headers=["Authorization"],
    allow_headers=["Content-Type", "Authorization"],
)

# Database config (Postgres)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/protein_store"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

db = SQLAlchemy(app)

# Token store (in-memory)
_active_tokens = {}

# --- Models ---
class Product(db.Model):
    __tablename__ = "product"   # ✅ fixed table name

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, default="")
    price = db.Column(db.Float, nullable=False, default=0.0)
    category = db.Column(db.String(100))
    image_path = db.Column(db.String(500))
    featured = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "category": self.category,
            "image_url": f"/api/uploads/{os.path.basename(self.image_path)}" if self.image_path else None,
            "featured": self.featured,
            "created_at": self.created_at.isoformat(),
        }

class About(db.Model):
    __tablename__ = "about"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    content = db.Column(JSON)  # <-- Use JSON type
    last_updated = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "lastUpdated": self.last_updated.isoformat(),
        }


class Contact(db.Model):
    __tablename__ = "contact"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False, default="")
    phone = db.Column(db.String(50), nullable=False, default="")
    address = db.Column(db.Text, nullable=False, default="")
    whatsapp_link = db.Column(db.String(255), default="")
    last_updated = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "whatsappLink": self.whatsapp_link,
            "lastUpdated": self.last_updated.isoformat(),
        }
def ensure_columns():
    """Ensure all model columns exist in the database table."""
    with app.app_context():
        # Create table if it doesn't exist
        db.create_all()

        # Check for missing columns and add them
        inspector = db.inspect(db.engine)
        columns = [col['name'] for col in inspector.get_columns('contact')]
        if 'whatsapp_link' not in columns:
            with db.engine.connect() as conn:
                conn.execute(
                    'ALTER TABLE contact ADD COLUMN whatsapp_link VARCHAR(255);'
                )
                print("Added missing column 'whatsapp_link' to 'contact' table")

# --- Utils ---
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def require_token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            logger.warning("Unauthorized access attempt (missing token)")
            return jsonify({"error": "Missing authorization token"}), 401
        token = auth.split(" ", 1)[1]
        expiry = _active_tokens.get(token)
        if not expiry or expiry < datetime.datetime.utcnow().timestamp():
            logger.warning("Unauthorized access attempt (invalid/expired token)")
            return jsonify({"error": "Token invalid or expired"}), 401
        logger.info("Valid token used for request")
        return f(*args, **kwargs)
    return decorated


# --- Routes ---
@app.route("/api/uploads/<filename>")
def serve_upload(filename):
    logger.info(f"Serving upload: {filename}")
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


@app.route("/api/products", methods=["GET"])
def list_products():
    category = request.args.get("category")
    q = request.args.get("q")
    logger.info(f"Fetching products (category={category}, query={q})")

    query = Product.query
    if category:
        query = query.filter(Product.category == category)
    if q:
        like = f"%{q}%"
        query = query.filter(Product.name.ilike(like) | Product.description.ilike(like))

    products = query.order_by(Product.created_at.desc()).all()
    return jsonify([p.to_dict() for p in products])


@app.route("/api/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    logger.info(f"Fetching product id={product_id}")
    product = Product.query.get(product_id)
    if not product:
        logger.error(f"Product id={product_id} not found")
        return jsonify({"error": "Product not found"}), 404
    return jsonify(product.to_dict())


@app.route("/api/products", methods=["POST"])
# @require_token
def create_product():
    logger.info("Creating new product")
    name = request.form.get("name")
    if not name:
        return jsonify({"error": "Product name required"}), 400

    description = request.form.get("description", "")
    price = float(request.form.get("price", 0))
    category = request.form.get("category", "")

    # ✅ Parse featured correctly
    featured_str = request.form.get("featured", "false").lower()
    featured = featured_str in ("true", "1", "t", "yes", "on")

    image = request.files.get("image")
    image_path = None
    if image and allowed_file(image.filename):
        filename = secure_filename(f"{secrets.token_hex(8)}_{image.filename}")
        save_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        image.save(save_path)
        image_path = save_path
        logger.info(f"Image saved: {filename}")

    product = Product(
        name=name,
        description=description,
        price=price,
        category=category,
        image_path=image_path,
        featured=featured,
    )
    db.session.add(product)
    db.session.commit()
    return jsonify(product.to_dict()), 201


@app.route("/api/products/<int:product_id>", methods=["PUT"])
# @require_token
def update_product(product_id):
    logger.info(f"Updating product id={product_id}")
    product = Product.query.get(product_id)
    if not product:
        logger.error(f"Product id={product_id} not found for update")
        return jsonify({"error": "Product not found"}), 404

    data = request.form if request.form else request.json
    if not data:
        logger.error("Update failed: no data provided")
        return jsonify({"error": "No data provided"}), 400

    product.name = data.get("name", product.name)
    product.description = data.get("description", product.description)
    product.price = float(data.get("price", product.price))
    product.category = data.get("category", product.category)

    # ✅ Parse featured checkbox
    if "featured" in data:
        featured_str = data.get("featured", "false").lower()
        product.featured = featured_str in ("true", "1", "t", "yes", "on")

    if "image" in request.files:
        image = request.files["image"]
        if allowed_file(image.filename):
            filename = secure_filename(f"{secrets.token_hex(8)}_{image.filename}")
            save_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            image.save(save_path)
            product.image_path = save_path
            logger.info(f"Updated product image: {filename}")

    db.session.commit()
    logger.info(f"Product updated: {product.id}")
    return jsonify(product.to_dict())


@app.route("/api/products/<int:product_id>", methods=["DELETE"])
# @require_token
def delete_product(product_id):
    logger.info(f"Deleting product id={product_id}")
    product = Product.query.get(product_id)
    if not product:
        logger.error(f"Product id={product_id} not found for deletion")
        return jsonify({"error": "Product not found"}), 404
    db.session.delete(product)
    db.session.commit()
    logger.info(f"Product deleted: {product_id}")
    return jsonify({"success": True})


# --- ABOUT ---
@app.route("/api/about", methods=["GET"])
def get_about():
    about = About.query.first()
    return jsonify({"about": about.to_dict() if about else None})


@app.route("/api/about", methods=["PUT"])
def update_about():
    data = request.json or {}
    title = data.get("title", "")
    content = data.get("content", "")

    # ✅ sanitize content (remove surrounding quotes if present)
    if isinstance(content, str) and content.startswith('"') and content.endswith('"'):
        content = content[1:-1]

    about = About.query.first()
    if not about:
        about = About(title=title, content=content, last_updated=datetime.datetime.utcnow())
        db.session.add(about)
    else:
        about.title = title or about.title
        about.content = content or about.content
        about.last_updated = datetime.datetime.utcnow()

    db.session.commit()
    return jsonify({"success": True, "about": about.to_dict()})


# --- CONTACT ---
@app.route("/api/contact", methods=["GET"])
def get_contact():
    contact = Contact.query.first()
    return jsonify({"contact": contact.to_dict() if contact else None})


@app.route("/api/contact", methods=["PUT"])
def update_contact():
    data = request.json or {}
    print("Received contact payload:", data)
    email = data.get("email", "")
    phone = data.get("phone", "")
    address = data.get("address", "")
    whatsapp_link = data.get("whatsappLink", "")

    contact = Contact.query.first()
    if not contact:
        contact = Contact(
            email=email,
            phone=phone,
            address=address,
            whatsapp_link=whatsapp_link,
            last_updated=datetime.datetime.utcnow(),
        )
        db.session.add(contact)
    else:
        contact.email = email or contact.email
        contact.phone = phone or contact.phone
        contact.address = address or contact.address
        contact.whatsapp_link = whatsapp_link or contact.whatsapp_link
        contact.last_updated = datetime.datetime.utcnow()

    db.session.commit()
    return jsonify({"success": True, "contact": contact.to_dict()})


@app.route("/api/admin/login", methods=["POST"])
def admin_login():
    data = request.json or {}
    username = data.get("username")
    password = data.get("password")
    logger.info(f"Admin login attempt (username={username})")

    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        token = secrets.token_urlsafe(32)
        expiry = datetime.datetime.utcnow() + datetime.timedelta(seconds=TOKEN_TTL_SECONDS)
        _active_tokens[token] = expiry.timestamp()
        logger.info(f"Admin login successful (username={username})")
        return jsonify({"token": token, "expires_at": expiry.isoformat() + "Z"})
    logger.warning(f"Admin login failed (username={username})")
    return jsonify({"error": "Invalid credentials"}), 401


@app.route("/api/health", methods=["GET"])
def health():
    logger.info("Health check OK")
    return jsonify({"status": "ok"})


# --- Main ---
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        logger.info("Database initialized")
    logger.info("Starting Flask server on 0.0.0.0:8000")
    app.run(host="0.0.0.0", port=8000, debug=True)
