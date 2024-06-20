"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint # type: ignore
from api.models import db, User, Invoice
from api.utils import generate_sitemap, APIException
from flask_cors import CORS # type: ignore

from flask_jwt_extended import create_access_token # type: ignore
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from werkzeug.security import generate_password_hash, check_password_hash   # type: ignore

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/token', methods=['POST'])
def generate_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    email = email.lower()
    user = User.query.filter_by(email=email, password=password).first()

    if user is None:
        response = {
            "msg": "Email or Password does not match."
        }
        return jsonify(response), 401
    
    access_token = create_access_token(identity=user.id)
    response = {
        "access_token": access_token,
        "user_id": user.id,
        "msg": f"Welcome {user.email}! This worked!"
    }

    return jsonify(response), 200

@api.route('/signup', methods=['POST'])
def register_user():
    email = request.json.get('email', None)
    password = request.json.get('password', None)

    email = email.lower()
    user = User.query.filter_by(email=email).first()

    if user is not None and user.email == email:
       response = {
          'msg' : 'User already exist.'
       }
       
       return jsonify(response), 403
    
    user = User()
    user.email = email
    user.password = generate_password_hash(password)
    user.is_active = True
    db.session.add(user)
    db.session.commit()

    response = {
       'msg': f'Congratulations {user.email}. You have sussefully signed up!'
    }
    return jsonify(response), 200


@api.route('/invoices', methods=['GET'])
@jwt_required()
def get_invoice():
    user_id = get_jwt_identity()
    invoices = Invoice.query.filter_by(user_id=user_id).all()
    return jsonify({
        "invoices": [invoice.serialize() for invoice in invoices],
        "msg": "Invoices retrieved successfully"
    }), 200
