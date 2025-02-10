from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Service(db.Model):
    __tablename__ = 'services'
    id = db.Column(db.Integer, primary_key=True)
    os = db.Column(db.String, nullable=True)
    start_time = db.Column(db.Date, nullable=True)
    end_time = db.Column(db.Date, nullable=True)
    customer_name = db.Column(db.String, nullable=True)
    address = db.Column(db.String, nullable=True)
    cpf = db.Column(db.String, nullable=True)
    phone = db.Column(db.String, nullable=True)
    workshop = db.Column(db.String, nullable=True)
    car = db.Column(db.String, nullable=True)
    license_plate = db.Column(db.String, nullable=True)
    motor = db.Column(db.String, nullable=True)
    motor_number = db.Column(db.String, nullable=True)
    km = db.Column(db.String, nullable=True)
    cylinders = db.Column(db.String, nullable=True)
    fixed = db.Column(db.String, nullable=True)
    movable = db.Column(db.String, nullable=True)
    price = db.Column(db.String, nullable=True)
    payment_method = db.Column(db.String, nullable=True)
    description = db.Column(db.String, nullable=True)
    receipt_certificate = db.Column(db.String, nullable=True)
    observations = db.Column(db.String, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "os": self.os,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "customer_name": self.customer_name,
            "address": self.address,
            "cpf": self.cpf,
            "phone": self.phone,
            "workshop": self.workshop,
            "car": self.car,
            "license_plate": self.license_plate,
            "motor": self.motor,
            "motor_number": self.motor_number,
            "km": self.km,
            "cylinders": self.cylinders,
            "fixed": self.fixed,
            "movable": self.movable,
            "price": self.price,
            "payment_method": self.payment_method,
            "description": self.description,
            "receipt_certificate": self.receipt_certificate,
            "observations": self.observations,
        }
