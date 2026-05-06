from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import stripe

app = Flask(__name__)
CORS(app)

# CONFIG
stripe.api_key = "YOUR_STRIPE_SECRET"

# DATABASE
def get_db():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price REAL,
        image TEXT,
        description TEXT
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        email TEXT
    )
    """)

    conn.commit()
    conn.close()

init_db()

# ---------------- AUTH ----------------

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    email = data["email"]
    password = generate_password_hash(data["password"])

    conn = get_db()
    try:
        conn.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, password))
        conn.commit()
        return jsonify({"message": "User created"})
    except:
        return jsonify({"error": "User exists"}), 400

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data["email"]
    password = data["password"]

    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE email=?", (email,)).fetchone()

    if user and check_password_hash(user["password"], password):
        return jsonify({"message": "Login success"})
    return jsonify({"error": "Invalid credentials"}), 401

# ---------------- PRODUCTS ----------------

@app.route("/products", methods=["GET"])
def get_products():
    conn = get_db()
    products = conn.execute("SELECT * FROM products").fetchall()
    return jsonify([dict(p) for p in products])

@app.route("/add-product", methods=["POST"])
def add_product():
    data = request.json

    conn = get_db()
    conn.execute(
        "INSERT INTO products (name, price, image, description) VALUES (?, ?, ?, ?)",
        (data["name"], data["price"], data["image"], data["description"])
    )
    conn.commit()

    return jsonify({"message": "Product added"})

# ---------------- ORDER ----------------

@app.route("/order", methods=["POST"])
def order():
    data = request.json

    conn = get_db()
    conn.execute(
        "INSERT INTO orders (product_id, email) VALUES (?, ?)",
        (data["product_id"], data["email"])
    )
    conn.commit()

    return jsonify({"message": "Order placed"})

# ---------------- STRIPE ----------------

@app.route("/create-checkout-session", methods=["POST"])
def create_checkout():
    data = request.json

    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': 'usd',
                'product_data': {'name': data["name"]},
                'unit_amount': int(float(data["price"]) * 100),
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url='http://localhost:5500/success.html',
        cancel_url='http://localhost:5500/cancel.html',
    )

    return jsonify({"id": session.id})

if __name__ == "__main__":
    app.run(debug=True) 
SECRET_KEY = "supersecret"
STRIPE_KEY = "YOUR_STRIPE_SECRET" 
from flask import Flask
from flask_cors import CORS
from routes.auth import auth_routes
from routes.products import product_routes
from routes.orders import order_routes

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_routes)
app.register_blueprint(product_routes)
app.register_blueprint(order_routes)

if __name__ == "__main__":
    app.run(debug=True) 
    import jwt
from datetime import datetime, timedelta
from config import SECRET_KEY

def generate_token(email):
    return jwt.encode({
        "email": email,
        "exp": datetime.utcnow() + timedelta(days=1)
    }, SECRET_KEY, algorithm="HS256")

def verify_token(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except:
        return None 
    from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
from utils.jwt import generate_token

auth_routes = Blueprint("auth", __name__)

def db():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

@auth_routes.route("/signup", methods=["POST"])
def signup():
    data = request.json
    email = data["email"]
    password = generate_password_hash(data["password"])

    conn = db()
    try:
        conn.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, password))
        conn.commit()
        return jsonify({"msg": "created"})
    except:
        return jsonify({"error": "exists"}), 400

@auth_routes.route("/login", methods=["POST"])
def login():
    data = request.json
    conn = db()
    user = conn.execute("SELECT * FROM users WHERE email=?", (data["email"],)).fetchone()

    if user and check_password_hash(user["password"], data["password"]):
        token = generate_token(data["email"])
        return jsonify({"token": token})

    return jsonify({"error": "invalid"}), 401 
from flask import Blueprint, request, jsonify
import sqlite3

product_routes = Blueprint("products", __name__)

def db():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

@product_routes.route("/products", methods=["GET"])
def get_products():
    conn = db()
    data = conn.execute("SELECT * FROM products").fetchall()
    return jsonify([dict(x) for x in data])

@product_routes.route("/products", methods=["POST"])
def add_product():
    data = request.json
    conn = db()

    conn.execute("INSERT INTO products (name, price) VALUES (?, ?)",
                 (data["name"], data["price"]))
    conn.commit()

    return jsonify({"msg": "added"})from flask import Blueprint, request, jsonify
import sqlite3

order_routes = Blueprint("orders", __name__)

def db():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

@order_routes.route("/orders", methods=["POST"])
def create_order():
    data = request.json

    conn = db()
    conn.execute("INSERT INTO orders (product_id, email) VALUES (?, ?)",
                 (data["product_id"], data["email"]))
    conn.commit()

    return jsonify({"msg": "order placed"}) 
# app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

SECRET_KEY = "supersecretkey"

# ---------------- DATABASE ----------------
def get_db():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT, password TEXT)")
    cur.execute("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT, price REAL)")
    cur.execute("CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY, product_id INTEGER, email TEXT)")

    conn.commit()
    conn.close()

init_db()

# ---------------- AUTH ----------------
def create_token(email):
    return jwt.encode({
        "email": email,
        "exp": datetime.utcnow() + timedelta(days=1)
    }, SECRET_KEY, algorithm="HS256")

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    conn = get_db()

    try:
        conn.execute("INSERT INTO users (email, password) VALUES (?, ?)",
                     (data["email"], generate_password_hash(data["password"])))
        conn.commit()
        return jsonify({"msg": "User created"})
    except:
        return jsonify({"error": "User exists"}), 400

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    conn = get_db()

    user = conn.execute("SELECT * FROM users WHERE email=?", (data["email"],)).fetchone()

    if user and check_password_hash(user["password"], data["password"]):
        token = create_token(data["email"])
        return jsonify({"token": token})

    return jsonify({"error": "Invalid login"}), 401

# ---------------- PRODUCTS ----------------
@app.route("/products", methods=["GET"])
def products():
    conn = get_db()
    data = conn.execute("SELECT * FROM products").fetchall()
    return jsonify([dict(x) for x in data])

@app.route("/add-product", methods=["POST"])
def add_product():
    data = request.json
    conn = get_db()

    conn.execute("INSERT INTO products (name, price) VALUES (?, ?)",
                 (data["name"], data["price"]))
    conn.commit()

    return jsonify({"msg": "Product added"})

# ---------------- ORDER ----------------
@app.route("/order", methods=["POST"])
def order():
    data = request.json

    conn = get_db()
    conn.execute("INSERT INTO orders (product_id, email) VALUES (?, ?)",
                 (data["product_id"], data["email"]))
    conn.commit()

    return jsonify({"msg": "Order placed"})

if __name__ == "__main__":
    app.run(debug=True) 
    # ADD THIS IN app.py

@app.route("/orders", methods=["GET"])
def get_orders():
    conn = get_db()
    orders = conn.execute("SELECT * FROM orders").fetchall()
    return jsonify([dict(o) for o in orders]) 
SECRET_KEY = "super-secret"
STRIPE_KEY = "your-stripe-key"
DB_URL = "postgresql://user:password@localhost/alifo" 
import psycopg2
from config import DB_URL

def get_db():
    return psycopg2.connect(DB_URL) 
def create_tables(conn):
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'user'
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT,
        price FLOAT,
        image TEXT,
        seller TEXT
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        product_id INTEGER,
        buyer TEXT,
        status TEXT DEFAULT 'pending'
    )
    """)

    conn.commit() 
    from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from db import get_db
from config import SECRET_KEY

auth = Blueprint("auth", __name__)

@auth.route("/signup", methods=["POST"])
def signup():
    data = request.json
    conn = get_db()
    cur = conn.cursor()

    cur.execute("INSERT INTO users (email, password) VALUES (%s, %s)",
                (data["email"], generate_password_hash(data["password"])))
    conn.commit()

    return jsonify({"msg": "created"}) 
from flask import Blueprint, request, jsonify
from db import get_db

products = Blueprint("products", __name__)

@products.route("/products", methods=["GET"])
def get_products():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM products")
    data = cur.fetchall()

    return jsonify(data) 
from flask import Blueprint, jsonify
from db import get_db

admin = Blueprint("admin", __name__)

@admin.route("/admin/orders", methods=["GET"])
def all_orders():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM orders")
    return jsonify(cur.fetchall()) 
import stripe
stripe.api_key = "YOUR_KEY"

def create_payment(name, price):
    return stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': 'usd',
                'product_data': {'name': name},
                'unit_amount': int(price * 100),
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url='https://yourdomain.com/success',
        cancel_url='https://yourdomain.com/cancel',
    ) 
# middleware/auth.py

from flask import request, jsonify
import jwt
from config import SECRET_KEY

def protect(f):
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"error": "No token"}), 401

        try:
            jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)

    wrapper.__name__ = f.__name__
    return wrapper 
# services/ai.py

from openai import OpenAI

client = OpenAI(api_key="YOUR_KEY")

def generate_product(name):
    prompt = f"Write high-converting ecommerce product description for {name}"

    res = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    return res.choices[0].message.content 
# services/billing.py

import stripe
stripe.api_key = "YOUR_KEY"

def create_subscription(customer_id, price_id):
    return stripe.Subscription.create(
        customer=customer_id,
        items=[{"price": price_id}]
    ) 
import redis

cache = redis.Redis(host='localhost', port=6379)

def get_cached_products():
    data = cache.get("products")

    if data:
        return data

    # fetch from DB then cache  
    git init
git add .
git commit -m "alifo backend"
git branch -M main
git remote add origin https://github.com/yourname/alifo-backend.git
git push -u origin main
