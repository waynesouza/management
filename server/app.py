from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from models import db, Budget, Service
from datetime import datetime
from utils.export_pdf import export_budget_pdf

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
db.init_app(app)

with app.app_context():
    db.create_all()


# Service routes


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


# Budget routes


@app.route('/budget', methods=['POST', 'PUT'])
def save_budget():
    data = request.get_json()
    if not data or 'service_id' not in data or 'data' not in data:
        return jsonify({'error': 'Invalid payload'}), 400

    service_id = data['service_id']
    budget_data = data['data']

    budget = Budget.query.filter_by(service_id=service_id).first()

    if budget:
        budget.data = budget_data
        message = 'Budget updated successfully'
    else:
        budget = Budget(service_id=service_id, data=budget_data)
        db.session.add(budget)
        message = 'Budget created successfully'

    try:
        db.session.commit()
        return jsonify({'message': message, 'budget': budget.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/budget/<int:service_id>', methods=['GET'])
def get_budget(service_id):
    budget = Budget.query.filter_by(service_id=service_id).first()
    if budget:
        return jsonify(budget.to_dict()), 200
    return jsonify({'error': 'Budget not found'}), 404


@app.route('/budget/<int:service_id>', methods=['DELETE'])
def delete_budget(service_id):
    budget = Budget.query.filter_by(service_id=service_id).first()
    if not budget:
        return jsonify({'error': 'Budget not found'}), 404

    try:
        db.session.delete(budget)
        db.session.commit()
        return jsonify({'message': 'Budget deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/budget/export/<int:service_id>', methods=['GET'])
def export_budget(service_id):
    response, error = export_budget_pdf(service_id)
    if error:
        return jsonify({'error': error}), 500
    if response is None:
        return jsonify({'error': 'Budget not found'}), 404
    return response


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
