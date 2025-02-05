from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from models import db, Service
from datetime import datetime

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
db.init_app(app)

with app.app_context():
    db.create_all()


@app.route('/services', methods=['GET'])
def list_services():
    query = Service.query

    for key, value in request.args.items():
        if hasattr(Service, key):
            query = query.filter(getattr(Service, key) == value)
    services = query.all()
    return jsonify([service.to_dict() for service in services]), 200


@app.route('/services', methods=['POST'])
def create_service():
    data = request.get_json()

    for field in ['start_time', 'end_time']:
        if field in data and data[field]:
            try:
                data[field] = datetime.fromisoformat(data[field]).date()
            except ValueError:
                data[field] = None

    new_service = Service(**data)
    db.session.add(new_service)
    db.session.commit()
    return jsonify(new_service.to_dict()), 201


@app.route('/services/<int:service_id>', methods=['PUT'])
def edit_service(service_id):
    service = Service.query.get_or_404(service_id)
    data = request.get_json()

    for key, value in data.items():
        if hasattr(service, key):
            if key in ['start_time', 'end_time'] and value:
                try:
                    value = datetime.fromisoformat(value).date()
                except ValueError:
                    value = None
            setattr(service, key, value)
    db.session.commit()
    return jsonify(service.to_dict()), 200


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
